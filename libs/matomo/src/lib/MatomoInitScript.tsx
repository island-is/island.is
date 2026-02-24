import { useEffect } from 'react'
import { initMatomo } from './init-matomo'
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
}: MatomoInitScriptProps) => {
  const normalizedDomain = matomoDomain.endsWith('/')
    ? matomoDomain
    : `${matomoDomain}/`

  useEffect(() => {
    if (!matomoDomain || !matomoSiteId) {
      console.warn(
        '[MatomoInitScript] Missing matomoDomain or matomoSiteId, skipping Matomo initialization',
      )
      return
    }
    initMatomo({ matomoDomain: normalizedDomain, matomoSiteId })
    // This is empty on purpose - this should only happen once
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  if (!matomoDomain || !matomoSiteId) {
    console.warn(
      '[MatomoInitScript] Missing matomoDomain or matomoSiteId, skipping Matomo initialization',
    )
    return null
  }
  return <script async defer src={`${normalizedDomain}matomo.js`} />
}
