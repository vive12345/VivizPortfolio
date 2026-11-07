// Sends visitors on the default Cloudflare address (vivizportfolio.pages.dev) and on www
// to the main domain, keeping the same page path. Per-deployment preview links are left alone.
const DOMAIN = 'vivizportfolio.com';
const REDIRECT_FROM = ['vivizportfolio.pages.dev', `www.${DOMAIN}`];

export const onRequest = ({ request, next }) => {
  const url = new URL(request.url);
  if (!REDIRECT_FROM.includes(url.hostname)) return next();
  url.hostname = DOMAIN;
  url.protocol = 'https:';
  return Response.redirect(url.toString(), 301);
};
