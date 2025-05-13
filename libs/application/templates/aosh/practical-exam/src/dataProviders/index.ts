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
          performingOrgID: InstitutionNationalIds.SYSLUMENN,
          chargeType: 'string',
          chargeItemCode: 'fakeItemCode1',
          chargeItemName: 'fakepayment 1',
          priceAmount: 123123,
        },
        {
          performingOrgID: InstitutionNationalIds.SYSLUMENN,
          chargeType: 'string',
          chargeItemCode: 'fakeItemCode2',
          chargeItemName: 'fakepayment 2',
          priceAmount: 321321,
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
