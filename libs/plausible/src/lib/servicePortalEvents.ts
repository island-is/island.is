// All tracked events related to the service portal
import BaseEvent from './BaseEvent'
import {
  plausibleCustomEvent,
  plausibleOutboundLinkEvent,
} from './plausibleEvent'

// Event sent when the search feature of documents is interacted with by the user
export const documentsSearchDocumentsInitialized = (location: string) => {
  const event: BaseEvent = {
    eventName: 'Search Documents Initialized',
    featureName: 'documents',
    params: {
      location,
    },
  }
  plausibleCustomEvent(event)
}

// Event sent when a document is opened in the documents section of the service portal
export const documentsOpenDocument = (location: string, fileName: string) => {
  const event: BaseEvent = {
    eventName: 'Open Document',
    featureName: 'documents',
    params: {
      location,
      fileName,
    },
  }
  plausibleCustomEvent(event)
}

// Event sent when the on boarding modal is closed in the service portal
export const servicePortalCloseOnBoardingModal = (location: string) => {
  const event: BaseEvent = {
    eventName: 'Close On Boarding Modal',
    featureName: 'service-portal',
    params: {
      location,
    },
  }
  plausibleCustomEvent(event)
}

// Event sent when the on boarding modal is submitted in the service portal
export const servicePortalSubmitOnBoardingModal = (location: string) => {
  const event: BaseEvent = {
    eventName: 'Submit On Boarding Modal',
    featureName: 'service-portal',
    params: {
      location,
    },
  }
  plausibleCustomEvent(event)
}

// Event sent when user pushes save button when giving other user access in the service portal
export const servicePortalSaveAccessControl = (location: string) => {
  const event: BaseEvent = {
    eventName: 'Pushing save button for Access Control',
    featureName: 'service-portal',
    params: {
      location,
    },
  }
  plausibleCustomEvent(event)
}

/*
 * Special function for outbound link as described in plausible see here https://plausible.io/blog/track-outbound-link-clicks
 * Event does not require any additional metadata
 */
export const servicePortalOutboundLink = () => {
  plausibleOutboundLinkEvent()
}
