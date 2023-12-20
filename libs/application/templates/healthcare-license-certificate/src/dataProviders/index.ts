import {
  InstitutionNationalIds,
  PaymentCatalogApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { ApiActions } from '../shared'

export {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'

export const EmbaettiLandlaeknisPaymentCatalogApi = PaymentCatalogApi.configure(
  {
    params: {
      organizationId: InstitutionNationalIds.EMBAETTI_LANDLAEKNIS,
    },
    externalDataId: 'payment',
  },
)

export const HealtcareLicenesApi = defineTemplateApi({
  action: ApiActions.getMyHealthcareLicenses,
  externalDataId: 'healthcareLicenses',
})
