/**
 * Nonce-based Content-Security-Policy for web.
 *
 * The CSP was previously served by the infra/ingress layer (CloudFront) and
 * allow-listed Next's inline bootstrap scripts by two pinned `sha256-…` hashes.
 * Next 16 changed those inline scripts, so the hashes no longer matched and
 * every page's inline script was blocked — which broke SSR Suspense (React
 * error #419) and forced client-side rendering.
 *
 * Instead we mint a per-request nonce and put it in `script-src`. The nonce is
 * applied by the custom server (see `@island.is/infra-next-server` bootstrap
 * `csp` option), which sets it on the request's `content-security-policy` header
 * before Next renders. Next reads it (getScriptNonceFromHeader) and stamps its
 * own inline scripts. This is done in the custom server rather than Next
 * middleware because middleware request-header overrides do not reach the pages
 * renderer through the Express custom server.
 *
 * NB: Next 16's pages router does NOT forward that nonce into React 19's
 * streaming renderer, so React's inline Suspense streaming scripts ($RC/$RB…)
 * come out un-nonced, get CSP-blocked, and break SSR (React #419) on their own.
 * A `yarn patch` on `next` closes that gap by passing the nonce to
 * `renderToInitialFizzStream` (see .yarn/patches/next-npm-*.patch). Both this CSP
 * wiring AND that patch are required for a working nonce CSP on the pages router.
 *
 * Ownership: prefer a single source of truth at the ingress. When CloudFront
 * sends the policy as the `x-csp-template` request header (with a `{nonce}`
 * placeholder), `buildCsp` just substitutes the per-request nonce — DevOps keeps
 * owning the allow-list, the app owns only the nonce. When that header is absent
 * the app falls back to the bundled policy below (copied verbatim from the
 * previous CloudFront policy; only `script-src` differs — the two stale
 * `sha256-…` hashes are replaced by the nonce), so ownership can move to the
 * ingress later with no app redeploy.
 */
export const buildCsp = (nonce: string, template?: string): string =>
  template ? injectNonce(template, nonce) : bundledPolicy(nonce)

/**
 * Substitute the per-request nonce into an ingress-provided policy template.
 * Prefers an explicit `{nonce}` placeholder; if none is present, adds the nonce
 * source to `script-src` (or appends a `script-src` if the template lacks one).
 */
const injectNonce = (template: string, nonce: string): string => {
  const source = `'nonce-${nonce}'`
  if (template.includes('{nonce}')) {
    return template.split('{nonce}').join(source)
  }
  if (/(^|;)\s*script-src\s/i.test(template)) {
    return template.replace(/((^|;)\s*script-src)\s/i, `$1 ${source} `)
  }
  return `${template.replace(/;\s*$/, '')}; script-src ${source}`
}

const bundledPolicy = (nonce: string): string => {
  const directives: Record<string, string[]> = {
    'default-src': [
      "'self'",
      'https://static.zdassets.com',
      'https://ekr.zdassets.com',
      'https://digitaliceland.zendesk.com',
      'https://*.zopim.com',
      'wss://*.zendesk.com',
      'wss://*.zopim.com',
      'https://*.s3.eu-west-1.amazonaws.com',
    ],
    'img-src': [
      "'self'",
      'blob:',
      'https://island.is',
      'data:',
      'https://images.ctfassets.net',
      'https://boost-files-general-eu-west-1-prod.s3-eu-west-1.amazonaws.com',
      'https://i.vimeocdn.com',
      'https://files.reglugerd.is',
      'https://island-is-dev-upload-api.s3.eu-west-1.amazonaws.com',
      'https://island-is-staging-upload-api.s3.eu-west-1.amazonaws.com',
      'https://island-is-prod-upload-api.s3.eu-west-1.amazonaws.com',
      'https://v2assets.zopim.io',
      'https://static.zdassets.com',
      'https://cdn.livechatinc.com',
      'https://cdn.livechat-static.com/api/file/lc/img/rich-greetings/handwave.gif',
      'https://xpex.orri.is/ords/oebs/logo/',
      'https://adverts.official-journal.dev.dmr-dev.cloud',
      'https://*.mypurecloud.de',
      'https://*.euc1.pure.cloud',
      'https://adverts.stjornartidindi.is',
      'https://www.skra.is/library/Myndir/formio/',
      'https://*.zendesk.com',
      'https://gravatar.com',
    ],
    'media-src': [
      "'self'",
      'data:',
      'https://videos.ctfassets.net',
      'https://cdn.livechatinc.com',
      'https://webapi.hugverk.is',
      'https://*.mypurecloud.de',
      'https://*.euc1.pure.cloud',
    ],
    // Only change from the CloudFront policy: the two stale `sha256-…` hashes are
    // replaced by the per-request nonce.
    'script-src': [
      "'self'",
      "'unsafe-eval'",
      `'nonce-${nonce}'`,
      'https://*.list-manage.com',
      'https://plausible.io',
      'https://*.readspeaker.com',
      'https://*.boost.ai',
      'https://cdnjs.cloudflare.com',
      'https://*.livechatinc.com',
      'https://*.assistant.watson.appdomain.cloud',
      'https://*.zopim.com',
      'https://*.statuspage.io',
      'https://*.valitor.com',
      'https://*.mypurecloud.de',
      'https://*.nr-data.net',
      'https://*.newrelic.com',
      'https://*.euc1.pure.cloud',
      'http://static.zdassets.com',
      'https://*.zendesk.com',
      'https://applepay.cdn-apple.com',
      'https://matomo.island.is/matomo.js',
      'https://islandis.matomo.cloud/matomo.js',
    ],
    'style-src': [
      "'self'",
      "'unsafe-inline'",
      'https://*.boost.ai',
      'https://*.readspeaker.com',
      'https://cdnjs.cloudflare.com',
    ],
    'child-src': [
      "'self'",
      'https://*.mypurecloud.de',
      'https://*.euc1.pure.cloud',
    ],
    'manifest-src': ["'self'", 'https://*.devland.is'],
    'object-src': ['https://*.mypurecloud.de', 'https://*.euc1.pure.cloud'],
    'frame-ancestors': [
      'https://*.devland.is',
      'https://*.island.is',
      'https://island.is',
      'https://app.contentful.com',
      'https://compose.contentful.com',
    ],
    'frame-src': [
      'blob:',
      'https://*.assistant.watson.appdomain.cloud',
      'https://*.devland.is',
      'https://*.island.is',
      'https://*.dropandsign.is',
      'https://fill.taktikal.is',
      'https://island.is',
      'https://www.youtube.com',
      'https://www.youtube-nocookie.com',
      'https://*.vimeo.com',
      'https://secure.livechatinc.com',
      'https://*.statuspage.io',
      'https://app.powerbi.com',
      'https://secure-fra.livechatinc.com',
      'https://featureupvote.com',
      'https://islandis.featureupvote.com',
      'https://e.infogram.com',
      'https://*.valitor.com',
      'https://apps.mypurecloud.de',
      'https://applepay.cdn-apple.com',
      'https://portal.land.is',
      'https://www.facebook.com/plugins/video.php',
      'https://beta.dev01.devland.is/*',
      'https://beta.staging01.devland.is/*',
      'https://island.is/*',
      'https://solmyrkvi2026.is/',
      'https://eclipse2026.is/',
    ],
    'connect-src': [
      "'self'",
      'https://*.sveitarfelog.net',
      'https://*.assistant.watson.appdomain.cloud',
      'https://assets.ctfassets.net',
      'https://*.sentry.io',
      'https://*.island.is',
      'https://*.devland.is',
      'https://*.configcat.com',
      'https://plausible.io',
      'https://s3.eu-west-1.amazonaws.com',
      'https://*.boost.ai',
      'https://*.readspeaker.com',
      'https://browser-intake-datadoghq.eu',
      'https://rum-http-intake.logs.datadoghq.eu',
      'wss://*.zopim.com',
      'https://*.statuspage.io',
      'https://api.livechatinc.com',
      'https://status.sjukra.is',
      'https://api-fra.livechatinc.com',
      'https://id.zopim.com/authenticated/web/jwt',
      'https://rum.browser-intake-datadoghq.eu',
      'https://files.reglugerd.is',
      'https://*.s3.eu-west-1.amazonaws.com',
      'https://*.greynir.is',
      'https://*.mypurecloud.de',
      'https://*.nr-data.net',
      'https://shyrka-prod-euc1.s3.eu-central-1.amazonaws.com',
      'https://*.newrelic.com',
      'https://*.euc1.pure.cloud',
      'wss://*.mypurecloud.de',
      'wss://*.euc1.pure.cloud',
      'http://ekr.zdassets.com',
      'https://*.zendesk.com',
      'wss://*.zendesk.com',
      'https://paymentrelayservice.apple.com',
      'https://islandis.matomo.cloud/matomo.js',
      'https://islandis.matomo.cloud',
    ],
    'worker-src': ["'self'", 'blob:'],
    'font-src': [
      "'self'",
      'data:',
      'https://fonts.gstatic.com',
      'https://cdn.livechatinc.com',
      'https://web-chat.global.assistant.watson.appdomain.cloud',
      'https://applepay.cdn-apple.com',
    ],
  }

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${values.join(' ')}`)
    .join('; ')
}
