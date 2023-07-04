import {
  defineTemplateApi,
  PaymentCatalogApi,
} from '@island.is/application/types'
import { SYSLUMADUR_NATIONAL_ID } from '../lib/constants'

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
    organizationId: SYSLUMADUR_NATIONAL_ID,
  },
  externalDataId: 'payment',
})
