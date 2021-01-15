import fetch from 'node-fetch'

import { User } from '@island.is/auth-nest-tools'

import {
  DrivingLicenseResponse,
  DeprivationTypesResponse,
  EntitlementTypesResponse,
  RemarkTypesResponse,
  PenaltyPointStatusResponse,
} from './drivingLicense.type'

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

  async requestApi(url: string) {
    const res = await fetch(`${this.baseApiUrl}/${url}`, {
      headers: {
        'X-Road-Client': XROAD_CLIENT,
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
