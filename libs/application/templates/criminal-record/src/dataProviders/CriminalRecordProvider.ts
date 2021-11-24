import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
  coreErrorMessages,
} from '@island.is/application/core'
//import { PaymentCatalogItem } from '@island.is/api/schema'

export class CriminalRecordProvider extends BasicDataProvider {
  type = 'CriminalRecordProvider'

  async provide(application: Application): Promise<unknown> {
    //TODO sækja ssn og senda inn 
    var ssn = 'TODOssn1'

    const query = `
    query CheckCriminalRecord {
        checkCriminalRecord
      }
    `

    return this.useGraphqlGateway(query, { 
        input: { ssn: ssn }
      }).then(async (res: Response) => {
      const response = await res.json()

      if (response.errors) {
        console.error(
          `graphql error in ${this.type}: ${response.errors[0].message}`,
        )
        return Promise.reject({})
      }

      return Promise.resolve(response.data.checkCriminalRecord)
    })
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: coreErrorMessages.errorDataProvider,
      status: 'failure',
      data: {},
    }
  }

  onProvideSuccess(
    result: Record<string, unknown>,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
