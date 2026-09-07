import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type:
    | DefaultEvents.SUBMIT
    | DefaultEvents.APPROVE
    | DefaultEvents.EDIT
    | DefaultEvents.REJECT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  IN_REVIEW = 'inReview',
  APPROVED = 'approved',
  DENIED = 'denied',
  DRAFT_RETRY = 'draftRetry',
}

export enum Roles {
  APPLICANT = 'applicant',
  NOT_ALLOWED = 'notAllowed',
  ASSIGNEE = 'assignee',
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
}

// InputField.defaultValue is typed as (application, activeField?, index?) with
// no locale param, so this display fallback can't be run through formatMessage
// from buildTextField. (Runtime actually passes locale as the 3rd arg per
// getDefaultValue.ts, but that's mistyped as `index` in Fields.ts — relying on
// it would fight the type system, so we don't.)
export const UNKNOWN_DISPLAY_VALUE = 'Óþekkt'

const DOE_NAMESPACE = 'DirectorateOfEquality'

// Builds the `actionId` string the updateApplicationExternalData mutation expects,
// from the same ApiActions enum the data providers and the service dispatch on —
// a renamed action is then caught by the type checker at every call site.
export const draftActionId = (action: ApiActions) =>
  `${DOE_NAMESPACE}.${action}`

export enum ApiActions {
  getCompanyData = 'getCompanyData',
  getDoeCompany = 'getDoeCompany',
  getActiveEqualityReport = 'getActiveEqualityReport',
  getEqualityReportTemplateDocx = 'getEqualityReportTemplateDocx',
  getPreviousEqualityReportContent = 'getPreviousEqualityReportContent',
  createEqualityDraft = 'createEqualityDraft',
  submitEqualityDraft = 'submitEqualityDraft',
  getReportComments = 'getReportComments',
  submitReportComment = 'submitReportComment',
}
