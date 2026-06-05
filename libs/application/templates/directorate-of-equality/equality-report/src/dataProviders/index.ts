import { defineTemplateApi } from '@island.is/application/types'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const CompanyRegistryApi = defineTemplateApi({
  action: 'getCompanyData',
  externalDataId: 'companyData',
})

export const ActiveEqualityReportApi = defineTemplateApi({
  action: 'getActiveEqualityReport',
  externalDataId: 'activeEqualityReport',
})

export const DoeCompanyApi = defineTemplateApi({
  action: 'getDoeCompany',
  externalDataId: 'doeCompany',
})

export const EqualityReportTemplateHtmlApi = defineTemplateApi({
  action: 'getEqualityReportTemplateHtml',
  externalDataId: 'equalityReportTemplateHtml',
})

export const EqualityReportTemplateDocxApi = defineTemplateApi({
  action: 'getEqualityReportTemplateDocx',
  externalDataId: 'equalityReportTemplateDocx',
})
