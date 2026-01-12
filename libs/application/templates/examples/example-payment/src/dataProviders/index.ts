import {
  InstitutionNationalIds,
  MockablePaymentCatalogApi,
} from '@island.is/application/types'

export { PaymentCatalogApi } from '@island.is/application/types'

export const MockPaymentCatalogWithTwoItems =
  MockablePaymentCatalogApi.configure({
    params: {
      organizationId: InstitutionNationalIds.SYSLUMENN,
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
