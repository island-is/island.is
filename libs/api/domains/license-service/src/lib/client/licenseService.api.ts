import fetch, { Response } from 'node-fetch'

import { Injectable, Inject } from '@nestjs/common'

import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
import { User } from '@island.is/auth-nest-tools'

import { GenericDrivingLicenseResponse } from './genericDrivingLicense.type'
import { GenericLicenseFields } from '../licenceService.type'

@Injectable()
export class LicenseServiceApi {
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string
  private readonly secret: string

  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    xroadBaseUrl: string,
    xroadClientId: string,
    secret: string,
  ) {
    this.xroadApiUrl = xroadBaseUrl
    this.xroadClientId = xroadClientId
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
      // TODO correct way to log this?
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
      // TODO correct way to log this?
      this.logger.error('Unable to parse JSON for drivers licence', {
        exception: e,
        url,
      })
      return null
    }

    return json
  }

  /**
   * Fetch drivers license data from RLS through x-road.
   *
   * @param nationalId NationalId to fetch drivers licence for.
   * @return {Promise<GenericDrivingLicenseResponse[] | null>} Array of driving license or null if an error occured.
   */
  async getGenericDrivingLicense(
    nationalId: User['nationalId'],
  ): Promise<GenericDrivingLicenseResponse[] | null> {
    const xroadDrivingLicensePath =
      'r1/IS-DEV/GOV/10005/Logreglan-Protected/RafraentOkuskirteini-v1'

    const response = this.requestApi(
      `${xroadDrivingLicensePath}/api/Okuskirteini/${nationalId}`,
    )

    // TODO should this throw or return null? What's the general pattern
    if (!response) {
      return null
    }

    if (!Array.isArray(response)) {
      this.logger.warn('Expected drivers license response to be an array')
      return null
    }

    // TODO map and validate every field?
    return response as GenericDrivingLicenseResponse[]
  }
}
