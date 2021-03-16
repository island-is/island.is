import fetch, { Response } from 'node-fetch'

import { User } from '@island.is/auth-nest-tools'

import { LicenseResponse } from './mms.type'

export class MMSApi {
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string

  constructor(
    xroadBaseUrl: string,
    xroadClientId: string,
    xroadLicenseServiceId: string,
  ) {
    this.xroadApiUrl = `${xroadBaseUrl}/r1/${xroadLicenseServiceId}`
    this.xroadClientId = xroadClientId
  }

  async requestApi(url: string): Promise<Response> {
    return fetch(`${this.xroadApiUrl}/${url}`, {
      headers: {
        'X-Road-Client': this.xroadClientId,
        Accept: 'application/json',
      },
    })
  }

  async getLicenses(
    nationalId: User['nationalId'],
  ): Promise<LicenseResponse[]> {
    const response = await this.requestApi(
      `api/public/users/${nationalId}/licenses`,
    )
    return response.json()
  }

  downloadLicensePDF(nationalId: string, licenseId: string): Promise<Response> {
    return this.requestApi(
      `api/public/users/${nationalId}/licenses/${licenseId}/pdf`,
    )
  }
}
