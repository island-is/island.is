// All tracked events related to the service portal
import baseEvent from './baseEvent'
import { plausibleCustomEvent } from './plausibleEvent'

// Event sent when the search feature of documents are being searched in the service portal
export const DocumentsSearchDocumentsInitialized = (location: string) => {
  const event: baseEvent = {
    eventName: 'Search Documents Initialized',
    featureName: 'documents',
    params: {
      location,
    },
  }
  plausibleCustomEvent(event)
}

// Event sent when a document is opened in the service portal
export const DocumentsOpenDocument = (location: string, fileName: string) => {
  const event: baseEvent = {
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
export const ServicePortalCloseOnBoardingModal = (location: string) => {
  const event: baseEvent = {
    eventName: 'Close On Boarding Modal',
    featureName: 'service-portal',
    params: {
      location,
    },
  }
  plausibleCustomEvent(event)
}

// Event sent when the on boarding modal is submitted in the service portal
export const ServicePortalSubmitOnBoardingModal = (location: string) => {
  const event: baseEvent = {
    eventName: 'Submit On Boarding Modal',
    featureName: 'service-portal',
    params: {
      location,
    },
  }
  plausibleCustomEvent(event)
}

// Event sent when a user clicks an outbound link in the service portal
export const ServicePortalOutboundLink = (
  location: string,
  destination: string,
) => {
  const event: baseEvent = {
    eventName: 'Outbound Link',
    featureName: 'service-portal',
    params: {
      location,
      destination,
    },
  }
  plausibleCustomEvent(event)
}
