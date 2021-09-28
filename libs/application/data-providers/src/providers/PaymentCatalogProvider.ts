import { PaymentCatalogItem } from '@island.is/api/schema'
import { BasicDataProvider } from '@island.is/application/core'

export abstract class PaymentCatalogProvider extends BasicDataProvider {
  async getCatalogForOrganization(
    organizationId: string,
  ): Promise<PaymentCatalogItem[] | null> {
    const query = `
      query PaymentCatalogProvider($input: PaymentCatalogInput!) {
        paymentCatalog(input: $input) {
          items {
            performingOrgID
            chargeItemCode
            chargeItemName
            priceAmount
          }
        }
      }
    `

    return this.useGraphqlGateway(query, {
      input: { performingOrganizationID: organizationId },
    }).then(async (res: Response) => {
      const response = await res.json()

      if (response.errors) {
        console.error(response)
        return Promise.reject(response.errors)
      }

      return response.data.paymentCatalog.items
    })
  }
}
