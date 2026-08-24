import {
  defineTemplateApi,
  DefaultEvents,
  IdentityApi,
} from '@island.is/application/types'
import { ApiActions } from '../utils/constants'

export { UserProfileApi } from '@island.is/application/types'

export const IdentityApiProvider = IdentityApi.configure({
  params: { includeActorInfo: true },
})

// PREREQUISITES providers — independent of each other, order is inconsequential
export const CompanyRegistryApi = defineTemplateApi({
  action: ApiActions.getCompanyData,
  externalDataId: 'companyData',
  namespace: 'DirectorateOfEquality',
})

export const DoeCompanyApi = defineTemplateApi({
  action: ApiActions.getDoeCompany,
  externalDataId: 'doeCompany',
  namespace: 'DirectorateOfEquality',
})

export const SubCriterionCatalogApi = defineTemplateApi({
  action: ApiActions.getSubCriterionCatalog,
  externalDataId: 'subCriterionCatalog',
  namespace: 'DirectorateOfEquality',
  throwOnError: false,
})

export const ActiveEqualityReportApi = defineTemplateApi({
  action: ApiActions.getActiveEqualityReport,
  externalDataId: 'activeEqualityReport',
  namespace: 'DirectorateOfEquality',
})

export const BlankExcelTemplateApi = defineTemplateApi({
  action: ApiActions.getBlankExcelTemplate,
  externalDataId: 'blankExcelTemplate',
  namespace: 'DirectorateOfEquality',
})

// On-demand providers below — outside PREREQUISITES, role.api only grants
// permission for updateApplicationExternalData; it doesn't batch-execute the
// list. Each is invoked independently from its own screen action (import,
// parse, analyze, comment), so relative order in a role's api array doesn't
// matter.

export const ImportPresignApi = defineTemplateApi({
  action: ApiActions.presignImportUpload,
  externalDataId: 'importPresign',
  namespace: 'DirectorateOfEquality',
  throwOnError: false,
})

// Opens the DRAFT report; idempotent, invoked once on first entry to `dataEntry`.
// Its response isn't read anywhere — callers only care that the draft now exists.
export const CreateSalaryDraftApi = defineTemplateApi({
  action: ApiActions.createSalaryDraft,
  externalDataId: 'salaryDraft',
  namespace: 'DirectorateOfEquality',
  shouldPersistToExternalData: false,
  throwOnError: true,
})

// Bulk-seeds (REPLACE) the draft; UI re-fetches the draft reads afterward instead of using this response.
export const ImportSalaryDraftWorkbookApi = defineTemplateApi({
  action: ApiActions.importSalaryDraftWorkbook,
  externalDataId: 'importSalaryDraftWorkbook',
  namespace: 'DirectorateOfEquality',
  shouldPersistToExternalData: false,
  throwOnError: false,
})

// Screen-shaped draft reads, one per screen from `dataEntry` onward — populate
// the UI and restore an unfinished application on reopen; never persisted to applicationAnswers.
export const GetDraftHeaderApi = defineTemplateApi({
  action: ApiActions.getDraftHeader,
  externalDataId: 'draftHeader',
  namespace: 'DirectorateOfEquality',
  throwOnError: true,
})

export const GetDraftCriteriaTreeApi = defineTemplateApi({
  action: ApiActions.getDraftCriteriaTree,
  externalDataId: 'draftCriteriaTree',
  namespace: 'DirectorateOfEquality',
  throwOnError: true,
})

export const ListDraftRolesWithStepsApi = defineTemplateApi({
  action: ApiActions.listDraftRolesWithSteps,
  externalDataId: 'draftRolesWithSteps',
  namespace: 'DirectorateOfEquality',
  throwOnError: true,
})

export const ListDraftCriteriaApi = defineTemplateApi({
  action: ApiActions.listDraftCriteria,
  externalDataId: 'draftCriteria',
  namespace: 'DirectorateOfEquality',
  throwOnError: true,
})

export const ListDraftRolesApi = defineTemplateApi({
  action: ApiActions.listDraftRoles,
  externalDataId: 'draftRoles',
  namespace: 'DirectorateOfEquality',
  throwOnError: true,
})

export const ListDraftEmployeesApi = defineTemplateApi({
  action: ApiActions.listDraftEmployees,
  externalDataId: 'draftEmployees',
  namespace: 'DirectorateOfEquality',
  throwOnError: true,
})

export const ListDraftOutlierGroupsApi = defineTemplateApi({
  action: ApiActions.listDraftOutlierGroups,
  externalDataId: 'draftOutlierGroups',
  namespace: 'DirectorateOfEquality',
  throwOnError: true,
})

export const SubmitSalaryReportApi = defineTemplateApi({
  action: ApiActions.submitSalaryReport,
  externalDataId: 'submitSalaryReport',
  namespace: 'DirectorateOfEquality',
  shouldPersistToExternalData: true,
  throwOnError: true,
})

export const SalaryAnalysisApi = defineTemplateApi({
  action: ApiActions.analyzeSalaryReport,
  externalDataId: 'salaryAnalysisResult',
  namespace: 'DirectorateOfEquality',
  throwOnError: false,
})

// triggerEvent: SUBMIT only — POSTPONED and DRAFT_RETRY both exit via SUBMIT
// (their intended resubmit), but POSTPONED also exits via an admin-dispatched
// EDIT that must not PUT unedited outlier data before the applicant revises it.
export const EditOutliersApi = defineTemplateApi({
  action: ApiActions.editOutliers,
  externalDataId: 'editOutliers',
  namespace: 'DirectorateOfEquality',
  shouldPersistToExternalData: true,
  throwOnError: true,
  triggerEvent: DefaultEvents.SUBMIT,
})

// Triggered manually from the CommentThread field for on-demand refresh, and
// also wired as onEntry on DRAFT/POSTPONED/DRAFT_RETRY/APPROVED/DENIED so
// externalData is fresh on first render (e.g. for the postponedForm
// landing-screen decision).
// Listed on a role's `api` array purely so updateApplicationExternalData is
// permitted to invoke it for that role.
export const GetReportCommentsApi = defineTemplateApi({
  action: ApiActions.getReportComments,
  externalDataId: 'getReportComments',
  namespace: 'DirectorateOfEquality',
  throwOnError: false,
})

export const SubmitReportCommentApi = defineTemplateApi({
  action: ApiActions.submitReportComment,
  externalDataId: 'submitReportComment',
  namespace: 'DirectorateOfEquality',
  throwOnError: false,
})
