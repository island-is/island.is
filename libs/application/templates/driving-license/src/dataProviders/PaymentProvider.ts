import {
    BasicDataProvider,
    Application,
    SuccessfulDataProviderResult,
    FailedDataProviderResult,
} from '@island.is/application/core'
import { PaymentCatalog } from '../types/schema'
  
export class PaymentProvider extends BasicDataProvider {
type = 'PaymentProvider'

async provide(application: Application): Promise<PaymentCatalog[]> {
    const query = `
    query PaymentProvider($performingOrganizationID: String!) {
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
    console.log(query)
    return this.useGraphqlGateway(query, { performingOrganizationID: "6509142520" })
    .then(async (res: Response) => {
        const response = await res.json()
        console.log('GraphqlGateway: ' + JSON.stringify(response, null, 4))
        if (response.errors) {
            return this.handleError()
        }
        return Promise.resolve(response.data.items)
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
    console.log('provide Error  ' + result)
    return {
    date: new Date(),
    reason: result,
    status: 'failure',
    data: result,
    }
}

onProvideSuccess(result: object): SuccessfulDataProviderResult {
    console.log('provide success  ' + result)
    return { date: new Date(), status: 'success', data: result }
}
}