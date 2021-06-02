import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { PaymentCatalog } from '../types/schema'

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
      console.log('Correct catalog found: ' + resultCatalog[item])
      return resultCatalog[item]
    }
  }
  return ''
}

export class PaymentCatalogProvider extends BasicDataProvider {
  type = 'PaymentCatalogProvider'

  async provide(application: Application): Promise<PaymentCatalog> {
    const query = `
    query PaymentCatalogProvider($performingOrganizationID: String!) {
        paymentCatalogPerformingOrg(performingOrganizationID: $performingOrganizationID) {
            item {                
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
    console.log(application.typeId)
    let chargeItemCode = ''
    if (application.typeId == 'DrivingLicense') chargeItemCode = 'AY110'

    return this.useGraphqlGateway(query, {
      performingOrganizationID: '6509142520',
    })
      .then(async (res: Response) => {
        const response = await res.json()
        //console.log('GraphqlGateway: ' + JSON.stringify(response, null, 4))
        if (response.errors) {
          return this.handleError()
        }
        console.log(response.data.paymentCatalogPerformingOrg != '')
        if (response.data.paymentCatalogPerformingOrg != '') {
          var correctCatalog = searchCorrectCatalog(
            chargeItemCode,
            JSON.stringify(response.data.paymentCatalogPerformingOrg.item),
          )
          console.log(correctCatalog)

          if (correctCatalog != '') {
            return Promise.resolve(correctCatalog)
          }
        }
        return Promise.resolve(response.data.paymentCatalogPerformingOrg.item)
      })
      .catch(() => {
        console.log('catch error  ' + this)
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
    console.log('provider Succses : ' + result)
    return { date: new Date(), status: 'success', data: result }
  }
}
