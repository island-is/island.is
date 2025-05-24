import {
  defineTemplateApi,
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
  PaymentCatalogApi,
} from '@island.is/application/types'
import { ApiActions } from '../utils/enums'
export { IdentityApi, UserProfileApi } from '@island.is/application/types'

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
      enableMockPayment: true,
    },
    externalDataId: 'payment',
  })

export const getExamCategoriesApi = defineTemplateApi({
  action: ApiActions.getExamCategories,
  externalDataId: 'examCategories',
})

export const getPostcodesApi = defineTemplateApi({
  action: ApiActions.getPostcodes,
  externalDataId: 'postcodes',
})
