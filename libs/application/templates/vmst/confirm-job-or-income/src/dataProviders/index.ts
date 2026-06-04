import { defineTemplateApi } from '@island.is/application/types'

export const CanReportWorkApi = defineTemplateApi({
  action: 'getCanReportWork',
  externalDataId: 'canReportWork',
})

export const PensionFundsApi = defineTemplateApi({
  action: 'getPensionFunds',
  externalDataId: 'pensionFunds',
})

export const IncomeTypesApi = defineTemplateApi({
  action: 'getIncomeTypes',
  externalDataId: 'incomeTypes',
})

export const SubmitApi = defineTemplateApi({
  action: 'submitApplication',
})
