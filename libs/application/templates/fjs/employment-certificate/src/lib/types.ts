// Shapes of Fjársýsla ríkisins' employment-certificate API (v4.0.0), shared
// with the template-api module. Kept by hand: the template is also bundled for
// the browser and can't import the API client, whose types match these.

export enum DeliveryStatus {
  SENT_TO_MAILBOX = 'sent_to_mailbox',
  PROCESSING = 'processing',
  CLOSED = 'closed',
}

export interface EmploymentEligibility {
  hasEmploymentHistory: boolean
}

export interface EmploymentHistoryInstitution {
  id: string
  name: string
  from: string | null
  to: string | null
}

export interface EmploymentHistoryPreview {
  previewVersion: string
  institutions: EmploymentHistoryInstitution[]
}

/** What the submit action stores in `externalData` on success. */
export interface SubmitApplicationResult {
  caseId: string
  deliveryStatus: DeliveryStatus
  documentId?: string | null
}
