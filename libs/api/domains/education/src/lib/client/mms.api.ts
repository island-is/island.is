import fetch from 'node-fetch'

import { User } from '@island.is/auth-nest-tools'

import { LicenseResponse, LicensePDFResponse } from './mms.type'

export class MMSApi {
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string
  private readonly xroadLicenseServiceId: string

  constructor(
    xroadBaseUrl: string,
    xroadClientId: string,
    xroadLicenseServiceId: string,
  ) {
    this.xroadApiUrl = `${xroadBaseUrl}/${xroadLicenseServiceId}`
    this.xroadClientId = xroadClientId
  }

  async requestApi(url: string) {
    const res = await fetch(`${this.xroadApiUrl}/${url}`, {
      headers: {
        'X-Road-Client': this.xroadClientId,
        Accept: 'application/json',
      },
    })
    return res.json()
  }

  getLicenses(nationalId: User['nationalId']): Promise<LicenseResponse[]> {
    return this.requestApi(`api/public/users/${nationalId}/licenses`)
  }

  getLicensePDF(licenseId: string): Promise<LicensePDFResponse> {
    return this.requestApi(`api/public/licenses/${licenseId}/pdf`)
  }
}
