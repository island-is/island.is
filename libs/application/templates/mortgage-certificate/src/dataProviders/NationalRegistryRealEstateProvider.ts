import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

export class NationalRegistryRealEstateProvider extends BasicDataProvider {
  readonly type = 'NationalRegistryRealEstate'

  async provide(): Promise<unknown> {
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
        }
      }
    `
    return this.useGraphqlGateway(query, {
      input: { cursor: '1' },
    })
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          console.error(
            `graphql error in ${this.type}: ${response.errors[0].message}`,
          )
          return this.handleError()
        }

        return Promise.resolve({
          ...response.data.assetsOverview,
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
  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    return { date: new Date(), status: 'success', data: result }
  }
}
