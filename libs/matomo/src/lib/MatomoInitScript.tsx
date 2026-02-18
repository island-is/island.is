interface MatomoInitScriptProps {
  matomoDomain: string
  matomoSiteId: string
}

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
}: MatomoInitScriptProps) => {
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
      id="matomo-init"
      src="/scripts/matomo-init.js"
      data-matomo-domain={normalizedDomain}
      data-matomo-site-id={matomoSiteId}
      defer
    />
  )
}
