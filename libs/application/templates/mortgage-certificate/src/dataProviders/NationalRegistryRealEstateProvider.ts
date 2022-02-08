import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import { NationalRegistryRealEstate } from '../types/schema'

export class NationalRegistryRealEstateProvider extends BasicDataProvider {
  readonly type = 'NationalRegistryRealEstate'

  async provide(): Promise<NationalRegistryRealEstate> {
    const query = `
      query GetNationalRegistryMyRealEstates {
        nationalRegistryMyRealEstates {
          realEstateNumber
        }
      }
    `
    return this.useGraphqlGateway<NationalRegistryRealEstate>(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          console.error(
            `graphql error in ${this.type}: ${response.errors[0].message}`,
          )
          return this.handleError()
        }

        return Promise.resolve({
          ...response.data.nationalRegistryMyRealEstates,
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
  onProvideSuccess(
    result: NationalRegistryRealEstate,
  ): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
