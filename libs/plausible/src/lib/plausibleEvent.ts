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
    const eventName = event.featureName
      ? `${event.featureName} ${event.eventName}`
      : event.eventName
    plausible(eventName, {
      props: event.params,
      ...(event.callback && { callback: event.callback }),
    })
  }
}

// Special case for outbound links see: https://docs.plausible.io/outbound-link-click-tracking/
export const plausibleOutboundLinkEvent = () => {
  const plausible = window.plausible
  if (plausible) {
    plausible('Outbound Link: Click')
  }
}
