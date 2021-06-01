import fetch from 'node-fetch'

import { User } from '@island.is/auth-nest-tools'

import {
  DrivingLicenseResponse,
} from './drivingLicense.type'

export class DrivingLicenseApi {
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string
  private readonly secret: string

  constructor(xroadBaseUrl: string, xroadClientId: string, secret: string) {
    const xroadPath =
      'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1'
    this.xroadApiUrl = `${xroadBaseUrl}/${xroadPath}`
    this.xroadClientId = xroadClientId
    this.secret = secret
  }

  headers() {
    return {
      'X-Road-Client': this.xroadClientId,
      SECRET: this.secret,
      Accept: 'application/json',
    }
  }

  async requestApi(url: string) {
    const res = await fetch(`${this.xroadApiUrl}/${url}`, {
      headers: this.headers(),
    })
    return res.json()
  }

  getDrivingLicenses(
    nationalId: User['nationalId'],
  ): Promise<DrivingLicenseResponse[]> {
    return this.requestApi(`api/Okuskirteini/${nationalId}`)
  }

}
