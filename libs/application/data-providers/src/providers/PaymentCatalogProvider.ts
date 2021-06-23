import { PaymentCatalogItem } from '@island.is/api/schema'
import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

const CHARGE_ITEM_CODE = 'AY110'

// TODO: needs refactoring
const searchCorrectCatalog = (
  keySearch: string,
  searchJSON: string,
): string | null => {
  if (keySearch == '' || searchJSON == '') {
    return searchJSON
  }
  const resultCatalog = JSON.parse(searchJSON)
  for (const item in resultCatalog) {
    if (resultCatalog[item].chargeItemCode == keySearch) {
      return resultCatalog[item]
    }
  }
  return null
}

export class PaymentCatalogProvider extends BasicDataProvider {
  type = 'PaymentCatalogProvider'

  async provide(application: Application): Promise<PaymentCatalogItem[]> {
    const query = `
    query PaymentCatalogProvider($input: PaymentCatalogInput!) {
      paymentCatalog(input: $input) {
        items {
          performingOrgID
          chargeType
          chargeItemCode
          chargeItemName
          priceAmount
        }
      }
    }
    `

    return this.useGraphqlGateway(query, {
      input: { performingOrganizationID: '6509142520' },
    })
      .then(async (res: Response) => {
        // TODO: needs refactoring
        const response = await res.json()
        console.log(JSON.stringify(response, null, 4))
        if (response.errors) {
          return this.handleError()
        }

        if (response.data.paymentCatalog !== '') {
          const correctCatalog = searchCorrectCatalog(
            CHARGE_ITEM_CODE,
            JSON.stringify(response.data.paymentCatalog.items),
          )

          if (correctCatalog !== '') {
            return Promise.resolve(correctCatalog)
          }
        }
        return Promise.resolve(response.data.paymentCatalog.items)
      })
      .catch(() => {
        return this.handleError()
      })
  }

  handleError() {
    return Promise.resolve({})
  }

  onProvideError(result: string): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
