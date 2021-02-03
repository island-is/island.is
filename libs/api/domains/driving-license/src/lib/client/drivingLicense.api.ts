import fetch from 'node-fetch'

import { User } from '@island.is/auth-nest-tools'

import {
  DrivingLicenseResponse,
  DeprivationTypesResponse,
  EntitlementTypesResponse,
  RemarkTypesResponse,
  PenaltyPointStatusResponse,
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

  async requestApi(url: string) {
    const res = await fetch(`${this.xroadApiUrl}/${url}`, {
      headers: {
        'X-Road-Client': this.xroadClientId,
        SECRET: this.secret,
        Accept: 'application/json',
      },
    })
    return res.json()
  }

  getDrivingLicenses(
    nationalId: User['nationalId'],
  ): Promise<DrivingLicenseResponse[]> {
    return this.requestApi(`api/Okuskirteini/${nationalId}`)
  }

  getDeprivationTypes(): Promise<DeprivationTypesResponse[]> {
    return this.requestApi('api/Okuskirteini/tegundirsviptinga')
  }

  getEntitlementTypes(): Promise<EntitlementTypesResponse[]> {
    return this.requestApi('api/Okuskirteini/tegundirrettinda')
  }

  getRemarkTypes(): Promise<RemarkTypesResponse[]> {
    return this.requestApi('api/Okuskirteini/tegundirathugasemda')
  }

  async getPenaltyPointStatus(
    nationalId: User['nationalId'],
  ): Promise<PenaltyPointStatusResponse> {
    return this.requestApi(`api/Okuskirteini/punktastada/${nationalId}`)
  }
}
