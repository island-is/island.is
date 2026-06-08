import { defineTemplateApi } from '@island.is/application/types'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const CompanyRegistryApi = defineTemplateApi({
  action: 'getCompanyData',
  externalDataId: 'companyData',
  namespace: 'DirectorateOfEquality',
})

export const ActiveEqualityReportApi = defineTemplateApi({
  action: 'getActiveEqualityReport',
  externalDataId: 'activeEqualityReport',
  namespace: 'DirectorateOfEquality',
})

export const DoeCompanyApi = defineTemplateApi({
  action: 'getDoeCompany',
  externalDataId: 'doeCompany',
  namespace: 'DirectorateOfEquality',
})

export const EqualityReportTemplateHtmlApi = defineTemplateApi({
  action: 'getEqualityReportTemplateHtml',
  externalDataId: 'equalityReportTemplateHtml',
  namespace: 'DirectorateOfEquality',
})

export const EqualityReportTemplateDocxApi = defineTemplateApi({
  action: 'getEqualityReportTemplateDocx',
  externalDataId: 'equalityReportTemplateDocx',
  namespace: 'DirectorateOfEquality',
})
