import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { NationalRegistry } from '@island.is/application/templates/family-matters-core/types'

export class NationalRegistryRealEstateProvider extends BasicDataProvider {
  readonly type = 'NationalRegistryRealEstate'

  async provide(): Promise<NationalRegistry> {
    const query = `
      query GetNationalRegistryRealEstateResult {
        nationalRegistryRealEstateResult {
          realEstates {
            realEstateNumber
          }
        }
      }
    `
    return this.useGraphqlGateway<NationalRegistry>(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          console.error(
            `graphql error in ${this.type}: ${response.errors[0].message}`,
          )
          return this.handleError()
        }

        return Promise.resolve({
          ...response.data.nationalRegistryRealEstateResult,
        })
      })
      .catch((error) => {
        return this.handleError()
      })
  }
  handleError() {
    return Promise.reject({})
  }
  onProvideError(result: { message: string }): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: result.message,
      status: 'failure',
      data: result,
    }
  }
  onProvideSuccess(result: NationalRegistry): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
