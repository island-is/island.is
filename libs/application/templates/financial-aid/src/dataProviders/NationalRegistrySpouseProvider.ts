import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { DataProviderTypes, Applicant } from '../lib/types'

const nationalRegistryQuery = `
query NationalRegistryUserQuery {
  nationalRegistryUserV2 {
    fullName
  }
}
`

export class NationalRegistrySpouseProvider extends BasicDataProvider {
  readonly type = DataProviderTypes.NationalRegistrySpouse

  async runQuery<T>(
    query: string,
    key: string,
    variables?: Record<string, { id: string }>,
  ): Promise<T> {
    return await this.useGraphqlGateway(query, variables)
      .then(async (res: Response) => {
        const response = await res.json()

        if (response.errors) {
          return this.handleError(response.errors)
        }

        return Promise.resolve(response.data[key])
      })
      .catch((error) => {
        return this.handleError(error)
      })
  }

  async provide(): Promise<{
    fullName: string
  }> {
    const applicant = await this.runQuery<Applicant>(
      nationalRegistryQuery,
      'nationalRegistryUserV2',
    )
    return { fullName: applicant.fullName }
  }

  handleError(error: Error | unknown) {
    console.error('Provider.FinancialAid.NationalRegistrySpouse:', error)
    return Promise.reject('Failed to fetch from national registry for spouse')
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
