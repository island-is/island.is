import baseEvent from './baseEvent'

// Fix for TypeScript error: Property 'X' does not exist on type 'Window'
declare global {
  interface Window {
    plausible: any
  }
}

export const plausibleCustomEvent = (event: baseEvent) => {
  const plausible = window.plausible
  if (plausible) {
    const eventName = `${event.featureName} ${event.eventName}`
    plausible(eventName, { props: event.params })
  }
}
