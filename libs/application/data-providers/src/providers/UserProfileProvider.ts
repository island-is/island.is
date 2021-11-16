import {
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

import { isRunningOnEnvironment } from '@island.is/shared/utils'

/** This data provider fetches email and phone number information
 * from user profile service and resolves even though the user has
 * not set it up in my pages, it also fethes fullName and genderCode
 * from the national registry **/
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

      nationalRegistryUserV2 {
        fullName,
        genderCode
      }
    }`
    return this.useGraphqlGateway(query)
      .then(async (res: Response) => {
        const response = await res.json()
        if (response.errors) {
          return this.handleError()
        }

        const responseObj = {
          ...response.data.getUserProfile,
          ...response.data.nationalRegistryUserV2,
        }

        return Promise.resolve(responseObj)
      })
      .catch((e) => {
        console.log('Error in user profile provider', e)
        return this.handleError()
      })
  }
  handleError() {
    if (isRunningOnEnvironment('local')) {
      return Promise.resolve({
        email: 'mockEmail@island.is',
        mobilePhoneNumber: '9999999',
        fullName: 'Tester Testerson',
        genderCode: '1',
      })
    }

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
