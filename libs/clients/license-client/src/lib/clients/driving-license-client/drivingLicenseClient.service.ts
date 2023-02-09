import compareAsc from 'date-fns/compareAsc'
import fetch, { Response } from 'node-fetch'

import * as kennitala from 'kennitala'
import format from 'date-fns/format'
import { Cache as CacheManager } from 'cache-manager'
import { Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { logger } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'

import { DrivingLicenseDto } from './drivingLicenseClient.type'
import { ConfigType, XRoadConfig } from '@island.is/nest/config'
import {
  LicenseClient,
  LicensePkPassAvailability,
  PkPassVerification,
  PkPassVerificationError,
  Result,
} from '../../licenseClient.type'
import { PkPassClient } from './pkPassClient/pkpass.client'
import { PkPassPayload } from './pkPassClient/pkpass.type'
import { DrivingLicenseClientApiConfig } from './drivingLicenseClient.config'

/** Category to attach each log message to */
const LOG_CATEGORY = 'drivinglicense-service'

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
export class DrivingLicenseClient implements LicenseClient<DrivingLicenseDto> {
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string
  private readonly xroadPath: string
  private readonly xroadSecret: string

  private pkpassClient: PkPassClient

  constructor(
    private logger: Logger,
    private xroadConfig: ConfigType<typeof XRoadConfig>,
    private config: ConfigType<typeof DrivingLicenseClientApiConfig>,
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
    this.pkpassClient = new PkPassClient(config, logger, cacheManager)
  }

  private headers() {
    return {
      'X-Road-Client': this.xroadClientId,
      SECRET: this.xroadSecret,
      Accept: 'application/json',
    }
  }

  private async requestApi(url: string): Promise<Result<DrivingLicenseDto[]>> {
    let res: Response | null = null

    try {
      res = await fetch(`${this.xroadApiUrl}/${url}`, {
        headers: this.headers(),
      })

      if (!res.ok) {
        if (res.status !== 400 && res.status !== 404) {
          throw new Error(
            `Expected 200 status for Drivers license query, got ${res.status}`,
          )
        }
        return {
          ok: false,
          error: {
            code: 13,
            message: 'Service error',
          },
        }
      }
    } catch (e) {
      this.logger.error('Unable to query for drivers licence', {
        exception: e,
        url,
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error: {
          code: 13,
          message: 'Service error',
        },
      }
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
      return {
        ok: false,
        error: {
          code: 12,
          message: 'JSON parse failure',
        },
      }
    }
    return {
      ok: true,
      data: json as DrivingLicenseDto[],
    }
  }

  private async requestFromXroadApi(
    nationalId: string,
  ): Promise<Result<DrivingLicenseDto>> {
    const response = await this.requestApi(
      `${this.xroadPath}/api/Okuskirteini/${nationalId}`,
    )

    if (!response.ok) {
      logger.warn('Falsy result from drivers license response', {
        category: LOG_CATEGORY,
      })
      return response
    }

    //return the first one
    return {
      ok: true,
      data: response.data[0],
    }
  }

  private drivingLicenseToPkpassPayload(
    license: DrivingLicenseDto,
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

  private checkLicenseValidity(
    license: DrivingLicenseDto,
  ): LicensePkPassAvailability {
    if (!license || license.mynd === undefined) {
      return LicensePkPassAvailability.Unknown
    }

    if (!license.mynd?.skrad || !license.mynd?.mynd) {
      return LicensePkPassAvailability.NotAvailable
    }

    const cutoffDate = new Date(IMAGE_CUTOFF_DATE)
    const imageDate = new Date(license.mynd?.skrad)

    const comparison = compareAsc(imageDate, cutoffDate)

    if (isNaN(comparison) || comparison < 0) {
      return LicensePkPassAvailability.NotAvailable
    }

    return LicensePkPassAvailability.Available
  }

  /**
   * Notify RLS about the creation of a pkpass.
   * @param nationalId National id of the user that created the pkpass.
   */
  private async notifyPkPassCreated(nationalId: string) {
    try {
      await fetch(`${this.xroadApiUrl}/api/Okuskirteini/${nationalId}`, {
        method: 'POST',
        headers: this.headers(),
      })
    } catch (e) {
      this.logger.info('Unable to notify RLS of pkpass creation', {
        exception: e,
        exceptionMessage: e.message,
        category: LOG_CATEGORY,
      })
      return null
    }
  }

  licenseIsValidForPkPass(payload: unknown): LicensePkPassAvailability {
    return this.checkLicenseValidity(payload as DrivingLicenseDto)
  }

  /**
   * Fetch drivers license data from RLS through x-road.
   *
   * @param nationalId NationalId to fetch drivers licence for.
   * @return {Promise<Result<DrivingLicenseDto | null>> } Response result containing the latest driving license or an error
   */
  async getLicense(user: User): Promise<Result<DrivingLicenseDto | null>> {
    const license = await this.requestFromXroadApi(user.nationalId)

    if (!license.ok) {
      return license
    }

    return {
      ok: true,
      data: license.data[0],
    }
  }

  async getLicenseDetail(
    user: User,
  ): Promise<Result<DrivingLicenseDto | null>> {
    return await this.getLicense(user)
  }

  async getPkPassUrl(user: User): Promise<Result<string>> {
    return await this.getPkPassUrlByNationalId(user.nationalId)
  }

  async getPkPassQRCode(user: User): Promise<Result<string>> {
    return await this.getPkPassQRCodeByNationalId(user.nationalId)
  }

  private async getPkPassUrlByNationalId(
    nationalId: string,
  ): Promise<Result<string>> {
    const license = await this.requestFromXroadApi(nationalId)

    if (!license.ok) {
      return license
    }

    if (!this.checkLicenseValidity(license.data)) {
      this.logger.info('License is not valid for pkpass generation', {
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error: {
          code: 5,
          message: 'Invalid pass for pkpass generation',
        },
      }
    }

    const payload = this.drivingLicenseToPkpassPayload(license.data)

    const pkPassUrl = await this.pkpassClient.getPkPassUrl(payload)

    if (!pkPassUrl) {
      return {
        ok: false,
        error: {
          code: 6,
          message: 'PkPass generation failed',
        },
      }
    }

    this.notifyPkPassCreated(nationalId)
    return {
      ok: true,
      data: pkPassUrl,
    }
  }

  private async getPkPassQRCodeByNationalId(
    nationalId: string,
  ): Promise<Result<string>> {
    const license = await this.requestFromXroadApi(nationalId)

    if (!license.ok) {
      return license
    }

    if (!this.checkLicenseValidity(license.data)) {
      this.logger.info('License is not valid for pkpass generation', {
        category: LOG_CATEGORY,
      })
      return {
        ok: false,
        error: {
          code: 5,
          message: 'Invalid pass for pkpass generation',
        },
      }
    }

    const payload = this.drivingLicenseToPkpassPayload(license.data)

    const pkPassUrl = await this.pkpassClient.getPkPassQRCode(payload)

    if (!pkPassUrl) {
      return {
        ok: false,
        error: {
          code: 6,
          message: 'PkPass generation failed',
        },
      }
    }

    this.notifyPkPassCreated(nationalId)
    return {
      ok: true,
      data: pkPassUrl,
    }
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
      | Record<string, string | null | DrivingLicenseDto['mynd']>
      | undefined = undefined

    if (result.nationalId) {
      const nationalId = result.nationalId.replace('-', '')
      const license = await this.requestFromXroadApi(nationalId)

      if (!license.ok) {
        error = {
          status: '0',
          message: 'missing licenses',
        }

        return {
          valid: false,
          data: undefined,
          error,
        }
      }

      const licenseNationalId = license.data.kennitala ?? null
      const name = license.data.nafn ?? null
      const photo = license.data.mynd ?? null

      const rawData = license ? JSON.stringify(license) : undefined

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
