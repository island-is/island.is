import { Injectable, Inject } from '@nestjs/common'
import { Response } from 'node-fetch'
import { uuid } from 'uuidv4'

import { User } from '@island.is/auth-nest-tools'
import { MMSApi } from '@island.is/clients/mms'

import { Config } from './education.module'
import { License } from './education.type'
import { S3Service } from './s3.service'

@Injectable()
export class EducationService {
  constructor(
    private readonly mmsApi: MMSApi,
    private readonly s3Service: S3Service,
    @Inject('CONFIG')
    private readonly config: Config,
  ) {}

  async getLicenses(nationalId: User['nationalId']): Promise<License[]> {
    const licenses = await this.mmsApi.getLicenses(nationalId)

    return licenses.map((license) => ({
      id: license.id,
      school: license.school,
      programme: license.type,
      date: license.issued,
    }))
  }

  async getStudentAssessmentGrades(
    nationalId: User['nationalId'],
  ): Promise<any[]> {
    const studentAssessmentGrades = await this.mmsApi.getStudentAssessmentGrades(
      nationalId,
    )

    return studentAssessmentGrades.map((grade) => ({
      id: grade.id,
    }))
  }

  async downloadPdfLicense(
    nationalId: string,
    licenseId: string,
  ): Promise<string | null> {
    const responseStream = await this.mmsApi.downloadLicensePDF(
      nationalId,
      licenseId,
    )

    return this.s3Service.uploadFileFromStream(responseStream, {
      fileName: uuid(),
      bucket: this.config.fileDownloadBucket,
    })
  }
}
