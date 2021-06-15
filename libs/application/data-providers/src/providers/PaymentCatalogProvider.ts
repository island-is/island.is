import { PaymentCatalogItem } from '@island.is/api/schema'
import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

const searchCorrectCatalog = (
  keySearch: string,
  searchJSON: string,
): string => {
  if (keySearch == '' || searchJSON == '') {
    return searchJSON
  }
  var resultCatalog = JSON.parse(searchJSON)
  for (var item in resultCatalog) {
    if (resultCatalog[item].chargeItemCode == keySearch) {
      return resultCatalog[item]
    }
  }
  return ''
}

export class PaymentCatalogProvider extends BasicDataProvider {
  type = 'PaymentCatalogProvider'

  async provide(application: Application): Promise<PaymentCatalogItem[]> {
    const query = `
    query PaymentCatalogProvider($performingOrganizationID: String!) {
      paymentCatalog(performingOrganizationID: $performingOrganizationID) {
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
    /// THIS NEEDS REFACTORING
    let chargeItemCode = 'AY110'

    return this.useGraphqlGateway(query, {
      performingOrganizationID: '6509142520',
    })
      .then(async (res: Response) => {
        const response = await res.json()
        console.log('my response')
        console.log(JSON.stringify(response, null, 4));
        if (response.errors) {
          return this.handleError()
        }
        if (response.data.paymentCatalog != '') {
          var correctCatalog = searchCorrectCatalog(
            chargeItemCode,
            JSON.stringify(response.data.paymentCatalog.items),
          )

          if (correctCatalog != '') {
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
