import {
  defineTemplateApi,
  InstitutionNationalIds,
  PaymentCatalogApi,
} from '@island.is/application/types'

export { UserProfileApi } from '@island.is/application/types'

export const CriminalRecordApi = defineTemplateApi({
  action: 'criminalRecord',
  externalDataId: 'criminalRecord',
})

export const NoDebtCertificateApi = defineTemplateApi({
  action: 'debtLessCertificate',
  externalDataId: 'debtStatus',
})
export const JudicialAdministrationApi = defineTemplateApi({
  action: 'courtBankruptcyCert',
  externalDataId: 'courtBankruptcyCert',
})

export const SyslumadurPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SYSLUMENN,
  },
  externalDataId: 'payment',
})
