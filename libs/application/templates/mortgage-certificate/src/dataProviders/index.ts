import {
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
} from '@island.is/application/types'

export { IdentityApi, UserProfileApi } from '@island.is/application/types'

export const SyslumadurPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.SYSLUMENN,
  },
  externalDataId: 'payment',
})

export const MockableSyslumadurPaymentCatalogApi =
  MockablePaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.SYSLUMENN,
    },
    externalDataId: 'payment',
  })
