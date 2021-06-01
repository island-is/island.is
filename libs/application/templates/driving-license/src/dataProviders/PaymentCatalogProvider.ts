import {
    BasicDataProvider,
    Application,
    SuccessfulDataProviderResult,
    FailedDataProviderResult,
} from '@island.is/application/core'
import { PaymentCatalog } from '../types/schema'
  
export class PaymentCatalogProvider extends BasicDataProvider {
type = 'PaymentCatalogProvider'

async provide(application: Application): Promise<PaymentCatalog[]> {
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
    console.log(application.typeId)
    return this.useGraphqlGateway(query, { performingOrganizationID: "6509142520" })
    .then(async (res: Response) => {
        const response = await res.json()
        //console.log('GraphqlGateway: ' + JSON.stringify(response, null, 4))
        console.log('What is Org ' + JSON.stringify(response.data.paymentCatalogPerformingOrg.item, null, 4))
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