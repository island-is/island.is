import { MatomoInitScriptProps } from './types'

/**
 * Server-rendered Matomo initialization script tag.
 * Loads /scripts/matomo-init.js which reads config from data attributes,
 * initializes _paq, tracks the initial page view, and loads matomo.js.
 *
 * Use in _document.tsx <Head>.
 */
export const MatomoInitScript = ({
  matomoDomain,
  matomoSiteId,
  enabled,
}: MatomoInitScriptProps) => {
  if (!enabled) {
    return null
  }
  if (!matomoDomain || !matomoSiteId) {
    console.warn(
      '[MatomoInitScript] Missing matomoDomain or matomoSiteId, skipping Matomo initialization',
    )
    return null
  }
  const normalizedDomain = matomoDomain.endsWith('/')
    ? matomoDomain
    : `${matomoDomain}/`

  return (
    <script
      async
      defer
      src={`${normalizedDomain}matomo.js`}
      data-id="matomoscript"
      data-domain={normalizedDomain}
      data-siteid={matomoSiteId}
    />
  )
}
