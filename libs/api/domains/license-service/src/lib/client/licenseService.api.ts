import fetch from 'node-fetch'
import { User } from '@island.is/auth-nest-tools'

import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'

export class LicenseServiceApi {
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string
  private readonly secret: string

  constructor(xroadBaseUrl: string, xroadClientId: string, secret: string) {
    this.xroadApiUrl = xroadBaseUrl
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

  getGenericDrivingLicense(
    nationalId: User['nationalId'],
  ): Promise<GenericDrivingLicenseResponse[]> {
    const xroadDrivingLicensePath =
      'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1'
    return this.requestApi(
      `${xroadDrivingLicensePath}/api/Okuskirteini/${nationalId}`,
    )
  }
}
