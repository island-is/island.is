import { DrivingLicenseResponse } from './types'

export class DrivingLicenseApi {
  constructor(private readonly baseApiUrl: string) {}

  async getDrivingLicenses(
    nationalId: string,
  ): Promise<DrivingLicenseResponse[]> {
    return [
      {
        id: 'i-am-an-id',
        name: 'the-name-of-the-guy-who-owns-this-driving-license',
        nationalId,
        status: 200,
      },
    ]
  }
}
