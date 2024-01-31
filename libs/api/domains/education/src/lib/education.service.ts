import { Injectable, Inject } from '@nestjs/common'
import { uuid } from 'uuidv4'
import flatten from 'lodash/flatten'

import type { User } from '@island.is/auth-nest-tools'
import {
  MMSApi,
  Grade,
  GradeTypeResult,
  GradeResult,
} from '@island.is/clients/mms'

import type { Config } from './education.module'
import {
  EducationLicense,
  ExamFamilyOverview,
  ExamResult,
  Student,
} from './education.type'
import { S3Service } from './s3.service'
import { getYearInterval } from './education.utils'
import { NationalRegistryV3ClientService } from '@island.is/clients/national-registry-v3'
import { isDefined } from '@island.is/shared/utils'

@Injectable()
export class EducationService {
  constructor(
    private readonly mmsApi: MMSApi,
    private readonly s3Service: S3Service,
    @Inject('CONFIG')
    private readonly config: Config,
    private readonly nationalRegistryApi: NationalRegistryV3ClientService,
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

  async getFamily(nationalId: string): Promise<Array<Student>> {
    const userData = await this.nationalRegistryApi.getAllDataIndividual(
      nationalId,
    )

    // Note: we are explicitly sorting by name & national id, since we wil
    // use the index within the family to link to and select the correct
    // family memember, so that indexes are consistant no matter how they
    // are displayed or fetched.
    // They also don't need to be absolute indexes, only indexes that are
    // unique from the point of view of each viewer.

    if (!userData?.nafn || !userData?.kennitala) {
      return []
    }

    const familyArray: Array<Student> = [
      {
        name: userData?.nafn,
        nationalId: userData?.kennitala,
      },
    ]

    userData?.logforeldrar?.born?.forEach((s) => {
      if (!s.barnKennitala || !s.barnNafn) {
        return
      }
      familyArray.push({ name: s.barnNafn, nationalId: s.barnKennitala })
    })
    const sortedFamily = familyArray?.sort((a, b) => {
      const nameDiff = a.name.localeCompare(b.name ?? '') ?? 0

      return nameDiff === 0
        ? a.nationalId?.localeCompare(b.nationalId ?? '') ?? 0
        : nameDiff
    })

    return sortedFamily
  }

  async getExamFamilyOverviews(
    nationalId: string,
  ): Promise<ExamFamilyOverview[]> {
    const family = (await this.getFamily(nationalId)) ?? []

    const examFamilyOverviews = await Promise.all(
      family
        .map(async (familyMember, index) => {
          const studentAssessment = await this.mmsApi.getStudentAssessment(
            familyMember.nationalId,
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
            nationalId: familyMember.nationalId,
            name: familyMember.name,
            isChild: nationalId !== familyMember.nationalId,
            organizationType: 'Menntamálastofnun',
            organizationName: 'Samræmd könnunarpróf',
            yearInterval: getYearInterval(examDates),
            familyIndex: index,
          }
        })
        .filter(isDefined),
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

  async getExamResult(familyMember: Student): Promise<ExamResult> {
    const studentAssessment = await this.mmsApi.getStudentAssessment(
      familyMember.nationalId,
    )

    return {
      id: `EducationExamResult${familyMember.nationalId}`,
      fullName: familyMember.name,
      grades: studentAssessment.einkunnir.map((einkunn) => ({
        studentYear: einkunn.bekkur,
        courses: einkunn.namsgreinar.map((namsgrein) =>
          this.mapCourseGrade(namsgrein),
        ),
      })),
    }
  }
}
