import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../utils/constants'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

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

export const ParsedSalaryReportApi = defineTemplateApi({
  action: ApiActions.parseSalaryReportWorkbook,
  externalDataId: 'parsedSalaryReport',
  namespace: 'DirectorateOfEquality',
  throwOnError: false,
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

export const EditOutliersApi = defineTemplateApi({
  action: ApiActions.editOutliers,
  externalDataId: 'editOutliers',
  namespace: 'DirectorateOfEquality',
  shouldPersistToExternalData: true,
  throwOnError: true,
})

// Triggered manually from the CommentThread field for on-demand refresh, and
// also wired as onEntry on DRAFT/POSTPONED/APPROVED/DENIED so externalData is
// fresh on first render (e.g. for the postponedForm landing-screen decision).
// Listed on a role's `api` array purely so updateApplicationExternalData is
// permitted to invoke it for that role.
export const GetReportCommentsApi = defineTemplateApi({
  action: 'getReportComments',
  externalDataId: 'getReportComments',
  namespace: 'DirectorateOfEquality',
  throwOnError: false,
})

export const SubmitReportCommentApi = defineTemplateApi({
  action: 'submitReportComment',
  externalDataId: 'submitReportComment',
  namespace: 'DirectorateOfEquality',
  throwOnError: false,
})
