import { Inject, Injectable } from '@nestjs/common'
import { GenericLicenseClient, VerifyLicenseResult } from '../../license.types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  Pass,
  RevokePassData,
  Result,
  SmartSolutionsApi,
} from '@island.is/clients/smartsolutions'
import {
  DrivingLicenseResponse,
  LOG_CATEGORY,
} from './drivingLicenseApiClient.type'
import { ConfigType } from '@nestjs/config'
import { XRoadConfig } from '@island.is/nest/config'
import { DrivingLicenseApiClientConfig } from './drivingLicenseApiClient.config'
import { VerifyInputData } from '../../dto/verifyLicense.input'

@Injectable()
export class DrivingLicenseApiClientService implements GenericLicenseClient {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(XRoadConfig.KEY)
    private xroadConfig: ConfigType<typeof XRoadConfig>,
    @Inject(DrivingLicenseApiClientConfig.KEY)
    private config: ConfigType<typeof DrivingLicenseApiClientConfig>,
    private smartApi: SmartSolutionsApi,
  ) {}

  private headers() {
    return {
      'X-Road-Client': this.xroadConfig.xRoadClient,
      SECRET: this.config.xroad.secret,
      Accept: 'application/json',
    }
  }
  async pullUpdate(): Promise<Result<Pass | undefined>> {
    throw new Error('Not yet implemented')
  }
  async pushUpdate(): Promise<Result<Pass | undefined>> {
    throw new Error('Not yet implemented')
  }
  revoke(): Promise<Result<RevokePassData>> {
    throw new Error('Not yet implemented')
  }

  /** We need to verify the pk pass AND the license itself! */
  async verify(inputData: string): Promise<Result<VerifyLicenseResult>> {
    //need to parse the scanner data
    let parsedInput
    try {
      parsedInput = JSON.parse(inputData) as VerifyInputData
    } catch (ex) {
      return {
        ok: false,
        error: {
          code: 12,
          message: 'Invalid input data',
        },
      }
    }

    const { code, date } = parsedInput

    if (!code || !date) {
      return {
        ok: false,
        error: {
          code: 4,
          message:
            'Invalid input data,  either code or date are missing or invalid',
        },
      }
    }

    const verifyRes = await this.smartApi.verifyPkPass({ code, date })

    if (!verifyRes.ok) {
      return verifyRes
    }

    if (!verifyRes.data.valid) {
      return {
        ok: true,
        data: {
          valid: false,
        },
      }
    }

    const passNationalId = verifyRes.data.pass?.inputFieldValues.find(
      (i) => i.passInputField.identifier === 'kennitala',
    )?.value

    if (!passNationalId) {
      return {
        ok: false,
        error: {
          code: 14,
          message: 'Missing pass data',
        },
      }
    }
    const nationalId = passNationalId.replace('-', '')
    const licenses = await this.requestFromXroadApi(nationalId)

    if (!licenses) {
      return {
        ok: false,
        error: {
          code: 14,
          message: 'Missing licenses',
        },
      }
    }

    const licenseNationalId = licenses?.[0]?.kennitala ?? null
    const name = licenses?.[0]?.nafn ?? null
    const picture = licenses?.[0]?.mynd?.mynd

    if (
      !licenseNationalId ||
      !name
      //TODO: re-enable when testing is over!
      //|| !picture
    ) {
      return {
        ok: false,
        error: {
          code: 14,
          //TODO: use when testing is over!
          //message: 'Missing data. NationalId, name or photo missing',
          message: 'Missing data. NationalId or name missing.',
        },
      }
    }

    return {
      ok: true,
      data: {
        valid: true,
        passIdentity: {
          nationalId: licenseNationalId,
          name,
          picture,
        },
      },
    }
  }

  private async requestApi(url: string): Promise<unknown | null> {
    let res: Response | null = null

    try {
      res = await fetch(`${this.xroadConfig.xRoadBasePath}/${url}`, {
        headers: this.headers(),
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
  ): Promise<DrivingLicenseResponse[] | null> {
    const response = await this.requestApi(
      `${this.config.xroad.path}/api/Okuskirteini/${nationalId}`,
    )

    if (!response) {
      this.logger.warn('Falsy result from drivers license response', {
        category: LOG_CATEGORY,
      })
      return null
    }

    if (!Array.isArray(response)) {
      this.logger.warn('Expected drivers license response to be an array', {
        category: LOG_CATEGORY,
      })
      return null
    }

    const licenses = response as DrivingLicenseResponse[]

    // If we get more than one license, sort in descending order so we can pick the first one as the
    // newest license later on
    // TODO(osk): This is a bug, fixed in v2 of the service (see https://www.notion.so/R-kisl-greglustj-ri-60f22ab2789e4e0296f5fe6e25fa19cf)
    licenses.sort((a?: DrivingLicenseResponse, b?: DrivingLicenseResponse) => {
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
    })

    return licenses
  }
}
