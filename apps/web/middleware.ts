import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

/**
 * Nonce-based Content-Security-Policy.
 *
 * The CSP was previously served by the infra/ingress layer (CloudFront) and
 * allow-listed Next's inline bootstrap scripts by two pinned `sha256-…` hashes.
 * Next 16 changed those inline scripts, so the hashes no longer matched and every
 * page's inline script was blocked — which broke SSR Suspense (React error #419)
 * and forced client-side rendering.
 *
 * Instead we mint a per-request nonce here and put it in `script-src` (replacing
 * the two stale hashes). Next reads the nonce back out of the request's
 * `content-security-policy` header (see next/dist/server/render.js
 * `getScriptNonceFromHeader`) and stamps it onto all its inline scripts and
 * `next/script` tags — in the pages router too — so it survives future Next
 * upgrades without hash chasing.
 *
 * Every directive below is copied verbatim from the current CloudFront policy;
 * only `script-src` differs (the two `sha256-…` hashes are replaced by the
 * per-request `'nonce-…'`). For this to be the effective policy, the CloudFront
 * CSP for web must be removed — the browser enforces every CSP header
 * independently, so a leftover hash-based header would re-block the nonce'd
 * scripts.
 *
 * Rollout: ships in report-only mode so the policy can be validated (watch for
 * `[Report Only]` violations in the console) while the enforced CloudFront CSP
 * is still in place. Once DevOps removes the CloudFront CSP for web, flip
 * `CSP_REPORT_ONLY` to false to enforce.
 */
const CSP_REPORT_ONLY = false
const CSP_HEADER = CSP_REPORT_ONLY
  ? 'content-security-policy-report-only'
  : 'content-security-policy'
const buildCsp = (nonce: string): string => {
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
    'child-src': ["'self'", 'https://*.mypurecloud.de', 'https://*.euc1.pure.cloud'],
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

export function middleware(request: NextRequest) {
  const nonce = btoa(crypto.randomUUID())
  const csp = buildCsp(nonce)

  // The renderer reads the nonce out of the request's CSP header (enforced or
  // report-only), so set the same header name we send on the response.
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set(CSP_HEADER, csp)
  requestHeaders.set('x-nonce', nonce)

  const response = NextResponse.next({ request: { headers: requestHeaders } })
  response.headers.set(CSP_HEADER, csp)
  return response
}

export const config = {
  // Only document requests need the CSP; skip static assets and images, and
  // skip prefetch requests (they don't render inline scripts).
  matcher: [
    {
      source:
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|map)$).*)',
      missing: [
        { type: 'header', key: 'next-router-prefetch' },
        { type: 'header', key: 'purpose', value: 'prefetch' },
      ],
    },
  ],
}
