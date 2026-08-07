import { defineTemplateApi } from '@island.is/application/types'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const CompanyRegistryApi = defineTemplateApi({
  action: 'getCompanyData',
  externalDataId: 'companyData',
  namespace: 'DirectorateOfEquality',
})

export const DoeCompanyApi = defineTemplateApi({
  action: 'getDoeCompany',
  externalDataId: 'doeCompany',
  namespace: 'DirectorateOfEquality',
})

export const ActiveEqualityReportApi = defineTemplateApi({
  action: 'getActiveEqualityReport',
  externalDataId: 'activeEqualityReport',
  namespace: 'DirectorateOfEquality',
})

export const BlankExcelTemplateApi = defineTemplateApi({
  action: 'getBlankExcelTemplate',
  externalDataId: 'blankExcelTemplate',
  namespace: 'DirectorateOfEquality',
})

export const ImportPresignApi = defineTemplateApi({
  action: 'presignImportUpload',
  externalDataId: 'importPresign',
  namespace: 'DirectorateOfEquality',
  throwOnError: false,
})

export const ParsedSalaryReportApi = defineTemplateApi({
  action: 'parseSalaryReportWorkbook',
  externalDataId: 'parsedSalaryReport',
  namespace: 'DirectorateOfEquality',
  throwOnError: false,
})

export const SubmitSalaryReportApi = defineTemplateApi({
  action: 'submitSalaryReport',
  externalDataId: 'submitSalaryReport',
  namespace: 'DirectorateOfEquality',
  shouldPersistToExternalData: true,
  throwOnError: true,
})

export const SalaryAnalysisApi = defineTemplateApi({
  action: 'analyzeSalaryReport',
  externalDataId: 'salaryAnalysisResult',
  namespace: 'DirectorateOfEquality',
  throwOnError: false,
})

export const EditOutliersApi = defineTemplateApi({
  action: 'editOutliers',
  externalDataId: 'editOutliers',
  namespace: 'DirectorateOfEquality',
  shouldPersistToExternalData: true,
  throwOnError: true,
})

// On-demand only — triggered manually from the CommentThread field, never
// wired to a state's onEntry/onExit. Listed on a role's `api` array purely so
// updateApplicationExternalData is permitted to invoke it for that role.
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
