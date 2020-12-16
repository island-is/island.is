import BaseEvent from './BaseEvent'

// Fix for TypeScript error: Property 'X' does not exist on type 'Window'
declare global {
  interface Window {
    plausible: any
  }
}

export const plausibleCustomEvent = (event: BaseEvent) => {
  const plausible = window.plausible
  if (plausible) {
    const eventName = `${event.featureName} ${event.eventName}`
    plausible(eventName, { props: event.params })
  }
}
