import { defineTemplateApi } from '@island.is/application/types'

export { PaymentCatalogApi, UserProfileApi } from '@island.is/application/types'

export const CriminalRecordApi = defineTemplateApi({
  action: 'criminalRecord',
  externalDataId: 'criminalRecord',
})

export const NoDebtCertificateApi = defineTemplateApi({
  action: 'debtLessCertificate',
  externalDataId: 'debtStatus',
})

export const CourtBankruptcyCertApi = defineTemplateApi({
  action: 'courtBankruptcyCert',
  externalDataId: 'courtBankruptcyCert',
})
