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
