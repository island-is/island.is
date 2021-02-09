import fetch from 'node-fetch'

import { User } from '@island.is/auth-nest-tools'

import { TeachingLicenseResponse, TeachingLicensePDFResponse } from './mms.type'

export class MMSApi {
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string
  private readonly secret: string

  constructor(xroadBaseUrl: string, xroadClientId: string, secret: string) {
    const xroadPath = 'r1/IS-DEV/GOV/10005/XXX' // TODO update this path when we have connected the api to xroad
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

  getTeachingLicenses(
    nationalId: User['nationalId'],
  ): Promise<TeachingLicenseResponse[]> {
    //return this.requestApi(`api/teachingLicense/${nationalId}`) // TODO fix
    return Promise.resolve([{ id: 'unique-id' }, { id: 'another-unique-id' }])
  }

  getTeachingLicensePDF(
    teachingLicenseId: string,
  ): Promise<TeachingLicensePDFResponse> {
    //return this.requestApi(`api/teachingLicense/export/${teachingLicenseID}`) // TODO fix
    return Promise.resolve({
      id: teachingLicenseId,
      content: 'PDF CONTENT',
      filename: `nationalID-${teachingLicenseId}`,
    })
  }
}
