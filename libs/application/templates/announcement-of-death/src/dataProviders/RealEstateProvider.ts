import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'
import { RealEstates } from '../types/schema'
import { m } from '../lib/messages'

export class RealEstateProvider extends BasicDataProvider {
  type = 'DistrictsProvider'

  async provide(): Promise<RealEstates> {
    // TODO query by deathed relative

    const query = `
      query GetRealEstateQuery($input: GetMultiPropertyInput!) {
        assetsOverview(input: $input) {
          properties {
            propertyNumber
            defaultAddress {
              locationNumber
              postNumber
              municipality
              propertyNumber
              display
              displayShort
            }
          }
          paging {
            page
            pageSize
            totalPages
            offset
            total
            hasPreviousPage
            hasNextPage
          }
        }
      }
    `

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors?.length > 0) {
          return this.handleError(response.errors[0])
        }

        return Promise.resolve(
          response.data.getAssetsOverview,
        )
      })
      .catch((error) => this.handleError(error))
  }

  handleError(error: any) {
    return Promise.reject({})
  }

  onProvideError(): FailedDataProviderResult {
    return {
      date: new Date(),
      reason: m.errorDataProvider,
      status: 'failure',
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
