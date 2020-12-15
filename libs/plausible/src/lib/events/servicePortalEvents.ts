// All tracked events related to the service portal
import baseEvent from './baseEvent.d.ts'
// Event sent when the search feature of documents are being searched in the service portal
export interface DocumentsSearchDocumentsInitialized extends baseEvent {
  eventName: 'Search Documents Initialized'
  featureName: 'documents'
  params: {
    location: string
  }
}

// Event sent when a document is opened in the service portal
export interface DocumentsOpenDocument extends baseEvent {
  eventName: 'Open Document'
  featureName: 'documents'
  params: {
    location: string
    name: string
    searchQuery?: string
  }
}

// Event sent when the on boarding modal is closed in the service portal
export interface ServicePortalCloseOnBoardingModal extends baseEvent {
  eventName: 'Close On Boarding Modal'
  featureName: 'service-portal'
  params: {
    location: string
  }
}

// Event sent when the on boarding modal is submitted in the service portal
export interface ServicePortalSubmitOnBoardingModal extends baseEvent {
  eventName: 'Submit On Boarding Modal'
  featureName: 'service-portal'
  params: {
    location: string
  }
}

// Event sent when a user clicks an outbound link in the service portal
export interface ServicePortalOutboundLink extends baseEvent {
  eventName: 'Outbound Link'
  featureName: 'service-portal'
  params: {
    location: string
    destination: string
  }
}
