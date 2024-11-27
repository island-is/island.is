import {
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
} from '@island.is/application/types'
import { IdentityApi as IdentityApiProvider } from '@island.is/application/types'

export { UserProfileApi } from '@island.is/application/types'

export const VinnueftirlitidPaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: InstitutionNationalIds.VINNUEFTIRLITID,
  },
  externalDataId: 'payment',
})

export const MockableVinnueftirlitidPaymentCatalogApi =
  MockablePaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.VINNUEFTIRLITID,
    },
    externalDataId: 'payment',
  })

export const IdentityApi = IdentityApiProvider.configure({
  params: {
    includeActorInfo: true,
  },
})
