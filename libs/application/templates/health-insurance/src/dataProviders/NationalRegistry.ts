import {
  BasicDataProvider,
  Application,
  SuccessfulDataProviderResult,
} from '@island.is/application/core'

export class NationalRegistry extends BasicDataProvider {
  type = 'DirectorateOfLabor'
  provide(application: Application): Promise<unknown> {
    return Promise.resolve(application)
  }
  onProvideSuccess(): SuccessfulDataProviderResult {
    return {
      date: new Date(),
      data: {
        name: 'My name',
        nationalId: '0101302129',
        address: 'My address',
        postalCode: '123456',
        city: 'My city',
        nationality: 'My nationality',
        email: 'my@email.me',
        phoneNumber: '1234567',
      },
      status: 'success',
    }
  }
}
