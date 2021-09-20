import fetch, { Response } from 'node-fetch'

import * as kennitala from 'kennitala'
import format from 'date-fns/format'
import { Cache as CacheManager } from 'cache-manager'
import { Injectable, Inject } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'

import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'
import { parseDrivingLicensePayload } from './drivingLicenseMappers'
import {
  CONFIG_PROVIDER,
  GenericLicenseClient,
  GenericLicenseUserdataExternal,
  GenericUserLicenseStatus,
  PkPassVerification,
  PkPassVerificationError,
} from '../../licenceService.type'
import { Config } from '../../licenseService.module'
import { PkPassClient } from './pkpass.client'
import { PkPassPayload } from './pkpass.type'

/** Category to attach each log message to */
const LOG_CATEGORY = 'drivinglicense-service'

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
export class GenericDrivingLicenseApi
  implements GenericLicenseClient<GenericDrivingLicenseResponse> {
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string
  private readonly xroadPath: string
  private readonly xroadSecret: string

  private pkpassClient: PkPassClient

  constructor(
    @Inject(CONFIG_PROVIDER) private config: Config,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private cacheManager?: CacheManager | null,
  ) {
    // TODO inject the actual RLS x-road client
    this.xroadApiUrl = config.xroad.baseUrl
    this.xroadClientId = config.xroad.clientId
    this.xroadPath = config.xroad.path
    this.xroadSecret = config.xroad.secret

    this.logger = logger
    this.cacheManager = cacheManager

    // TODO this should be injected by nest
    this.pkpassClient = new PkPassClient(config, logger, cacheManager)
  }

  private headers() {
    return {
      'X-Road-Client': this.xroadClientId,
      SECRET: this.xroadSecret,
      Accept: 'application/json',
    }
  }

  private async requestApi(url: string): Promise<unknown | null> {
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
  ): Promise<GenericDrivingLicenseResponse[] | null> {
    const response = await this.requestApi(
      `${this.xroadPath}/api/Okuskirteini/${nationalId}`,
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

    const licenses = response as GenericDrivingLicenseResponse[]

    // If we get more than one license, sort in descending order so we can pick the first one as the
    // newest license later on
    // TODO(osk): This is a bug, fixed in v2 of the service (see https://www.notion.so/R-kisl-greglustj-ri-60f22ab2789e4e0296f5fe6e25fa19cf)
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

    return licenses
  }

  private drivingLicenseToPkpassPayload(
    license: GenericDrivingLicenseResponse,
  ): PkPassPayload {
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

  async getPkPassUrlByNationalId(nationalId: string): Promise<string | null> {
    const licenses = await this.requestFromXroadApi(nationalId)

    if (!licenses) {
      this.logger.warn('Missing licenses, null from x-road', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const license = licenses[0]

    if (!license) {
      this.logger.warn(
        'Missing license, unable to generate pkpass for drivers license',
        { category: LOG_CATEGORY },
      )
      return null
    }

    const payload = this.drivingLicenseToPkpassPayload(license)

    return this.pkpassClient.getPkPassUrl(payload)
  }

  async getPkPassUrl(nationalId: User['nationalId']): Promise<string | null> {
    return this.getPkPassUrlByNationalId(nationalId)
  }

  /**
   * Fetch drivers license data from RLS through x-road.
   *
   * @param nationalId NationalId to fetch drivers licence for.
   * @return {Promise<GenericLicenseUserdataExternal | null>} Latest driving license or null if an error occured.
   */
  async getLicense(
    nationalId: User['nationalId'],
  ): Promise<GenericLicenseUserdataExternal | null> {
    const licenses = await this.requestFromXroadApi(nationalId)

    if (!licenses) {
      this.logger.warn('Missing licenses, null from x-road', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const payload = parseDrivingLicensePayload(licenses)

    return {
      payload,
      status: GenericUserLicenseStatus.HasLicense,
    }
  }

  async getLicenseDetail(
    nationalId: User['nationalId'],
  ): Promise<GenericLicenseUserdataExternal | null> {
    return this.getLicense(nationalId)
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
      | Record<string, string | null | GenericDrivingLicenseResponse['mynd']>
      | undefined = undefined

    if (result.nationalId) {
      const nationalId = result.nationalId.replace('-', '')
      const licenses = await this.requestFromXroadApi(nationalId)

      if (!licenses) {
        this.logger.warn(
          'Missing licenses from x-road, unable to return license info for pkpass verify',
          { category: LOG_CATEGORY },
        )
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
