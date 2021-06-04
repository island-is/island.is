import { Injectable, Inject } from '@nestjs/common'
import { Response } from 'node-fetch'
import { uuid } from 'uuidv4'
import * as kennitala from 'kennitala'
import flatten from 'lodash/flatten'

import type { User } from '@island.is/auth-nest-tools'
import {
  MMSApi,
  LanguageGrade,
  MathGrade,
  BaseGrade,
  GradeResult,
} from '@island.is/clients/mms'
import {
  NationalRegistryApi,
  ISLFjolskyldan,
} from '@island.is/clients/national-registry-v1'

import type { Config } from './education.module'
import { License, ExamFamilyOverview, ExamResult } from './education.type'
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

  async getLicenses(nationalId: User['nationalId']): Promise<License[]> {
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
          studentAssessment.einkunnir.map((einkunn) => [
            einkunn.islenska?.dagsetning,
            einkunn.enska?.dagsetning,
            einkunn.staerdfraedi?.dagsetning,
          ]),
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
    return {
      grade: grade.radeinkunn,
      weight: grade.vaegi,
    }
  }

  private mapBaseGrade(grade: BaseGrade) {
    return {
      grade: grade.samtals.radeinkunn,
      competence: grade.haefnieinkunn,
      competenceStatus: grade.haefnieinkunnStada,
      progressText: grade.framfaraTexti,
    }
  }

  private mapLanguageGrade(grade: LanguageGrade) {
    return {
      ...this.mapBaseGrade(grade),
      reading: this.mapGrade(grade.lesskilningur),
      grammar: this.mapGrade(grade.malnotkun),
    }
  }

  private mapMathGrade(grade: MathGrade) {
    return {
      ...this.mapBaseGrade(grade),
      wordAndNumbers: grade.ordOgTalnadaemi,
      calculation: this.mapGrade(grade.reikningurOgAdgerdir),
      geometry: this.mapGrade(grade.rumfraedi),
      ratiosAndPercentages: this.mapGrade(grade.hlutfollOgProsentur),
      algebra: this.mapGrade(grade.algebra),
      numberComprehension: this.mapGrade(grade.tolurOgTalnaskilningur),
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
        icelandicGrade:
          einkunn.islenska && this.mapLanguageGrade(einkunn.islenska),
        englishGrade: einkunn.enska && this.mapLanguageGrade(einkunn.enska),
        mathGrade:
          einkunn.staerdfraedi && this.mapMathGrade(einkunn.staerdfraedi),
      })),
    }
  }
}
