import { useEffect, useRef } from 'react';

// WebGL2 stable-fluids simulation: the cursor injects velocity + colour, which then swirls and fades.
// Fills its nearest positioned parent, so the effect stays inside that section.
const CONFIG = {
  simRes: 128,
  dyeRes: 1024,
  densityDissipation: 2,
  velocityDissipation: 1,
  pressure: 0.1,
  pressureIterations: 20,
  curl: 3,
  splatRadius: 0.25,
  splatForce: 6000,
  intensity: 0.3,
  colorSpeed: 0.15,
};

const VERT = `#version 300 es
in vec2 pos; uniform vec2 texel; out vec2 uv, L, R, T, B;
void main() {
  uv = pos * .5 + .5;
  L = uv - vec2(texel.x, 0); R = uv + vec2(texel.x, 0);
  T = uv + vec2(0, texel.y); B = uv - vec2(0, texel.y);
  gl_Position = vec4(pos, 0, 1);
}`;

const HEAD = `#version 300 es
precision highp float; precision highp sampler2D;
in vec2 uv, L, R, T, B; uniform vec2 texel; out vec4 o;
`;

const FRAG = {
  splat: `uniform sampler2D t; uniform vec3 color; uniform vec2 point; uniform float radius, aspect;
    void main() { vec2 d = uv - point; d.x *= aspect; o = vec4(texture(t, uv).xyz + exp(-dot(d, d) / radius) * color, 1); }`,
  advect: `uniform sampler2D v, s; uniform float dt, dissipation;
    void main() { o = texture(s, uv - dt * texture(v, uv).xy * texel) / (1. + dissipation * dt); }`,
  divergence: `uniform sampler2D v;
    void main() { o = vec4(.5 * (texture(v, R).x - texture(v, L).x + texture(v, T).y - texture(v, B).y), 0, 0, 1); }`,
  curl: `uniform sampler2D v;
    void main() { o = vec4(.5 * (texture(v, R).y - texture(v, L).y - texture(v, T).x + texture(v, B).x), 0, 0, 1); }`,
  vorticity: `uniform sampler2D v, c; uniform float curl, dt;
    void main() {
      vec2 f = .5 * vec2(abs(texture(c, T).x) - abs(texture(c, B).x), abs(texture(c, R).x) - abs(texture(c, L).x));
      f = f / (length(f) + 1e-4) * curl * texture(c, uv).x * vec2(1, -1);
      o = vec4(texture(v, uv).xy + f * dt, 0, 1);
    }`,
  pressure: `uniform sampler2D p, d;
    void main() { o = vec4(.25 * (texture(p, L).x + texture(p, R).x + texture(p, T).x + texture(p, B).x - texture(d, uv).x), 0, 0, 1); }`,
  gradient: `uniform sampler2D p, v;
    void main() { o = vec4(texture(v, uv).xy - vec2(texture(p, R).x - texture(p, L).x, texture(p, T).x - texture(p, B).x), 0, 1); }`,
  scale: `uniform sampler2D t; uniform float value;
    void main() { o = value * texture(t, uv); }`,
  display: `uniform sampler2D t;
    void main() { vec3 c = min(texture(t, uv).rgb, 1.); o = vec4(c, max(c.r, max(c.g, c.b))); }`,
};

// Fully saturated rainbow colour that cycles over time.
const hueColor = (h) =>
  [5, 3, 1].map((n) => {
    const k = (n + h * 6) % 6;
    return CONFIG.intensity * (1 - Math.max(Math.min(k, 4 - k, 1), 0));
  });

export default function FluidCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const gl = canvas.getContext('webgl2', { antialias: false, depth: false });
    if (!gl?.getExtension('EXT_color_buffer_float')) return;

    const shader = (type, src) => {
      const s = gl.createShader(type);
      gl.shaderSource(s, src);
      gl.compileShader(s);
      return s;
    };

    const programs = Object.fromEntries(
      Object.entries(FRAG).map(([name, src]) => {
        const p = gl.createProgram();
        gl.attachShader(p, shader(gl.VERTEX_SHADER, VERT));
        gl.attachShader(p, shader(gl.FRAGMENT_SHADER, HEAD + src));
        gl.bindAttribLocation(p, 0, 'pos');
        gl.linkProgram(p);
        const u = {};
        for (let i = 0; i < gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); i++) {
          const { name: n } = gl.getActiveUniform(p, i);
          u[n] = gl.getUniformLocation(p, n);
        }
        return [name, { p, u }];
      })
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);

    const target = (w, h) => {
      const tex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, tex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.HALF_FLOAT, null);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const fb = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fb);
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tex, 0);
      return { tex, fb, w, h };
    };
    const pingPong = (w, h) => ({
      read: target(w, h),
      write: target(w, h),
      swap() { [this.read, this.write] = [this.write, this.read]; },
    });

    const resize = () => {
      const dpr = Math.min(devicePixelRatio, 2);
      canvas.width = canvas.clientWidth * dpr;
      canvas.height = canvas.clientHeight * dpr;
    };
    resize();

    const gridSize = (res) => {
      const aspect = canvas.clientWidth / canvas.clientHeight;
      return aspect > 1 ? [Math.round(res * aspect), res] : [res, Math.round(res / aspect)];
    };
    const [w, h] = gridSize(CONFIG.simRes);
    const texel = [1 / w, 1 / h];
    const velocity = pingPong(w, h);
    const pressure = pingPong(w, h);
    const divergence = target(w, h);
    const curl = target(w, h);
    const dye = pingPong(...gridSize(CONFIG.dyeRes));

    // Draws a full-screen quad with the given program into `out` (or the screen).
    const run = (name, uniforms, out) => {
      const { p, u } = programs[name];
      gl.useProgram(p);
      gl.uniform2fv(u.texel, texel);
      let unit = 0;
      for (const [key, value] of Object.entries(uniforms)) {
        if (value.tex) {
          gl.activeTexture(gl.TEXTURE0 + unit);
          gl.bindTexture(gl.TEXTURE_2D, value.tex);
          gl.uniform1i(u[key], unit++);
        } else if (Array.isArray(value)) gl[`uniform${value.length}fv`](u[key], value);
        else gl.uniform1f(u[key], value);
      }
      gl.bindFramebuffer(gl.FRAMEBUFFER, out?.fb ?? null);
      gl.viewport(0, 0, out?.w ?? canvas.width, out?.h ?? canvas.height);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    const step = (name, uniforms, buffer) => {
      run(name, uniforms, buffer.write);
      buffer.swap();
    };

    let last;
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = 1 - (e.clientY - rect.top) / rect.height;
      if (y < 0 || y > 1) {
        last = null;
        return;
      }
      if (last) {
        const aspect = rect.width / rect.height;
        const radius = (CONFIG.splatRadius / 100) * Math.max(aspect, 1);
        const force = [(x - last.x) * CONFIG.splatForce, (y - last.y) * CONFIG.splatForce, 0];
        const color = hueColor((performance.now() / 1000) * CONFIG.colorSpeed);
        step('splat', { t: velocity.read, point: [x, y], color: force, radius, aspect }, velocity);
        step('splat', { t: dye.read, point: [x, y], color, radius, aspect }, dye);
      }
      last = { x, y };
    };

    let prev = performance.now();
    let frame;
    const loop = (now) => {
      const dt = Math.min((now - prev) / 1000, 0.016);
      prev = now;
      frame = requestAnimationFrame(loop);
      if (canvas.getBoundingClientRect().bottom < 0) return; // scrolled out of view: save the GPU
      run('curl', { v: velocity.read }, curl);
      step('vorticity', { v: velocity.read, c: curl, curl: CONFIG.curl, dt }, velocity);
      run('divergence', { v: velocity.read }, divergence);
      step('scale', { t: pressure.read, value: CONFIG.pressure }, pressure);
      for (let i = 0; i < CONFIG.pressureIterations; i++) step('pressure', { p: pressure.read, d: divergence }, pressure);
      step('gradient', { p: pressure.read, v: velocity.read }, velocity);
      step('advect', { v: velocity.read, s: velocity.read, dt, dissipation: CONFIG.velocityDissipation }, velocity);
      step('advect', { v: velocity.read, s: dye.read, dt, dissipation: CONFIG.densityDissipation }, dye);
      run('display', { t: dye.read });
    };
    frame = requestAnimationFrame(loop);

    addEventListener('resize', resize);
    addEventListener('pointermove', onMove);
    return () => {
      cancelAnimationFrame(frame);
      removeEventListener('resize', resize);
      removeEventListener('pointermove', onMove);
    };
  }, []);

  return <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 -z-10 size-full" />;
}
