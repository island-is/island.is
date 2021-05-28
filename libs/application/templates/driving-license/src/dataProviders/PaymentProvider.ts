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
    query PaymentProvider {
        paymentCatalog {
        performingOrgID
        chargeType
        chargeItemCode
        chargeItemName
        priceAmount
        }
    }
    `

    return this.useGraphqlGateway(query)
    .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
        return this.handleError()
        }

        return Promise.resolve(response.data.items)
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