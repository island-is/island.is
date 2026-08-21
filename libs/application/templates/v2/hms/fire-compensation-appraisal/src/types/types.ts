export type FileType = {
  url?: string | undefined
  name: string
  key: string
}

// Action names that route to the existing `FireCompensationAppraisalService`
// via the `FireCompensationAppraisal` namespace (see dataProviders).
export enum TemplateApiActions {
  getProperties = 'getProperties',
  searchProperties = 'searchProperties',
  fetchPropertiesByCode = 'fetchPropertiesByCode',
  calculateAmount = 'calculateAmount',
  // SDF-specific submit variant on the shared service (display values are not
  // persisted to answers in SDF, so the DTO recomputes them).
  submitApplication = 'submitApplicationSdf',
  sendNotificationToAllInvolved = 'sendNotificationToAllInvolved',
}
