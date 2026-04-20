const DEFAULT_DOMAIN = 'island.is/minarsidur'
const HEALTH_DOMAIN = 'island.is/minarsidur/heilsa'

// This function swaps the domain of the plausible script to the health domain
// Used for roll up view in plausible: https://plausible.io/docs/plausible-script#is-there-a-roll-up-view

const swapDomain = (domain: string, script: HTMLScriptElement) => {
  const src = script.getAttribute('src') as string
  script.remove()
  const newScript = document.createElement('script')
  newScript.async = true
  newScript.defer = true
  newScript.src = src
  newScript.setAttribute('data-domain', domain)

  document.head.appendChild(newScript)
}

export const plausibleSwapDataDomain = (type: 'health' | 'default') => {
  if (document) {
    const plausibleScript = document.querySelector(
      'script[data-domain]',
    ) as HTMLScriptElement
    if (!plausibleScript) {
      console.warn('Plausible script not found in document')
      return
    }
    const isDefaultDomain = plausibleScript?.dataset?.domain === DEFAULT_DOMAIN
    const isHealthDomain =
      plausibleScript?.dataset?.domain === `${DEFAULT_DOMAIN},${HEALTH_DOMAIN}`

    if (type === 'health' && !isHealthDomain) {
      swapDomain(`${DEFAULT_DOMAIN},${HEALTH_DOMAIN}`, plausibleScript)
    }
    if (type === 'default' && !isDefaultDomain) {
      swapDomain(DEFAULT_DOMAIN, plausibleScript)
    }
  }
}
