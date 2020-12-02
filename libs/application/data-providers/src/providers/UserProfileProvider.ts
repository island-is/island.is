import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

// TODO using this dataprovider now depends on the developer running the user profile service, and also that (s)he has
// inserted their mobilenumber AND email accordingly. How can we improve this for local development? Will the
// shared/mocking lib be good enought for server side mocking?
export class UserProfileProvider extends BasicDataProvider {
  readonly type = 'UserProfile'

  async provide(): Promise<unknown> {
    const query = `query GetUserProfile {
      getUserProfile {
        email
        emailVerified
        mobilePhoneNumber
        mobilePhoneNumberVerified
      }
    }`

    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return Promise.reject(response.errors[0].message)
        }
        const responseObj = response.data.getUserProfile
        if (
          !responseObj?.mobilePhoneNumber ||
          !responseObj?.mobilePhoneNumberVerified ||
          !responseObj?.email ||
          !responseObj?.emailVerified
        ) {
          return Promise.reject(
            'You must go to my pages and set your email and phone number in order to continue the application process',
          )
        }
        return Promise.resolve(responseObj)
      })
      .catch(() => {
        return Promise.reject(
          'You must go to my pages and set your email and phone number to in order continue the application process',
        )
      })
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
