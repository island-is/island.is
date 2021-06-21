import fetch, { Response } from 'node-fetch'
import * as kennitala from 'kennitala'

// TODO(osk) correct way to include logger? inject?
import { logger } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'

import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'
import { drivingLicensesToSingleGenericLicense } from './drivingLicenseMappers'
import { GenericUserLicense } from '../../licenceService.type'

const {
  PKPASS_TOKEN_URL,
  PKPASS_API_URL,
  PKPASS_API_KEY,
  PKPASS_SECRET_KEY,
} = process.env

const dateToPkpassDate = (date: string) => {
  if (!date) {
    return ''
  }
  // PkPass service wants dates in DD-MM-YYYY format
  return date.substr(0, 10).split('-').reverse().join('-')
}

export class GenericDrivingLicenseApi {
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string
  private readonly xroadPath: string
  private readonly secret: string

  constructor(
    xroadBaseUrl: string,
    xroadClientId: string,
    xroadPath: string,
    secret: string,
  ) {
    this.xroadApiUrl = xroadBaseUrl
    this.xroadClientId = xroadClientId
    this.xroadPath = xroadPath
    this.secret = secret
  }

  headers() {
    return {
      'X-Road-Client': this.xroadClientId,
      SECRET: this.secret,
      Accept: 'application/json',
    }
  }

  async requestApi(url: string): Promise<unknown | null> {
    let res: Response | null = null

    try {
      res = await fetch(`${this.xroadApiUrl}/${url}`, {
        headers: this.headers(),
      })

      if (!res.ok) {
        throw new Error(
          `Expected 200 status for Drivers license query, got ${res.status}`,
        )
      }
    } catch (e) {
      // TODO(osk) correct way to log this?
      logger.error('Unable to query for drivers licence', {
        exception: e,
        url,
      })
      return null
    }

    let json: unknown
    try {
      json = await res.json()
    } catch (e) {
      // TODO(osk) correct way to log this?
      logger.error('Unable to parse JSON for drivers licence', {
        exception: e,
        url,
      })
      return null
    }

    return json
  }

  async getPkPassUrl(license: GenericDrivingLicenseResponse) {
    let pkpassUrl = ''
    console.log(
      'getPkpassUrl',
      PKPASS_TOKEN_URL,
      PKPASS_API_URL,
      PKPASS_API_KEY,
      PKPASS_SECRET_KEY,
    )
    if (
      PKPASS_TOKEN_URL &&
      PKPASS_API_URL &&
      PKPASS_API_KEY &&
      PKPASS_SECRET_KEY
    ) {
      const data = {
        nafn: license.nafn,
        gildirTil: dateToPkpassDate(license.gildirTil || ''),
        faedingardagur: dateToPkpassDate(
          kennitala.info(license.kennitala || '').birthday.toISOString(),
        ),
        faedingarstadur: license.faedingarStadurHeiti,
        utgafuDagsetning: dateToPkpassDate(license.utgafuDagsetning || ''),
        nafnUtgafustadur: license.nafnUtgafustadur,
        kennitala: license.kennitala,
        id: license.id,
        rettindi: license.rettindi?.map((rettindi) => {
          return {
            id: rettindi.id,
            nr: rettindi.nr,
            utgafuDags: dateToPkpassDate(rettindi.utgafuDags || ''),
            gildirTil: dateToPkpassDate(rettindi.gildirTil || ''),
            aths: rettindi.aths,
          }
        }),
        mynd: {
          id: license.mynd?.id,
          kennitala: license.mynd?.kennitala,
          skrad: dateToPkpassDate(license.mynd?.skrad || ''),
          mynd: license.mynd?.mynd,
          gaedi: license.mynd?.gaedi,
          forrit: license.mynd?.forrit,
          tegund: license.mynd?.tegund,
        },
      }

      // console.log(JSON.stringify(data))

      try {
        const tokenData = await fetch(PKPASS_TOKEN_URL, {
          headers: {
            apiKey: PKPASS_API_KEY,
            secretKey: PKPASS_SECRET_KEY,
          },
        }).then((res) => res.json())

        if (tokenData && tokenData.status) {
          const pkpassData = await fetch(PKPASS_API_URL, {
            method: 'POST',
            headers: {
              apiKey: PKPASS_API_KEY,
              accessToken: tokenData.data.ACCESS_TOKEN,
            },
            body: JSON.stringify(data),
          }).then((res) => {
            console.log({ res })
            return res.json()
          })
          // TODO: ^^ pkpassData always returns 401 Unauthorized

          console.log({ pkpassData })
          pkpassUrl = '' // TODO: set the pkpass url
        }
      } catch (e) {
        logger.warn('Unable to get PkPass for license: ', e)
      }
    }

    return pkpassUrl
  }

  /**
   * Fetch drivers license data from RLS through x-road.
   *
   * @param nationalId NationalId to fetch drivers licence for.
   * @return {Promise<GenericUserLicense | null>} Latest driving license or null if an error occured.
   */
  async getGenericDrivingLicense(
    nationalId: User['nationalId'],
    getPkpassUrl = true,
  ): Promise<GenericUserLicense | null> {
    const response = await this.requestApi(
      `${this.xroadPath}/api/Okuskirteini/${nationalId}`,
    )

    // TODO(osk) should this throw or return null? What's the general pattern
    if (!response) {
      return null
    }

    if (!Array.isArray(response)) {
      logger.warn('Expected drivers license response to be an array')
      return null
    }

    // TODO(osk) map and validate every field?
    const licenses = response as GenericDrivingLicenseResponse[]

    // If we get more than one license, sort in descending order so we can pick the first one as the
    // newest license later on
    licenses.sort(
      (
        a?: GenericDrivingLicenseResponse,
        b?: GenericDrivingLicenseResponse,
      ) => {
        const timeA = a?.utgafuDagsetning
          ? new Date(a.utgafuDagsetning).getTime()
          : 0
        const timeB = b?.utgafuDagsetning
          ? new Date(b.utgafuDagsetning).getTime()
          : 0

        if (isNaN(timeA) || isNaN(timeB)) {
          return 0
        }

        return timeB - timeA
      },
    )

    let pkpassUrl: string | undefined = undefined
    if (getPkpassUrl) {
      pkpassUrl = await this.getPkPassUrl(licenses[0])
    }

    const genericDrivingLicense = drivingLicensesToSingleGenericLicense(
      licenses,
      pkpassUrl,
    )

    return genericDrivingLicense
  }
}
