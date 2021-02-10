import fetch from 'node-fetch'

import { User } from '@island.is/auth-nest-tools'

import { LicenseResponse, LicensePDFResponse } from './mms.type'

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

  getLicenses(nationalId: User['nationalId']): Promise<LicenseResponse[]> {
    //return this.requestApi(`api/licenses/${nationalId}`) // TODO fix
    return Promise.resolve([
      {
        id: '987654',
        school: 'Menntamálaráðuneytið',
        programme: 'Kennararéttindi',
        date: '2010-09-01',
      },
      {
        id: '456789',
        school: 'Viðskiptaráð',
        programme: 'Próf í verðbréfaviðskiptum',
        date: '2005-05-25',
      },
    ])
  }

  getLicensePDF(licenseId: string): Promise<LicensePDFResponse> {
    //return this.requestApi(`api/licenses/licenseId/export`) // TODO fix
    return Promise.resolve({
      id: licenseId,
      content: 'PDF CONTENT',
      filename: `nationalID-${licenseId}`,
    })
  }
}
