import { Injectable, Inject } from '@nestjs/common'
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

  public isChild(familyMember: ISLFjolskyldan): boolean {
    return (
      !['1', '2', '7'].includes(familyMember.Kyn) &&
      kennitala.info(familyMember.Kennitala).age < ADULT_AGE_LIMIT
    )
  }

  async getFamily(nationalId: string): Promise<ISLFjolskyldan[]> {
    const family = await this.nationalRegistryApi.getMyFamily(nationalId)
    const myself = family.find(({ Kennitala }) => Kennitala === nationalId)

    if (!myself) {
      return []
    }

    // Note: we are explicitly sorting by name & national id, since we will
    // use the index within the family to link to and select the correct
    // family memember, so that indexes are consistant no matter how they
    // are displayed or fetched.
    // They also don't need to be absolute indexes, only indexes that are
    // unique from the point of view of each viewer.

    return family
      .filter(
        (familyMember) =>
          familyMember === myself ||
          (this.isChild(familyMember) && !this.isChild(myself)),
      )
      .sort((a, b) => {
        const nameDiff = a.Nafn.localeCompare(b.Nafn)

        if (nameDiff === 0) {
          return a.Kennitala.localeCompare(b.Kennitala)
        }

        return nameDiff
      })
  }

  async getExamFamilyOverviews(
    nationalId: string,
  ): Promise<ExamFamilyOverview[]> {
    const family = await this.getFamily(nationalId)

    const examFamilyOverviews = await Promise.all(
      family.map(async (familyMember, index) => {
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
          familyIndex: index,
        }
      }),
    )
    return examFamilyOverviews.filter(Boolean) as ExamFamilyOverview[]
  }

  private mapGrade(grade?: GradeResult) {
    if (!grade) {
      return undefined
    }
    return {
      grade: grade.einkunn,
      label: grade.heiti,
      weight: grade.vaegi,
    }
  }

  private mapGradeType(grade?: GradeTypeResult) {
    if (!grade) {
      return undefined
    }
    return {
      label: grade.heiti,
      serialGrade: this.mapGrade(grade.radeinkunn),
      elementaryGrade: this.mapGrade(grade.grunnskolaeinkunn),
    }
  }

  private mapCourseGrade(grade: Grade): any {
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
