import { Injectable, Inject } from '@nestjs/common'
import { Response } from 'node-fetch'
import { uuid } from 'uuidv4'
import * as kennitala from 'kennitala'
import flatten from 'lodash/flatten'

import type { User } from '@island.is/auth-nest-tools'
import {
  MMSApi,
  Grade,
  GradeTypeResult,
  GradeResult,
} from '@island.is/clients/mms'
import {
  NationalRegistryApi,
  ISLFjolskyldan,
} from '@island.is/clients/national-registry-v1'

import type { Config } from './education.module'
import {
  EducationLicense,
  ExamFamilyOverview,
  ExamResult,
} from './education.type'
import { S3Service } from './s3.service'
import { getYearInterval } from './education.utils'

const ADULT_AGE_LIMIT = 18

@Injectable()
export class EducationService {
  constructor(
    private readonly mmsApi: MMSApi,
    private readonly s3Service: S3Service,
    @Inject('CONFIG')
    private readonly config: Config,
    private readonly nationalRegistryApi: NationalRegistryApi,
  ) {}

  async getLicenses(
    nationalId: User['nationalId'],
  ): Promise<EducationLicense[]> {
    const licenses = await this.mmsApi.getLicenses(nationalId)

    return licenses.map((license) => ({
      id: license.id,
      school: license.issuer,
      programme: license.type,
      date: license.issued,
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

  async getFamily(nationalId: string) {
    const family = await this.nationalRegistryApi.getMyFamily(nationalId)
    return family.filter(
      (familyMember) =>
        nationalId === familyMember.Kennitala ||
        (!['1', '2', '7'].includes(familyMember.Kyn) &&
          kennitala.info(familyMember.Kennitala).age < ADULT_AGE_LIMIT),
    )
  }

  async getExamFamilyOverviews(
    nationalId: string,
  ): Promise<ExamFamilyOverview[]> {
    const family = await this.getFamily(nationalId)
    const examFamilyOverviews = await Promise.all(
      family.map(async (familyMember) => {
        const studentAssessment = await this.mmsApi.getStudentAssessment(
          familyMember.Kennitala,
        )
        if (
          studentAssessment.einkunnir &&
          studentAssessment.einkunnir.length <= 0
        ) {
          return undefined
        }

        const examDates = flatten(
          studentAssessment.einkunnir.map((einkunn) =>
            einkunn.namsgreinar.map((namsgrein) => namsgrein.dagsetning),
          ),
        ).filter(Boolean) as string[]

        return {
          nationalId: familyMember.Kennitala,
          name: familyMember.Nafn,
          isChild: nationalId !== familyMember.Kennitala,
          organizationType: 'Menntamálastofnun',
          organizationName: 'Samræmd Könnunarpróf',
          yearInterval: getYearInterval(examDates),
        }
      }),
    )
    return examFamilyOverviews.filter(Boolean) as ExamFamilyOverview[]
  }

  private mapGrade(grade: GradeResult) {
    if (!grade) {
      return undefined
    }
    return {
      grade: grade.einkunn,
      label: grade.heiti,
      weight: grade.vaegi,
    }
  }

  private mapGradeType(grade: GradeTypeResult) {
    if (!grade) {
      return undefined
    }
    return {
      label: grade.heiti,
      serialGrade: this.mapGrade(grade.radeinkunn),
      elementaryGrade: this.mapGrade(grade.grunnskolaeinkunn),
    }
  }

  private mapCourseGrade(grade: Grade) {
    if (!grade) {
      return undefined
    }
    return {
      label: grade.heiti,
      competence: grade.haefnieinkunn,
      competenceStatus: grade.haefnieinkunnStada,
      gradeSum: this.mapGradeType(grade.samtals),
      progressText: this.mapGrade(grade.framfaraTexti),
      grades: grade.einkunnir.map((gradeType) => this.mapGradeType(gradeType)),
      wordAndNumbers: this.mapGrade(grade.ordOgTalnadaemi),
    }
  }

  async getExamResult(familyMember: ISLFjolskyldan): Promise<ExamResult> {
    const studentAssessment = await this.mmsApi.getStudentAssessment(
      familyMember.Kennitala,
    )
    return {
      id: `EducationExamResult${familyMember.Kennitala}`,
      fullName: familyMember.Nafn,
      grades: studentAssessment.einkunnir.map((einkunn) => ({
        studentYear: einkunn.bekkur,
        courses: einkunn.namsgreinar.map((namsgrein) =>
          this.mapCourseGrade(namsgrein),
        ),
      })),
    }
  }
}
