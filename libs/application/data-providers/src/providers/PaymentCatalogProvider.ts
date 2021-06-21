import { PaymentCatalogItem } from '@island.is/api/schema'
import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

// TODO: needs refactoring
const searchCorrectCatalog = (
  keySearch: string,
  searchJSON: string,
): string | null => {
  if (keySearch == '' || searchJSON == '') {
    return searchJSON
  }
  var resultCatalog = JSON.parse(searchJSON)
  for (var item in resultCatalog) {
    if (resultCatalog[item].chargeItemCode == keySearch) {
      return resultCatalog[item]
    }
  }
  return null
}
// ///$input: CreateCourtCaseInput!) {
//   createCourtCase(input: $input) {
//     courtCaseNumber
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
    // TODO: Needs refactoring
    let chargeItemCode = 'AY110'

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
            chargeItemCode,
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
