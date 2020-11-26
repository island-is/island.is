import {
  Application,
  BasicDataProvider,
  FailedDataProviderResult,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'
import fetch from 'isomorphic-fetch'

type UserProfileResponse = {
  email: string
  emailVerified: boolean
}

export class UserProfileProvider extends BasicDataProvider {
  readonly type = 'UserProfile'

  async provide(application: Application): Promise<unknown> {
    if (onDev()) {
      return Promise.resolve({
        email: 'arni@island.is',
        phoneNumber: '1234567',
      })
    }
    return fetch(`http://web-service-portal-api.service-portal.svc.cluster.local
/userProfile/${application.applicant}`)
      .then(async (res: Response) => {
        const response = await res.json()
        if (
          !response.mobilePhoneNumber ||
          !response.mobilePhoneNumberVerified ||
          !response.email ||
          !response.emailVerified
        ) {
          return Promise.reject(
            'You must go to my pages and set your email and phone number in order to continue the application process',
          )
        }
        return Promise.resolve(response)
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
