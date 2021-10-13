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
  DrivingLicenseApplicationType,
  DrivingSchool,
  NeedsQualityPhoto,
  NewTemporaryDrivingLicenseInput,
} from './drivingLicense.type'
import {
  AkstursmatDto,
  EmbaettiDto,
  HefurLokidOkugerdiDto,
  OkukennariDto,
  OkuskirteiniApiV1,
  Rettindi,
  TegSviptingaDto,
  TegundAthugasemdaDto,
  TegundRettindaDto,
} from '@island.is/clients/driving-license-v1'
import {
  DRIVING_LICENSE_API_VERSION_V2,
  OkuskirteiniApiV2,
} from '@island.is/clients/driving-license-v2'
import {
  BLACKLISTED_JURISTICTION,
  DRIVING_ASSESSMENT_MAX_AGE,
  DRIVING_LICENSE_SUCCESSFUL_RESPONSE_VALUE,
} from './util/constants'
import sortTeachers from './util/sortTeachers'

@Injectable()
export class DrivingLicenseService {
  constructor(
    private readonly drivingLicenseApi: OkuskirteiniApiV1,
    private readonly drivingLicenseApiV2: OkuskirteiniApiV2,
  ) {}

  private async getLicense(nationalId: string): Promise<DrivingLicense | null> {
    const drivingLicense = await this.drivingLicenseApiV2.getCurrentLicenseV2({
      kennitala: nationalId,
      // apiVersion header indicates that this method will return a single license, rather
      // than an array
      apiVersion: DRIVING_LICENSE_API_VERSION_V2,
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
    // I believe the API is wrong again, and this is still an array of TegSviptingaDto.. however
    // the openapi doc says that it's a single object now
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
      if ((e as { status: number })?.status === 404) {
        return null
      }

      throw e
    }
  }

  async getApplicationEligibility(
    nationalId: string,
    type: DrivingLicenseApplicationType,
  ): Promise<ApplicationEligibility> {
    const assessmentResult = await this.getDrivingAssessmentResult(nationalId)
    const hasFinishedSchoolResult: HefurLokidOkugerdiDto = await this.drivingLicenseApi.apiOkuskirteiniKennitalaFinishedokugerdiGet(
      {
        kennitala: nationalId,
      },
    )

    const canApply = await this.canApplyFor(nationalId, type)

    const requirements = []

    if (type === 'B-full') {
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
    } else if (type === 'B-temp') {
      requirements.push({
        key: RequirementKey.localResidency,
        requirementMet: true,
      })
    } else {
      throw new Error('unknown type')
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

  async canApplyFor(nationalId: string, type: 'B-full' | 'B-temp') {
    if (type === 'B-full') {
      const canApplyResult = await this.drivingLicenseApiV2.apiOkuskirteiniKennitalaCanapplyforCategoryFullGet(
        {
          apiVersion: DRIVING_LICENSE_API_VERSION_V2,
          kennitala: nationalId,
          category: 'B',
        },
      )

      // TODO: Use error codes from v2 api
      return !!canApplyResult.result
    } else if (type === 'B-temp') {
      const canApplyResult = await this.drivingLicenseApi.apiOkuskirteiniKennitalaCanapplyforTemporaryGet(
        {
          kennitala: nationalId,
        },
      )

      return !!canApplyResult.result
    } else {
      throw new Error('unhandled license type')
    }
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

  async newTemporaryDrivingLicense(
    nationalId: User['nationalId'],
    input: NewTemporaryDrivingLicenseInput,
  ): Promise<NewDrivingLicenseResult> {
    const response = await this.drivingLicenseApi.apiOkuskirteiniApplicationsNewTemporaryPost(
      {
        postTemporaryLicense: {
          kemurMedLaeknisvottord: input.needsToPresentHealthCertificate,
          kennitala: nationalId,
          kemurMedNyjaMynd: input.needsToPresentQualityPhoto,
          embaetti: input.juristictionId,
          kennitalaOkukennara: input.teacherNationalId,
          sendaSkirteiniIPosti: false,
        },
      },
    )

    // Service returns empty string on success (actually different but the generated
    // client forces it to)
    const success = '' + response === DRIVING_LICENSE_SUCCESSFUL_RESPONSE_VALUE

    const errorMessage = success
      ? null
      : typeof response === 'string'
      ? (response as string)
      : 'Result not 1 when creating temporary license'

    return {
      success,
      errorMessage,
    }
  }

  async newDrivingLicense(
    nationalId: User['nationalId'],
    input: NewDrivingLicenseInput,
  ): Promise<NewDrivingLicenseResult> {
    const response = await this.drivingLicenseApiV2.apiOkuskirteiniApplicationsNewCategoryPost(
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
        apiVersion: DRIVING_LICENSE_API_VERSION_V2,
      },
    )

    // Service returns empty string on success (actually different but the generated
    // client forces it to)
    const success = '' + response === DRIVING_LICENSE_SUCCESSFUL_RESPONSE_VALUE

    const errorMessage = success
      ? null
      : typeof response === 'string'
      ? (response as string)
      : 'Result not 1 when creating license'

    return {
      success,
      errorMessage,
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
