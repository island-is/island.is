import { defineTemplateApi, IdentityApi } from '@island.is/application/types'
import { ApiActions } from '../utils/constants'

export const IdentityApiProvider = IdentityApi.configure({
  params: { includeActorInfo: true },
})

// PREREQUISITES providers — independent of each other, order is inconsequential
export const CompanyRegistryApi = defineTemplateApi({
  action: ApiActions.getCompanyData,
  externalDataId: 'companyData',
  namespace: 'DirectorateOfEquality',
  order: 0,
})

export const ActiveEqualityReportApi = defineTemplateApi({
  action: ApiActions.getActiveEqualityReport,
  externalDataId: 'activeEqualityReport',
  namespace: 'DirectorateOfEquality',
  order: 1,
})

export const DoeCompanyApi = defineTemplateApi({
  action: ApiActions.getDoeCompany,
  externalDataId: 'doeCompany',
  namespace: 'DirectorateOfEquality',
  order: 2,
})

// DRAFT providers — only ever triggered on-demand via updateApplicationExternalData
// from Editor.tsx / PreviousEqualityPlan.tsx, never run automatically on state entry
export const PreviousEqualityReportContentApi = defineTemplateApi({
  action: ApiActions.getPreviousEqualityReportContent,
  externalDataId: 'previousEqualityReportContent',
  namespace: 'DirectorateOfEquality',
  order: 0,
})

export const EqualityReportTemplateDocxApi = defineTemplateApi({
  action: ApiActions.getEqualityReportTemplateDocx,
  externalDataId: 'equalityReportTemplateDocx',
  namespace: 'DirectorateOfEquality',
  order: 0,
})

// On-demand only — triggered manually from the CommentThread field, never
// wired to a state's onEntry. Listed on a role's `api` array purely so
// updateApplicationExternalData is permitted to invoke it for that role.
export const GetReportCommentsApi = defineTemplateApi({
  action: ApiActions.getReportComments,
  externalDataId: 'getReportComments',
  namespace: 'DirectorateOfEquality',
  order: 0,
  throwOnError: false,
})

export const SubmitReportCommentApi = defineTemplateApi({
  action: ApiActions.submitReportComment,
  externalDataId: 'submitReportComment',
  namespace: 'DirectorateOfEquality',
  order: 0,
  throwOnError: false,
})

// Idempotent on providerId — reopening this step returns the same draft.
export const CreateEqualityDraftApi = defineTemplateApi({
  action: ApiActions.createEqualityDraft,
  externalDataId: 'equalityDraft',
  namespace: 'DirectorateOfEquality',
  shouldPersistToExternalData: false,
  throwOnError: true,
})

export const SubmitEqualityDraftApi = defineTemplateApi({
  action: ApiActions.submitEqualityDraft,
  externalDataId: 'submitEqualityDraft',
  namespace: 'DirectorateOfEquality',
  shouldPersistToExternalData: true,
  throwOnError: true,
})
