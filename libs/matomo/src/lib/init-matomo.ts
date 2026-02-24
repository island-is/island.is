import { MatomoInitScriptProps } from './types'

export const initMatomo = ({
  matomoDomain,
  matomoSiteId,
}: MatomoInitScriptProps) => {
  window._paq = window._paq || []
  window._paq.push(['trackPageView'])
  window._paq.push(['enableLinkTracking'])
  window._paq.push(['setTrackerUrl', `${matomoDomain}matomo.php`])
  window._paq.push(['setSiteId', matomoSiteId])
}
