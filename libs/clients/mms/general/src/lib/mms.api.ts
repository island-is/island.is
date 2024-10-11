import fetch, { Response } from 'node-fetch'

import type { User } from '@island.is/auth-nest-tools'

import { LicenseResponse, StudentAssessmentResponse } from './mms.type'

export interface XRoadConfig {
  baseUrl: string
  clientId: string
  services: {
    license: string
    grade: string
  }
}

export class MMSApi {
  private readonly xroadApiUrl: string
  private readonly xroadClientId: string
  private readonly xroadServices: XRoadConfig['services']

  constructor(xroadConfig: XRoadConfig) {
    this.xroadApiUrl = `${xroadConfig.baseUrl}/r1`
    this.xroadClientId = xroadConfig.clientId
    this.xroadServices = xroadConfig.services
  }

  private getXroadService(service: keyof XRoadConfig['services']): string {
    return this.xroadServices[service]
  }

  async requestApi(
    url: string,
    service: keyof XRoadConfig['services'],
  ): Promise<Response> {
    return fetch(
      `${this.xroadApiUrl}/${this.getXroadService(service)}/${url}`,
      {
        headers: {
          'X-Road-Client': this.xroadClientId,
          Accept: 'application/json',
        },
      },
    )
  }

  async getLicenses(
    nationalId: User['nationalId'],
  ): Promise<LicenseResponse[]> {
    const response = await this.requestApi(
      `api/public/users/${nationalId}/licenses`,
      'license',
    )
    return response.json()
  }

  downloadLicensePDF(nationalId: string, licenseId: string): Promise<Response> {
    return this.requestApi(
      `api/public/users/${nationalId}/licenses/${licenseId}/pdf`,
      'license',
    )
  }

  async getStudentAssessment(
    nationalId: User['nationalId'],
  ): Promise<StudentAssessmentResponse> {
    const response = await this.requestApi(
      `api/v2/public/studentAssessments/${nationalId}`,
      'grade',
    )
    return response.json()
  }
}
