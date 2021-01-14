import {
  BasicDataProvider,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

export class UserNationalRegistryProvider extends BasicDataProvider {
  type = 'UserNationalRegistryProvider'
  async provide(): Promise<unknown> {
    const query = `query NationalRegistryUser {
      nationalRegistryUser {
        nationalId
        fullName
        citizenship
        legalResidence
      }
    }`
    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError()
        }
        const responseObj = response.data?.nationalRegistryUser

        // Split the legalResidence field to match the input fields in the form
        const addressFields = responseObj?.legalResidence.split(' ')
        const streetAddress = addressFields[0]
        const postalCode = addressFields[1]
        const city = addressFields[2]

        return Promise.resolve({
          ...responseObj,
          streetAddress,
          postalCode,
          city,
        })
      })
      .catch(() => {
        return this.handleError()
      })
  }
  handleError() {
    if (process.env.NODE_ENV === 'development') {
      return Promise.resolve({
        fullName: 'Name',
        nationalId: '0101302129',
        legalResidence: 'Street, 111 City',
        streetAddress: 'Street',
        postalCode: '111',
        city: 'City',
        citizenship: 'Swedish',
      })
    }
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
