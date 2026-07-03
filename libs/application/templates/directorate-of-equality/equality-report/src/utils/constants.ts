import { DefaultEvents } from '@island.is/application/types'

export type Events = {
  type: DefaultEvents.SUBMIT
}

export enum States {
  PREREQUISITES = 'prerequisites',
  DRAFT = 'draft',
  COMPLETED = 'completed',
}

export enum Roles {
  APPLICANT = 'applicant',
  NOT_ALLOWED = 'notAllowed',
}

// InputField.defaultValue is typed as (application, activeField?, index?) with
// no locale param, so this display fallback can't be run through formatMessage
// from buildTextField. (Runtime actually passes locale as the 3rd arg per
// getDefaultValue.ts, but that's mistyped as `index` in Fields.ts — relying on
// it would fight the type system, so we don't.)
export const UNKNOWN_DISPLAY_VALUE = 'Óþekkt'

export enum ApiActions {
  getCompanyData = 'getCompanyData',
  getDoeCompany = 'getDoeCompany',
  getActiveEqualityReport = 'getActiveEqualityReport',
  getEqualityReportTemplateHtml = 'getEqualityReportTemplateHtml',
  getEqualityReportTemplateDocx = 'getEqualityReportTemplateDocx',
  getPreviousEqualityReportContent = 'getPreviousEqualityReportContent',
  submitEqualityReport = 'submitEqualityReport',
}
