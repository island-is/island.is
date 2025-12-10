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
      mockPaymentCatalog: [
        {
          performingOrgID: InstitutionNationalIds.VINNUEFTIRLITID,
          chargeType: 'string',
          chargeItemCode: 'VJ101',
          chargeItemName: 'Verklegt próf',
          priceAmount: 10800,
        },
        {
          performingOrgID: InstitutionNationalIds.VINNUEFTIRLITID,
          chargeType: 'string',
          chargeItemCode: 'VJ103',
          chargeItemName: 'Skírteini',
          priceAmount: 8640,
        },
      ],
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
