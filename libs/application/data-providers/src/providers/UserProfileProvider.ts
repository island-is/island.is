import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

import { isRunningOnEnvironment } from '@island.is/shared/utils'

/** This data provider fetches email and phone number information from user profile service and resolves even though the user has not set it up in my pages **/
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
          console.error(
            `graphql error in ${this.type}: ${response.errors[0].message}`,
          )
          return this.handleError()
        }

        const responseObj = response.data.getUserProfile
        if (
          !responseObj?.mobilePhoneNumber ||
          !responseObj?.mobilePhoneNumberVerified ||
          !responseObj?.email ||
          !responseObj?.emailVerified
        ) {
          return this.handleError()
        }

        return Promise.resolve(responseObj)
      })
      .catch(() => {
        return this.handleError()
      })
  }
  handleError() {
    if (isRunningOnEnvironment('local')) {
      return Promise.resolve({
        email: 'mockEmail@island.is',
        mobilePhoneNumber: '+3549999999',
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
