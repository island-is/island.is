import fetch, { Response } from 'node-fetch'

import * as kennitala from 'kennitala'
import format from 'date-fns/format'
import { Cache as CacheManager } from 'cache-manager'
import { Injectable } from '@nestjs/common'
import { CACHE_MANAGER } from '@nestjs/cache-manager'
import type { Logger } from '@island.is/logging'
import { logger } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'

import { OldGenericDrivingLicenseResponse } from './oldGenericDrivingLicense.type'
import { parseDrivingLicensePayload } from './oldDrivingLicenseMappers'
import {
  GenericLicenseClient,
  GenericLicenseLabels,
  GenericLicenseUserdataExternal,
  GenericUserLicensePkPassStatus,
  GenericUserLicenseStatus,
  PkPassVerification,
  PkPassVerificationError,
} from '../../licenceService.type'
import { OldPkPassClient } from './oldPkpass.client'
import { OldPkPassPayload } from './oldPkpass.type'
import { Locale } from '@island.is/shared/types'
import { OldGenericDrivingLicenseConfig } from './oldGenericDrivingLicense.config'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'

/** Category to attach each log message to */
const LOG_CATEGORY = 'old-drivinglicense-service'

/** Defined cut-off point for driving license images */
const IMAGE_CUTOFF_DATE = '1997-08-15'

// PkPass service wants dates in DD-MM-YYYY format
const dateToPkpassDate = (date: string): string => {
  if (!date) {
    return ''
  }

  try {
    return format(new Date(date), 'dd-MM-yyyy')
  } catch (e) {
    return ''
  }
}

@Injectable()
export class OldGenericDrivingLicenseApi
  implements GenericLicenseClient<OldGenericDrivingLicenseResponse>
{
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string
  private readonly xroadPath: string
  private readonly xroadSecret: string

  private pkpassClient: OldPkPassClient

  constructor(
    private logger: Logger,
    private xroadConfig: ConfigType<typeof XRoadConfig>,
    private config: ConfigType<typeof OldGenericDrivingLicenseConfig>,
    private cacheManager?: CacheManager | null,
  ) {
    // TODO inject the actual RLS x-road client
    this.xroadApiUrl = xroadConfig.xRoadBasePath
    this.xroadClientId = xroadConfig.xRoadClient
    this.xroadPath = config.xroad.path
    this.xroadSecret = config.xroad.secret

    this.logger = logger
    this.cacheManager = cacheManager

    // TODO this should be injected by nest
    this.pkpassClient = new OldPkPassClient(config, logger, cacheManager)
  }

  private headers() {
    return {
      'X-Road-Client': this.xroadConfig.xRoadClient,
      SECRET: this.config.xroad.secret,
      Accept: 'application/json',
    }
  }

  private async requestApi(url: string): Promise<unknown | null> {
    let res: Response | null = null

    try {
      res = await fetch(`${this.xroadConfig.xRoadBasePath}/${url}`, {
        headers: this.headers(),
        timeout: this.config.fetch.timeout,
      })

      if (!res.ok) {
        if (res.status !== 400 && res.status !== 404) {
          throw new Error(
            `Expected 200 status for Drivers license query, got ${res.status}`,
          )
        }
        return null
      }
    } catch (e) {
      this.logger.error('Unable to query for drivers licence', {
        exception: e,
        url,
        category: LOG_CATEGORY,
      })
      return null
    }

    let json: unknown
    try {
      json = await res.json()
    } catch (e) {
      this.logger.error('Unable to parse JSON for drivers licence', {
        exception: e,
        url,
        category: LOG_CATEGORY,
      })
      return null
    }
    return json
  }

  private async requestFromXroadApi(
    nationalId: string,
  ): Promise<OldGenericDrivingLicenseResponse[] | null> {
    const response = await this.requestApi(
      `${this.config.xroad.path}/api/Okuskirteini/${nationalId}`,
    )

    if (!response) {
      logger.warn('Falsy result from drivers license response', {
        category: LOG_CATEGORY,
      })
      return null
    }

    if (!Array.isArray(response)) {
      logger.warn('Expected drivers license response to be an array', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const licenses = response as OldGenericDrivingLicenseResponse[]

    // If we get more than one license, sort in descending order so we can pick the first one as the
    // newest license later on
    // TODO(osk): This is a bug, fixed in v2 of the service (see https://www.notion.so/R-kisl-greglustj-ri-60f22ab2789e4e0296f5fe6e25fa19cf)
    licenses.sort(
      (
        a?: OldGenericDrivingLicenseResponse,
        b?: OldGenericDrivingLicenseResponse,
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

    return licenses
  }

  private drivingLicenseToPkpassPayload(
    license: OldGenericDrivingLicenseResponse,
  ): OldPkPassPayload {
    return {
      nafn: license.nafn,
      gildirTil: dateToPkpassDate(license.gildirTil ?? ''),
      faedingardagur: dateToPkpassDate(
        kennitala.info(license.kennitala ?? '').birthday.toISOString(),
      ),
      faedingarstadur: license.faedingarStadurHeiti,
      utgafuDagsetning: dateToPkpassDate(license.utgafuDagsetning ?? ''),
      nafnUtgafustadur: license.nafnUtgafustadur,
      kennitala: license.kennitala,
      id: license.id,
      rettindi: license.rettindi?.map((rettindi) => {
        return {
          id: rettindi.id,
          nr: rettindi.nr,
          utgafuDags: dateToPkpassDate(rettindi.utgafuDags ?? ''),
          gildirTil: dateToPkpassDate(rettindi.gildirTil ?? ''),
          aths: rettindi.aths,
        }
      }),
      mynd: {
        id: license.mynd?.id,
        kennitala: license.mynd?.kennitala,
        skrad: dateToPkpassDate(license.mynd?.skrad ?? ''),
        mynd: license.mynd?.mynd,
        gaedi: license.mynd?.gaedi,
        forrit: license.mynd?.forrit,
        tegund: license.mynd?.tegund,
      },
    }
  }

  static licenseIsValidForPkpass(
    license: OldGenericDrivingLicenseResponse,
  ): GenericUserLicensePkPassStatus {
    if (!license || license.mynd === undefined) {
      return GenericUserLicensePkPassStatus.Unknown
    }

    if (!license.mynd?.skrad || !license.mynd?.mynd) {
      return GenericUserLicensePkPassStatus.NotAvailable
    }

    return GenericUserLicensePkPassStatus.Available
  }

  /**
   * Notify RLS about the creation of a pkpass.
   * @param nationalId National id of the user that created the pkpass.
   */
  private async notifyPkPassCreated(nationalId: string) {
    try {
      await fetch(
        `${this.xroadConfig.xRoadBasePath}/api/Okuskirteini/${nationalId}`,
        {
          method: 'POST',
          headers: this.headers(),
        },
      )
    } catch (e) {
      this.logger.info('Unable to notify RLS of pkpass creation', {
        exception: e,
        exceptionMessage: e.message,
        category: LOG_CATEGORY,
      })
      return null
    }
  }

  async getPkPassUrlByNationalId(nationalId: string): Promise<string | null> {
    const licenses = await this.requestFromXroadApi(nationalId)

    if (!licenses) {
      return null
    }

    const license = licenses[0]

    if (!license) {
      return null
    }

    if (!OldGenericDrivingLicenseApi.licenseIsValidForPkpass(license)) {
      this.logger.info('License is not valid for pkpass generation', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const payload = this.drivingLicenseToPkpassPayload(license)

    const pkPassUrl = await this.pkpassClient.getPkPassUrl(payload)

    if (pkPassUrl) {
      this.notifyPkPassCreated(nationalId)
    }

    return pkPassUrl
  }

  async getPkPassUrl(user: User): Promise<string | null> {
    return this.getPkPassUrlByNationalId(user.nationalId)
  }

  async getPkPassQRCodeByNationalId(
    nationalId: string,
  ): Promise<string | null> {
    const licenses = await this.requestFromXroadApi(nationalId)

    if (!licenses) {
      return null
    }

    const license = licenses[0]

    if (!license) {
      return null
    }

    if (!OldGenericDrivingLicenseApi.licenseIsValidForPkpass(license)) {
      this.logger.info('License is not valid for pkpass generation', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const payload = this.drivingLicenseToPkpassPayload(license)

    const qrCode = await this.pkpassClient.getPkPassQRCode(payload)

    if (qrCode) {
      this.notifyPkPassCreated(nationalId)
    }

    return qrCode
  }

  async getPkPassQRCode(user: User): Promise<string | null> {
    return this.getPkPassQRCodeByNationalId(user.nationalId)
  }

  /**
   * Fetch drivers license data from RLS through x-road.
   *
   * @param nationalId NationalId to fetch drivers licence for.
   * @return {Promise<GenericLicenseUserdataExternal | null>} Latest driving license or null if an error occured.
   */
  async getLicense(
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ): Promise<GenericLicenseUserdataExternal | null> {
    const licenses = await this.requestFromXroadApi(user.nationalId)

    if (!licenses) {
      return null
    }

    const payload = parseDrivingLicensePayload(licenses, locale, labels)

    let pkpassStatus: GenericUserLicensePkPassStatus =
      GenericUserLicensePkPassStatus.Unknown

    if (payload) {
      pkpassStatus = OldGenericDrivingLicenseApi.licenseIsValidForPkpass(
        licenses[0],
      )
    }

    return {
      payload,
      status: GenericUserLicenseStatus.HasLicense,
      pkpassStatus,
    }
  }

  async getLicenseDetail(
    user: User,
    locale: Locale,
    labels: GenericLicenseLabels,
  ): Promise<GenericLicenseUserdataExternal | null> {
    return this.getLicense(user, locale, labels)
  }

  async verifyPkPass(data: string): Promise<PkPassVerification | null> {
    const result = await this.pkpassClient.verifyPkpassByPdf417(data)

    if (!result) {
      this.logger.warn('Missing pkpass verify from client', {
        category: LOG_CATEGORY,
      })
      return null
    }

    let error: PkPassVerificationError | undefined

    if (result.error) {
      let data = ''

      try {
        data = JSON.stringify(result.error.serviceError?.data)
      } catch {
        // noop
      }

      // Is there a status code from the service?
      const serviceErrorStatus = result.error.serviceError?.status

      // Use status code, or http status code from serivce, or "0" for unknown
      const status = serviceErrorStatus ?? (result.error.statusCode || 0)

      error = {
        status: status.toString(),
        message: result.error.serviceError?.message || 'Unknown error',
        data,
      }

      return {
        valid: false,
        data: undefined,
        error,
      }
    }

    let response:
      | Record<string, string | null | OldGenericDrivingLicenseResponse['mynd']>
      | undefined = undefined

    if (result.nationalId) {
      const nationalId = result.nationalId.replace('-', '')
      const licenses = await this.requestFromXroadApi(nationalId)

      if (!licenses) {
        error = {
          status: '0',
          message: 'missing licenses',
        }
      }

      const licenseNationalId = licenses?.[0]?.kennitala ?? null
      const name = licenses?.[0]?.nafn ?? null
      const photo = licenses?.[0]?.mynd ?? null

      const rawData = licenses?.[0] ? JSON.stringify(licenses?.[0]) : undefined

      response = {
        nationalId: licenseNationalId,
        name,
        photo,
        rawData,
      }
    }

    return {
      valid: result.valid,
      data: response ? JSON.stringify(response) : undefined,
      error,
    }
  }
}
