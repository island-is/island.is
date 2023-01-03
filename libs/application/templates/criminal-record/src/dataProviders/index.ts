import {
  defineTemplateApi,
  PaymentCatalogApi,
} from '@island.is/application/types'

export {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

const SYSLUMADUR_NATIONAL_ID = '6509142520'

export const SyslumadurPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    orginizationId: SYSLUMADUR_NATIONAL_ID,
  },
  externalDataId: 'payment',
})

export const CriminalRecordApi = defineTemplateApi({
  action: 'validateCriminalRecord',
  externalDataId: 'validateCriminalRecord',
})
