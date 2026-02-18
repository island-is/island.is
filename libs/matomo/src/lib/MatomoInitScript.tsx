interface MatomoInitScriptProps {
  matomoDomain: string
  matomoSiteId: string
}

/**
 * Server-rendered Matomo initialization and script loader.
 * Use in _document.tsx <Head> to ensure configuration is set
 * before matomo.js loads.
 *
 * Renders an inline script that configures _paq, followed by
 * the async matomo.js script tag — matching the standard Matomo
 * installation pattern.
 */
export const MatomoInitScript = ({
  matomoDomain,
  matomoSiteId,
}: MatomoInitScriptProps) => {
  if (!matomoDomain || !matomoSiteId) {
    return null
  }

  const normalizedDomain = matomoDomain.endsWith('/')
    ? matomoDomain
    : `${matomoDomain}/`

  const initCode = `
    var _paq = window._paq = window._paq || [];
    _paq.push(['setTrackerUrl', '${normalizedDomain}matomo.php']);
    _paq.push(['setSiteId', '${matomoSiteId}']);
    _paq.push(['enableLinkTracking']);
    _paq.push(['trackPageView']);
  `

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: initCode }} />
      <script async src={`${normalizedDomain}matomo.js`}></script>
    </>
  )
}
