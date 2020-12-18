import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
  FailedDataProviderResult,
} from '@island.is/application/core'

export class NationalRegistryProvider extends BasicDataProvider {
  type = 'NationalRegistryProvider'

  async provide(
    application: Application,
  ): Promise<unknown> {
    console.log('================================== nationalregistry provide')
    const query = `query DrivingLicensePoints {
       drivingLicensePoints {
        points
      }
    }`
    return Promise.resolve({})
    // return this.useGraphqlGateway(query)
    //   .then(async (res: Response) => {
    //     const response = await res.json()
    //     if (response.errors) {
    //       return Promise.reject(response.errors[0].message)
    //     }
    //     const responseObj = response.data.getUserProfile
    //     if (
    //       !responseObj?.mobilePhoneNumber ||
    //       !responseObj?.mobilePhoneNumberVerified ||
    //       !responseObj?.email ||
    //       !responseObj?.emailVerified
    //     ) {
    //       return Promise.reject(
    //         'You must go to my pages and set your email and phone number in order to continue the application process',
    //       )
    //     }
    //     return Promise.resolve(responseObj)
    //   })
    //   .catch(() => {
    //     if (process.env.NODE_ENV === 'development') {
    //       return Promise.resolve({
    //         email: 'mockEmail@island.is',
    //         mobilePhoneNumber: '1234567',
    //       })
    //     }
    //     return Promise.reject(
    //       'You must go to my pages and set your email and phone number to in order continue the application process',
    //     )
    //   })
  }

  onProvideError(result: string): FailedDataProviderResult {
    console.log('================================== nationalregistry onProvideError')
    return {
      date: new Date(),
      reason: result,
      status: 'failure',
      data: result,
    }
  }

  onProvideSuccess(result: object): SuccessfulDataProviderResult {
    console.log('================================== nationalregistry onProvideSuccess')
    return { date: new Date(), status: 'success', data: result }
  }
}
