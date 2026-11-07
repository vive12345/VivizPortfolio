// Click handler for in-page links: smoothly scrolls to the target section without adding
// "#section" to the address bar. Falls back to the normal link if the target is missing.
export default function scrollToSection(e) {
  const id = e.currentTarget.getAttribute('href').slice(1);
  const target = id ? document.getElementById(id) : document.body;
  if (!target) return;
  e.preventDefault();
  target.scrollIntoView({ behavior: 'smooth' });
}
