import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { DataProviderTypes, Applicant } from '../types'

export class NationalRegistryProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.NationalRegistry
  async provide(): Promise<Applicant> {
    const query = `
      query NationalRegistryUserQuery {
        nationalRegistryUserV2 {
          nationalId
          fullName
          address {
            streetName
            postalCode
            city
            municipalityCode
          }
          spouse {
            nationalId
            maritalStatus
            name
          }
        }
      }
    `

    return this.useGraphqlGateway<Applicant>(query)
      .then(async (res: Response) => {
        console.log('response', res)
        const response = await res.json()
        if (response.errors) {
          return this.handleError(response.errors)
        }
        const returnObject: Applicant = response.data.nationalRegistryUserV2
        return Promise.resolve(returnObject)
      })
      .catch((error) => {
        console.log('error', error)
        return this.handleError(error)
      })
  }
  handleError(error: Error | unknown) {
    console.error('Provider.FinancialAid.NationalRegistry:', error)
    return Promise.reject('Failed to fetch from national registry')
  }
  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
    }
  }
  onProvideSuccess(result: Applicant): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
