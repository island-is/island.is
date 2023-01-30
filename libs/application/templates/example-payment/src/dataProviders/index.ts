import { PaymentCatalogApi } from '@island.is/application/types'

export const ExamplePaymentCatalogApi = PaymentCatalogApi.configure({
  params: {
    organizationId: '6509142520',
  },
})
