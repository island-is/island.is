import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

/**
 * This provider uses the new national registry API to fetch basic information
 * about a person. Full name, gender, spouse and children.
 */
export class PersonInformationProvider extends BasicDataProvider {
  readonly type = 'PersonInformation'

  async provide(): Promise<unknown> {
    const query = `query GetPersonInformation {
      nationalRegistryUserV2 {
        fullName,
        genderCode,
        spouse {
          nationalId
          name
        }
        children {
          nationalId
        }
      }
    }`
    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          console.error(
            `graphql error in ${this.type}: ${response.errors[0].message}`,
          )
          return this.handleError()
        }

        return Promise.resolve({
          ...response.data.nationalRegistryUserV2,
        })
      })
      .catch(() => {
        return this.handleError()
      })
  }
  handleError() {
    return Promise.reject({})
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
