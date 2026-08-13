import { logger } from '@island.is/logging'

/**
 * Shared nonce-based Content-Security-Policy for island.is Next apps.
 *
 * These apps used to get their CSP from the ingress (CloudFront), which
 * allow-listed Next's inline bootstrap scripts by two pinned `sha256-…` hashes.
 * Next 16 changed those inline scripts, so the hashes stopped matching and every
 * page's inline script was blocked — breaking SSR Suspense (React #419) and
 * forcing client-side rendering.
 *
 * Instead each app mints a per-request nonce and owns its CSP. Pass this builder
 * to the bootstrap `csp` option (`csp: buildContentSecurityPolicy`); the custom
 * server sets the result on the request's `content-security-policy` header before
 * Next renders, so Next reads it (getScriptNonceFromHeader) and stamps its inline
 * scripts. Done in the custom server rather than Next middleware because
 * middleware request-header overrides do not reach the pages renderer through it.
 *
 * NB: Next 16's pages router does NOT forward that nonce into React 19's
 * streaming renderer, so React's inline Suspense streaming scripts ($RC/$RB…)
 * come out un-nonced, get CSP-blocked, and break SSR on their own. A `yarn patch`
 * on `next` closes that gap by passing the nonce to `renderToInitialFizzStream`
 * (see .yarn/patches/next-npm-*.patch). Both this wiring AND that patch are
 * required for a working nonce CSP on the pages router.
 *
 * The allow-list is the single source of truth, owned by the app. Fixed SaaS
 * hosts are hard-coded; environment-specific hosts (Matomo is self-hosted per
 * env) are sourced from the app's own runtime env (`MATOMO_DOMAIN`, set per env
 * in the app's infra) so the policy is always env-correct and cannot drift from
 * the hosts the app actually loads. Completeness is checked two ways: diffing
 * against the live CloudFront header, and the A/B smoke test (a missing host
 * shows up as a CSP violation vs the base deploy).
 */
export interface ContentSecurityPolicyOptions {
  /**
   * Self-hosted Matomo host for this environment. Defaults to
   * `process.env.MATOMO_DOMAIN` (the same value the app uses to load Matomo).
   */
  matomoDomain?: string

  /**
   * One or more endpoints that receive CSP violation reports. When configured,
   * these are emitted as the policy's `report-uri` directive.
   */
  reportUri?: string | readonly string[]
}

export interface DatadogCspReportUriOptions {
  /**
   * Datadog client token. This must not be an API or application key. Defaults
   * to `process.env.DD_CSP_REPORT_CLIENT_TOKEN`.
   */
  clientToken?: string

  /** Canonical Datadog service name for CSP reports. */
  service: string

  /** Defaults to Datadog's injected `DD_ENV`, then `ENVIRONMENT`. */
  env?: string

  /** Defaults to `DD_VERSION`, then `APP_VERSION`, then `GIT_COMMIT_SHA`. */
  version?: string
}

const DATADOG_EU_CSP_REPORT_INTAKE =
  'https://browser-intake-datadoghq.eu/api/v2/logs'

let didWarnAboutMissingDatadogClientToken = false

const firstNonBlank = (...values: Array<string | undefined>) =>
  values.find((value) => value?.trim())?.trim()

/**
 * Builds the EU Datadog intake URL for CSP violation reports. Returns undefined
 * when no client token is configured, allowing reporting to be disabled in
 * environments such as local development without emitting an invalid policy.
 */
export const buildDatadogCspReportUri = ({
  clientToken = process.env.DD_CSP_REPORT_CLIENT_TOKEN,
  service,
  env,
  version,
}: DatadogCspReportUriOptions): string | undefined => {
  if (!clientToken?.trim()) {
    if (!didWarnAboutMissingDatadogClientToken) {
      logger.warn(
        'CSP reporting is disabled because DD_CSP_REPORT_CLIENT_TOKEN is not configured.',
        { context: 'ContentSecurityPolicy' },
      )
      didWarnAboutMissingDatadogClientToken = true
    }

    return undefined
  }

  const resolvedEnv =
    env === undefined
      ? firstNonBlank(process.env.DD_ENV, process.env.ENVIRONMENT)
      : env.trim()
  const resolvedVersion =
    version === undefined
      ? firstNonBlank(
          process.env.DD_VERSION,
          process.env.APP_VERSION,
          process.env.GIT_COMMIT_SHA,
        )
      : version.trim()

  const tags = [
    ['service', service],
    ['env', resolvedEnv],
    ['version', resolvedVersion],
  ]
    .filter((tag): tag is [string, string] => Boolean(tag[1]?.trim()))
    .map(([key, value]) => `${key}:${value.trim()}`)
    .join(',')

  const reportUri = new URL(DATADOG_EU_CSP_REPORT_INTAKE)
  reportUri.searchParams.set('dd-api-key', clientToken.trim())
  reportUri.searchParams.set('dd-evp-origin', 'content-security-policy')
  reportUri.searchParams.set('ddsource', 'csp-report')

  if (tags) {
    reportUri.searchParams.set('ddtags', tags)
  }

  return reportUri.toString()
}

export const buildContentSecurityPolicy = (
  nonce: string,
  {
    matomoDomain = process.env.MATOMO_DOMAIN,
    reportUri,
  }: ContentSecurityPolicyOptions = {},
): string => {
  const matomo = matomoDomain
  const reportUris = (
    typeof reportUri === 'string' ? [reportUri] : reportUri ?? []
  )
    .map((uri) => uri.trim())
    .filter(Boolean)
  // Local dev needs a couple of extra origins (the Next HMR websocket). Gate this
  // to dev only so the deployed policy stays strict and we still catch real
  // violations locally before they reach a deployment.
  const isDev = process.env.NODE_ENV !== 'production'
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
    // The two stale `sha256-…` hashes from the old CloudFront policy are replaced
    // by the per-request nonce; the Matomo host is env-sourced (see above).
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
      ...(matomo ? [`${matomo}/matomo.js`] : []),
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
      ...(matomo ? [matomo] : []),
      // Next dev server HMR websocket (dev only).
      ...(isDev
        ? ['ws://localhost:*', 'ws://127.0.0.1:*', 'http://localhost:*']
        : []),
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
    ...(reportUris.length > 0 ? { 'report-uri': reportUris } : {}),
  }

  return Object.entries(directives)
    .map(([key, values]) => `${key} ${[...new Set(values)].join(' ')}`)
    .join('; ')
}
