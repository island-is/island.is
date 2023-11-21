// All tracked events related to the service portal
import BaseEvent from './BaseEvent'
import {
  plausibleCustomEvent,
  plausibleOutboundLinkGoal,
} from './plausibleEvent'

/**
 * Service-portal events must overwrite identifiable path with non identifiable path
 */
export type ParamType = {
  url: string
  location?: string
  fileName?: string
}

type OutboundTypes = {
  url: ParamType['url']
  outboundUrl?: string
}

// Event sent when the search feature of documents is interacted with by the user
export const documentsSearchDocumentsInitialized = (params: ParamType) => {
  const event: BaseEvent = {
    eventName: 'Search Documents Initialized',
    featureName: 'documents',
    params: {
      location: params.location,
    },
    url: params.url,
  }
  plausibleCustomEvent(event)
}

// Event sent when a document is opened in the documents section of the service portal
export const documentsOpenDocument = (params: ParamType) => {
  const event: BaseEvent = {
    eventName: 'Open Document',
    featureName: 'documents',
    params: {
      location: params.location,
      fileName: params.fileName,
    },
    url: params.url,
  }
  plausibleCustomEvent(event)
}

// Event sent when the on boarding modal is closed in the service portal
export const servicePortalCloseOnBoardingModal = (params: ParamType) => {
  const event: BaseEvent = {
    eventName: 'Close On Boarding Modal',
    featureName: 'service-portal',
    params: {
      location: params.location,
    },
    url: params.url,
  }
  plausibleCustomEvent(event)
}

// Event sent when user pushes save button when giving other user access in the service portal
export const servicePortalSaveAccessControl = (params: ParamType) => {
  const event: BaseEvent = {
    eventName: 'Pushing save button for Access Control',
    featureName: 'service-portal',
    params: {
      location: params.location,
    },
    url: params.url,
  }
  plausibleCustomEvent(event)
}

/*
 * Special function for outbound link as described in plausible see here https://plausible.io/blog/track-outbound-link-clicks
 * Event does not require any additional metadata
 */
export const servicePortalOutboundLink = (params: OutboundTypes) => {
  const plausible = window.plausible

  if (plausible) {
    plausible(plausibleOutboundLinkGoal, {
      props: {
        url: params.outboundUrl,
      },
      u: params.url,
    })
  }
}
