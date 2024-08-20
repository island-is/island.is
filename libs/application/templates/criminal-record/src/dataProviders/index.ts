import {
  defineTemplateApi,
  InstitutionNationalIds,
  PaymentCatalogApi,
} from '@island.is/application/types'

export { UserProfileApi } from '@island.is/application/types'

export const SyslumadurPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SYSLUMENN,
  },
  externalDataId: 'payment',
})

export const CriminalRecordApi = defineTemplateApi({
  action: 'validateCriminalRecord',
  externalDataId: 'validateCriminalRecord',
})
