import { Injectable } from '@nestjs/common'
import { Response } from 'node-fetch'

import { User } from '@island.is/auth-nest-tools'

import { License } from './education.type'
import { MMSApi } from './client'

@Injectable()
export class EducationService {
  constructor(private readonly mmsApi: MMSApi) {}

  async getLicenses(nationalId: User['nationalId']): Promise<License[]> {
    const licenses = await this.mmsApi.getLicenses(nationalId)

    return licenses.map((license) => ({
      id: license.id,
      school: license.school,
      programme: license.type,
      date: license.issued,
    }))
  }

  async downloadPdfLicense(
    nationalId: string,
    licenseId: string,
  ): Promise<Response> {
    return this.mmsApi.downloadLicensePDF(nationalId, licenseId)
  }
}
