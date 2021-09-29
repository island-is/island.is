import { Injectable } from '@nestjs/common'
import type { User } from '@island.is/auth-nest-tools'
import {
  DrivingLicense,
  DrivingLicenseType,
  PenaltyPointStatus,
  TeachingRightsStatus,
  StudentInformation,
  Juristiction,
  NewDrivingLicenseInput,
  NewDrivingLicenseResult,
  NewDrivingAssessmentResult,
  DeprevationType,
  RemarkType,
  RequirementKey,
  ApplicationEligibility,
  DrivingLicenseCategory,
  NeedsHealhCertificate,
  QualityPhotoResult,
  StudentAssessment,
  Teacher,
} from './drivingLicense.type'
import {
  AkstursmatDto,
  EmbaettiDto,
  HefurLokidOkugerdiDto,
  OkukennariDto,
  OkuskirteiniApi,
  Rettindi,
  TegSviptingaDto,
  TegundAthugasemdaDto,
  TegundRettindaDto,
} from '@island.is/clients/driving-license'
import {
  BLACKLISTED_JURISTICTION,
  DRIVING_ASSESSMENT_MAX_AGE,
  DRIVING_LICENSE_SUCCESSFUL_RESPONSE_VALUE,
  LICENSE_RESPONSE_API_VERSION,
} from './util/constants'
import sortTeachers from './util/sortTeachers'
import {
  DrivingLicenseApplicationFor,
  DrivingSchool,
  NeedsQualityPhoto,
  B_FULL,
  B_TEMP,
} from '..'

@Injectable()
export class DrivingLicenseService {
  constructor(private readonly drivingLicenseApi: OkuskirteiniApi) {}

  private async getLicense(nationalId: string): Promise<DrivingLicense | null> {
    const drivingLicense = await this.drivingLicenseApi.getCurrentLicense({
      kennitala: nationalId,
      // apiVersion header indicates that this method will return a single license, rather
      // than an array
      apiVersion: LICENSE_RESPONSE_API_VERSION,
    })

    if (!drivingLicense) {
      return null
    }

    // Pretty sure none of these fallbacks can get triggered, since if the service
    // finds a driver's license, it's going to have the values. - this is mostly to
    // appease the type system, since the downstream type is actually wrong.
    return {
      id: drivingLicense.id as number,
      name: drivingLicense.nafn as string,
      issued: drivingLicense.utgafuDagsetning,
      expires: drivingLicense.gildirTil,
      isProvisional: undefined,
      eligibilities: (drivingLicense.rettindi as Rettindi[]).map(
        (eligibility: Rettindi) => ({
          id: eligibility?.nr?.trim() || '',
          issued: eligibility.utgafuDags,
          expires: eligibility.gildirTil,
          comment: eligibility.aths as string,
        }),
      ),
    }
  }

  getDrivingLicense(
    nationalId: User['nationalId'],
  ): Promise<DrivingLicense | null> {
    return this.getLicense(nationalId)
  }

  async getStudentInformation(
    nationalId: string,
  ): Promise<StudentInformation | null> {
    const drivingLicense = await this.drivingLicenseApi.apiOkuskirteiniKennitalaAllGet(
      {
        kennitala: nationalId,
      },
    )

    const licenseWithName = drivingLicense.find(({ nafn }) => !!nafn)

    if (!licenseWithName) {
      return null
    }

    return {
      name: licenseWithName.nafn as string,
    }
  }

  async getTeachers(): Promise<Teacher[]> {
    const teachers = await this.drivingLicenseApi.apiOkuskirteiniOkukennararGet(
      {},
    )

    return teachers
      .sort(sortTeachers)
      .map(({ nafn, kennitala }: OkukennariDto) => ({
        name: nafn,
        nationalId: kennitala,
      }))
  }

  async getDeprivationTypes(): Promise<DeprevationType[]> {
    const types = await this.drivingLicenseApi.apiOkuskirteiniTegundirsviptingaGet(
      {},
    )

    return types.map(
      (type: TegSviptingaDto) =>
        ({
          id: type.id,
          name: type.heiti,
        } as DeprevationType),
    )
  }

  async getDrivingLicenseTypes(): Promise<DrivingLicenseType[]> {
    const types = await this.drivingLicenseApi.apiOkuskirteiniTegundirrettindaGet(
      {},
    )

    return types.map(
      (type: TegundRettindaDto) =>
        ({
          id: type.nr,
          name: type.heiti,
        } as DrivingLicenseType),
    )
  }

  async getRemarkTypes(): Promise<RemarkType[]> {
    const types = await this.drivingLicenseApi.apiOkuskirteiniTegundirathugasemdaGet(
      {},
    )

    return types.map(
      (type: TegundAthugasemdaDto) =>
        ({
          id: parseInt(type?.nr as string, 10),
          remark: type.athugasemd,
          name: type.heiti,
          description: type.lysing,
          // TODO: I have no idea what this even is
          for: type.giltFyrir,
        } as RemarkType),
    )
  }

  async getPenaltyPointStatus(
    nationalId: User['nationalId'],
  ): Promise<PenaltyPointStatus> {
    const status = await this.drivingLicenseApi.apiOkuskirteiniPunktastadaKennitalaGet(
      {
        kennitala: nationalId,
      },
    )

    return {
      nationalId,
      // TODO: fix
      // return type is wrong in open api doc
      isPenaltyPointsOk: status.iLagi as boolean,
    }
  }

  async getTeachingRights(
    nationalId: User['nationalId'],
  ): Promise<TeachingRightsStatus> {
    const statusStr = ((await this.drivingLicenseApi.apiOkuskirteiniHasteachingrightsKennitalaGet(
      {
        kennitala: nationalId,
      },
    )) as unknown) as string
    // API says number, type says number, but deserialization happens with a text
    // deserializer (runtime.TextApiResponse).
    // Seems to be an outstanding bug? or I have no idea what I'm doing
    // See https://github.com/OpenAPITools/openapi-generator/issues/2870
    const status = parseInt(statusStr, 10)
    return {
      nationalId,
      hasTeachingRights: status > 0,
    }
  }

  async getListOfJuristictions(): Promise<Juristiction[]> {
    const embaetti = await this.drivingLicenseApi.apiOkuskirteiniEmbaettiGet({})

    return embaetti
      .map(({ nr, postnumer, nafn }: EmbaettiDto) => ({
        id: nr || 0,
        zip: postnumer || 0,
        name: nafn || '',
      }))
      .filter(({ id }) => id !== BLACKLISTED_JURISTICTION)
  }

  private async getDrivingAssessmentResult(
    nationalId: string,
  ): Promise<AkstursmatDto | null> {
    try {
      return await this.drivingLicenseApi.apiOkuskirteiniSaekjaakstursmatKennitalaGet(
        {
          kennitala: nationalId,
        },
      )
    } catch (e) {
      if (e?.status === 404) {
        return null
      }

      throw e
    }
  }

  async getApplicationEligibility(
    nationalId: string,
    type: DrivingLicenseApplicationFor,
  ): Promise<ApplicationEligibility> {
    const assessmentResult = await this.getDrivingAssessmentResult(nationalId)
    const hasFinishedSchoolResult: HefurLokidOkugerdiDto = await this.drivingLicenseApi.apiOkuskirteiniKennitalaFinishedokugerdiGet(
      {
        kennitala: nationalId,
      },
    )

    const canApply = await this.canApplyFor(nationalId, type)

    const requirements = []

    if (type === B_FULL) {
      requirements.push(
        {
          key: RequirementKey.drivingAssessmentMissing,
          requirementMet:
            (assessmentResult?.dagsetningMats ?? 0) >
            Date.now() - DRIVING_ASSESSMENT_MAX_AGE,
        },
        {
          key: RequirementKey.drivingSchoolMissing,
          requirementMet: (hasFinishedSchoolResult.hefurLokidOkugerdi ?? 0) > 0,
        },
      )
    } else {
      requirements.push({
        key: RequirementKey.localResidency,
        requirementMet: true,
      })
    }

    requirements.push({
      key: RequirementKey.deniedByService,
      requirementMet: canApply,
    })

    // only eligible if we dont find an unmet requirement
    const isEligible = !requirements.find(
      ({ requirementMet }) => requirementMet === false,
    )

    return {
      requirements,
      isEligible,
    }
  }

  async canApplyFor(nationalId: string, type: DrivingLicenseApplicationFor) {
    let canApplyResult
    if (type === B_FULL) {
      canApplyResult = (await this.drivingLicenseApi.apiOkuskirteiniKennitalaCanapplyforCategoryFullGet(
        {
          kennitala: nationalId,
          category: 'B',
        },
      )) as unknown
    } else if (type === B_TEMP) {
      // TODO: API seems to not be there as of yet
      canApplyResult = '0'
    }

    return parseInt(canApplyResult as string, 10) > 0
  }

  async newDrivingAssessment(
    studentNationalId: string,
    teacherNationalId: User['nationalId'],
  ): Promise<NewDrivingAssessmentResult> {
    await this.drivingLicenseApi.apiOkuskirteiniNewDrivingassesmentPost({
      postNewDrivingAssessment: {
        kennitala: studentNationalId,
        kennitalaOkukennara: teacherNationalId,
        dagsetningMats: new Date(),
      },
    })

    return {
      success: true,
      errorMessage: null,
    }
  }

  async newDrivingLicense(
    nationalId: User['nationalId'],
    input: NewDrivingLicenseInput,
  ): Promise<NewDrivingLicenseResult> {
    const response: unknown = await this.drivingLicenseApi.apiOkuskirteiniApplicationsNewCategoryPost(
      {
        category: DrivingLicenseCategory.B,
        postNewFinalLicense: {
          authorityNumber: input.juristictionId,
          needsToPresentHealthCertificate: input.needsToPresentHealthCertificate
            ? NeedsHealhCertificate.TRUE
            : NeedsHealhCertificate.FALSE,
          personIdNumber: nationalId,
          bringsNewPhoto: input.needsToPresentQualityPhoto
            ? NeedsQualityPhoto.TRUE
            : NeedsQualityPhoto.FALSE,
          sendLicenseInMail: 0,
          sendToAddress: '',
        },
      },
    )

    // Service returns string on error, number on successful/not successful
    const responseIsString = typeof response === 'string'
    const success =
      !responseIsString ||
      response !== DRIVING_LICENSE_SUCCESSFUL_RESPONSE_VALUE
    const errorMessage = responseIsString
      ? (response as string)
      : 'Result not 1 when creating license'

    return {
      success,
      errorMessage: success ? null : errorMessage,
    }
  }

  async getQualityPhoto(
    nationalId: User['nationalId'],
  ): Promise<QualityPhotoResult> {
    const result = await this.drivingLicenseApi.apiOkuskirteiniKennitalaHasqualityphotoGet(
      {
        kennitala: nationalId,
      },
    )
    const image =
      result > 0
        ? await this.drivingLicenseApi.apiOkuskirteiniKennitalaGetqualityphotoGet(
            {
              kennitala: nationalId,
            },
          )
        : null

    return {
      success: result > 0,
      qualityPhoto: image,
      errorMessage: null,
    }
  }

  async getDrivingAssessment(
    nationalId: string,
  ): Promise<StudentAssessment | null> {
    const assessmentResult = await this.getDrivingAssessmentResult(nationalId)

    if (!assessmentResult) {
      return null
    }

    let teacherName: string | null
    if (assessmentResult.kennitalaOkukennara) {
      const teacherLicense = await this.getLicense(
        assessmentResult.kennitalaOkukennara,
      )
      teacherName = teacherLicense?.name || null
    } else {
      teacherName = null
    }

    return {
      studentNationalId: assessmentResult.kennitala ?? null,
      teacherNationalId: assessmentResult.kennitalaOkukennara ?? null,
      teacherName,
    }
  }

  async getDrivingSchool(nationalId: string): Promise<DrivingSchool | null> {
    const result: HefurLokidOkugerdiDto = await this.drivingLicenseApi.apiOkuskirteiniKennitalaFinishedokugerdiGet(
      {
        kennitala: nationalId,
      },
    )

    const hasFinishedSchool = (result?.hefurLokidOkugerdi || 0) > 0

    return {
      hasFinishedSchool,
    }
  }
}
