import fetch, { Response } from 'node-fetch'
import FormData from 'form-data'
import * as kennitala from 'kennitala'
import format from 'date-fns/format'
import { Cache as CacheManager } from 'cache-manager'
import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'

import {
  GenericDrivingLicenseResponse,
  PkPassServiceDriversLicenseResponse,
  PkPassServiceErrorResponse,
  PkPassServiceTokenResponse,
  PkPassServiceVerifyDriversLicenseResponse,
  PkPassVerifyResult,
} from './genericDrivingLicense.type'
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

  private readonly pkpassApiKey: string
  private readonly pkpassSecretKey: string
  private readonly pkpassApiUrl: string

  constructor(
    @Inject(CONFIG_PROVIDER) private config: Config,
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(CACHE_MANAGER) private cacheManager: CacheManager | null,
  ) {
    this.xroadApiUrl = config.xroad.baseUrl
    this.xroadClientId = config.xroad.clientId
    this.xroadPath = config.xroad.path
    this.xroadSecret = config.xroad.secret

    this.pkpassApiKey = config.pkpass.apiKey
    this.pkpassSecretKey = config.pkpass.secretKey
    this.pkpassApiUrl = config.pkpass.apiUrl

    this.logger = logger
    this.cacheManager = cacheManager
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
      logger.warn('Falsy result from drivers license response', {})
      return null
    }

    if (!Array.isArray(response)) {
      logger.warn('Expected drivers license response to be an array')
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

  private async getPkPassToken(): Promise<string | null> {
    let res: Response | null = null

    try {
      res = await fetch(`${this.pkpassApiUrl}/getDriversLicenseAccessToken`, {
        headers: {
          apiKey: this.pkpassApiKey,
          secretKey: this.pkpassSecretKey,
        },
      })

      if (!res.ok) {
        throw new Error(
          `Expected 200 status for pkpass token service, got ${res.status}`,
        )
      }
    } catch (e) {
      this.logger.warn('Unable to get pkpass access token', {
        exception: e,
      })
      return null
    }

    let json: unknown
    try {
      json = await res.json()
    } catch (e) {
      this.logger.warn('Unable to parse JSON for pkpass token service', {
        exception: e,
      })
      return null
    }

    const response = json as PkPassServiceTokenResponse

    if (response.status === 1 && response.data?.ACCESS_TOKEN) {
      return response.data?.ACCESS_TOKEN
    }

    this.logger.warn('pkpass service response does not include access token', {
      serviceStatus: response.status,
      serviceMessage: response.message,
    })

    return null
  }

  private drivingLicenseToPkpassPayload(
    license: GenericDrivingLicenseResponse,
  ) {
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

  async getPkPassUrl(nationalId: User['nationalId']): Promise<string | null> {
    return this.getPkPassUrlByNationalId(nationalId)
  }

  async getPkPassUrlByNationalId(nationalId: string): Promise<string | null> {
    const accessToken = await this.getPkPassToken()

    if (!accessToken) {
      return null
    }

    const licenses = await this.requestFromXroadApi(nationalId)

    if (!licenses) {
      return null
    }

    const license = licenses[0]

    if (!license) {
      this.logger.warn(
        'Missing license, unable to generate pkpass for drivers license',
      )
      return null
    }

    let res: Response | null = null

    const payload = this.drivingLicenseToPkpassPayload(license)

    try {
      res = await fetch(`${this.pkpassApiUrl}/v2/driversLicense`, {
        method: 'POST',
        headers: {
          apiKey: this.pkpassApiKey,
          accessToken: `smart ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
    } catch (e) {
      this.logger.warn('Unable to get pkpass drivers license ', {
        exception: e,
      })
      return null
    }

    if (!res.ok) {
      const responseErrors: PkPassServiceErrorResponse = {}
      try {
        const json = await res.json()
        responseErrors.message = json?.message ?? undefined
        responseErrors.status = json?.status ?? undefined
        responseErrors.data = json?.data ?? undefined
      } catch {
        // noop
      }

      this.logger.warn(
        'Expected 200 status for pkpass drivers license service',
        {
          status: res.status,
          statusText: res.statusText,
          ...responseErrors,
        },
      )
      return null
    }

    let json: unknown
    try {
      json = await res.json()
    } catch (e) {
      this.logger.warn('Unable to parse JSON for pkpass service', {
        exception: e,
      })
      return null
    }

    const response = json as PkPassServiceDriversLicenseResponse

    if (response.status === 1 && response.data?.pass_url) {
      return response.data.pass_url
    }

    this.logger.warn('pkpass service response does not include pass_url', {
      serviceStatus: response.status,
      serviceMessage: response.message,
    })

    return null
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

  async verifyPkpassByPdf417(
    pdf417Text: string,
  ): Promise<PkPassVerifyResult | null> {
    const accessToken = await this.getPkPassToken()

    if (!accessToken) {
      return null
    }

    let res: Response | null = null

    try {
      const formData = new FormData()
      formData.append('pdf417Text', pdf417Text)

      const authHeaders = {
        apiKey: this.pkpassApiKey,
        accessToken: `smart ${accessToken}`,
      }

      res = await fetch(`${this.pkpassApiUrl}/verifyDriversLicense`, {
        method: 'POST',
        headers: { ...authHeaders, ...formData.getHeaders() },
        body: formData.getBuffer().toString(),
      })
    } catch (e) {
      this.logger.warn('Unable to verify pkpass drivers license', {
        exception: e,
      })
      return null
    }

    if (!res.ok) {
      const responseErrors: PkPassServiceErrorResponse = {}
      try {
        // Service returns 400 for invalid data with details in the body
        const json = await res.json()
        responseErrors.message = json?.message ?? undefined
        responseErrors.status = json?.status ?? undefined
        responseErrors.data = json?.data ?? undefined
      } catch {
        // noop
      }

      // If we don't have a status in the body and a non-200 response, log it
      if (!responseErrors.status) {
        let message =
          'Expected 200 status or 400 status with info in message for pkpass verify drivers license service'

        if (res.status === 400) {
          message =
            'Expected 400 status with info in message for pkpass verify drivers license service'
        }

        this.logger.warn(message, {
          status: res.status,
          statusText: res.statusText,
          ...responseErrors,
        })
      }

      return {
        valid: false,
        error: {
          statusCode: res.status,
          serviceError: responseErrors,
        },
      }
    }

    let json: unknown
    try {
      json = await res.json()
    } catch (e) {
      this.logger.warn('Unable to parse JSON for verify pkpass service', {
        exception: e,
      })
      return null
    }

    const response = json as PkPassServiceVerifyDriversLicenseResponse

    if (response.status !== 1) {
      this.logger.warn('verify pkpass service response status is not "1"', {
        serviceStatus: response.status,
        serviceMessage: response.message,
      })
      return null
    }

    if (!response.data?.kennitala) {
      this.logger.warn(
        'verify pkpass service response does not include "kennitala" but returned status "1"',
        {
          serviceStatus: response.status,
          serviceMessage: response.message,
        },
      )

      return {
        valid: true,
      }
    }

    return {
      valid: true,
      nationalId: response.data.kennitala,
    }
  }

  async verifyPkPass(data: string): Promise<PkPassVerification | null> {
    const result = await this.verifyPkpassByPdf417(data)

    if (!result) {
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
    }

    let response:
      | Record<string, string | null | GenericDrivingLicenseResponse['mynd']>
      | undefined = undefined

    if (result.nationalId) {
      const nationalId = result.nationalId.replace('-', '')
      const licenses = await this.requestFromXroadApi(nationalId)

      const name = licenses?.[0]?.nafn ?? null
      const photo = licenses?.[0]?.mynd ?? null

      response = {
        nationalId: result.nationalId,
        name,
        photo,
        rawData: JSON.stringify(licenses?.[0]),
      }
    }

    return {
      valid: result.valid,
      data: response ? JSON.stringify(response) : undefined,
      error,
    }
  }
}
