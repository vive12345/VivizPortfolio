// Numbered section title, e.g. "01 ——" above "ABOUT ME".
export default function SectionHeading({ number, children }) {
  return (
    <>
      <p className="flex items-center gap-3 text-sm font-bold tracking-widest text-emerald-600">
        {number} <span className="h-px w-10 bg-emerald-600" />
      </p>
      <h2 className="mt-2 text-5xl font-extrabold uppercase tracking-tight sm:text-6xl">{children}</h2>
    </>
  );
}
