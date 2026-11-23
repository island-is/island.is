/**
 * - `sent_to_mailbox`: the certificate is in the person's Digital Mailbox.
 * - `processing`: accepted; the certificate is on its way.
 * - `closed`: closed without a certificate. Only returned when a key is
 *   replayed for a case staff have closed.
 */
export type EmploymentCertificateDeliveryStatus =
  | 'sent_to_mailbox'
  | 'processing'
  | 'closed'

export interface EmploymentEligibility {
  /** True exactly when the preview would list at least one institution. */
  hasEmploymentHistory: boolean
}

export interface EmploymentHistoryInstitution {
  id: string
  name: string
  /** Earliest start date, `YYYY-MM-DD`. */
  from: string | null
  /** Latest end date, `YYYY-MM-DD`. */
  to: string | null
}

export interface EmploymentHistoryPreview {
  /** Identifies this exact history; sent back with the request. */
  previewVersion: string
  /** In certificate order. */
  institutions: EmploymentHistoryInstitution[]
}

export interface SubmitRequestInput {
  /** One key per application, reused on every retry. */
  idempotencyKey: string
  previewVersion: string
  /** At least one ID from the preview. */
  institutionIds: string[]
  includeUnion: boolean
  /** At most 4,000 characters after trimming. Not sent when blank. */
  comment?: string | null
}

export interface EmploymentCertificateRequestResult {
  caseId: string
  deliveryStatus: EmploymentCertificateDeliveryStatus
  /** The Digital Mailbox document, only with `sent_to_mailbox`. */
  documentId: string | null
}
