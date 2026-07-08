import { defineTemplateApi } from '@island.is/application/types'
import { ApiActions } from '../utils/constants'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

// PREREQUISITES providers — independent of each other, order is inconsequential
export const CompanyRegistryApi = defineTemplateApi({
  action: ApiActions.getCompanyData,
  externalDataId: 'companyData',
  order: 0,
})

export const ActiveEqualityReportApi = defineTemplateApi({
  action: ApiActions.getActiveEqualityReport,
  externalDataId: 'activeEqualityReport',
  order: 1,
})

export const DoeCompanyApi = defineTemplateApi({
  action: ApiActions.getDoeCompany,
  externalDataId: 'doeCompany',
  order: 2,
})

// DRAFT providers — only ever triggered on-demand via updateApplicationExternalData
// from Editor.tsx / PreviousEqualityPlan.tsx, never run automatically on state entry
export const PreviousEqualityReportContentApi = defineTemplateApi({
  action: ApiActions.getPreviousEqualityReportContent,
  externalDataId: 'previousEqualityReportContent',
  order: 0,
})

export const EqualityReportTemplateHtmlApi = defineTemplateApi({
  action: ApiActions.getEqualityReportTemplateHtml,
  externalDataId: 'equalityReportTemplateHtml',
  order: 0,
})

export const EqualityReportTemplateDocxApi = defineTemplateApi({
  action: ApiActions.getEqualityReportTemplateDocx,
  externalDataId: 'equalityReportTemplateDocx',
  order: 0,
})
