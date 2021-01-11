import fetch from 'node-fetch'

import { User } from '@island.is/auth-nest-tools'

import { DrivingLicenseResponse } from './drivingLicense.type'

const XROAD_PATH =
  'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1'
const XROAD_CLIENT = 'IS-DEV/GOV/10000/island-is-client'

export class DrivingLicenseApi {
  private readonly baseApiUrl: string
  private readonly secret: string

  constructor(baseUrl: string, secret: string) {
    this.baseApiUrl = `${baseUrl}/${XROAD_PATH}`
    this.secret = secret
  }

  requestApi(url: string) {
    return fetch(`${this.baseApiUrl}/${url}`, {
      headers: {
        'X-Road-Client': XROAD_CLIENT,
        SECRET: this.secret,
        Accept: 'application/json',
      },
    })
  }

  async getDrivingLicenses(
    nationalId: User['nationalId'],
  ): Promise<DrivingLicenseResponse[]> {
    const res = await this.requestApi(`api/Okuskirteini/${nationalId}`)
    return res.json()
  }
}
