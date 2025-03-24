import {
  defineTemplateApi,
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
} from '@island.is/application/types'
import { IdentityApi as IdentityApiProvider } from '@island.is/application/types'

import { UserProfileApi as UserProfileApiProvider } from '@island.is/application/types'
import { ApiActions } from '../shared/types'

export const UserProfileApi = UserProfileApiProvider.configure({
  params: {
    validatePhoneNumber: true,
    validateEmail: true,
  },
})

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

export const getSeminarsApi = defineTemplateApi({
  action: ApiActions.getSeminars,
  externalDataId: 'seminar',
})

export const getIndividualValidityApi = defineTemplateApi({
  action: ApiActions.getIndividualValidity,
  externalDataId: 'individualValidity',
})
