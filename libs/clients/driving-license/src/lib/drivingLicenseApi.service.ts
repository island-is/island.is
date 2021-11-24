import { Injectable } from '@nestjs/common'
import { DrivingAssessment, Juristiction, QualityPhoto } from '..'
import { ApiV1, EmbaettiDto } from '../v1'
import { ApiV2, DRIVING_LICENSE_API_VERSION_V2, Rettindi } from '../v2'
import { DriversLicense, Teacher } from './drivingLicenseApi.types'

// empty string === successful license posted!?!
const DRIVING_LICENSE_SUCCESSFUL_RESPONSE_VALUE = ''

@Injectable()
export class DrivingLicenseApi {
  constructor(private readonly v1: ApiV1, private readonly v2: ApiV2) {}

  public async getCurrentLicense(input: {
    nationalId: string
  }): Promise<DriversLicense | null> {
    const skirteini = await this.v2.getCurrentLicenseV2({
      kennitala: input.nationalId,
      // apiVersion header indicates that this method will return a single license, rather
      // than an array
      apiVersion: DRIVING_LICENSE_API_VERSION_V2,
    })

    if (!skirteini || !skirteini.id) {
      return null
    }

    // Pretty sure none of these fallbacks can get triggered, since if the service
    // finds a driver's license, it's going to have the values. - this is mostly to
    // appease the type system, since the downstream type is actually wrong.
    return {
      id: skirteini.id,
      name: skirteini.nafn || '',
      issued: skirteini.utgafuDagsetning,
      expires: skirteini.gildirTil,
      categories: (skirteini.rettindi as Rettindi[]).map((rettindi) => ({
        id: rettindi.id || 0,
        name: rettindi?.nr || '',
        issued: rettindi.utgafuDags || null,
        expires: rettindi.gildirTil || null,
        comments: rettindi.aths || '',
      })),
    }
  }

  public async getTeachers(): Promise<Teacher[]> {
    const kennarar = await this.v1.apiOkuskirteiniOkukennararGet({})

    return kennarar.map((okukennari) => ({
      nationalId: okukennari.kennitala || '',
      name: okukennari.nafn || '',
    }))
  }

  public async getIsTeacher(params: { nationalId: string }) {
    const statusStr = ((await this.v1.apiOkuskirteiniHasteachingrightsKennitalaGet(
      {
        kennitala: params.nationalId,
      },
    )) as unknown) as string

    // API says number, type says number, but deserialization happens with a text
    // deserializer (runtime.TextApiResponse).
    // Seems to be an outstanding bug? or I have no idea what I'm doing
    // See https://github.com/OpenAPITools/openapi-generator/issues/2870
    return parseInt(statusStr, 10) > 0
  }

  public async getListOfJuristictions(): Promise<Juristiction[]> {
    const embaetti = await this.v1.apiOkuskirteiniEmbaettiGet({})

    return embaetti.map(({ nr, postnumer, nafn }: EmbaettiDto) => ({
      id: nr || 0,
      zip: postnumer || 0,
      name: nafn || '',
    }))
  }

  public async getDrivingAssessment(params: {
    nationalId: string
  }): Promise<DrivingAssessment | null> {
    let assessment
    try {
      assessment = await this.v1.apiOkuskirteiniSaekjaakstursmatKennitalaGet({
        kennitala: params.nationalId,
      })
    } catch (e) {
      if ((e as { status: number })?.status === 404) {
        return null
      }

      throw e
    }

    if (!assessment) {
      return null
    }

    return {
      nationalIdStudent: assessment.kennitala ?? '',
      nationalIdTeacher: assessment.kennitalaOkukennara ?? '',
      created: assessment.dagsetningMats ?? null,
    }
  }

  public async getHasFinishedOkugerdi(params: {
    nationalId: string
  }): Promise<boolean> {
    const res = await this.v1.apiOkuskirteiniKennitalaFinishedokugerdiGet({
      kennitala: params.nationalId,
    })

    return (res.hefurLokidOkugerdi ?? 0) > 0
  }

  public async getCanApplyForCategoryFull(params: {
    category: string
    nationalId: string
  }) {
    const canApplyResult = await this.v2.apiOkuskirteiniKennitalaCanapplyforCategoryFullGet(
      {
        apiVersion: DRIVING_LICENSE_API_VERSION_V2,
        kennitala: params.nationalId,
        category: params.category,
      },
    )

    // TODO: Use error codes from v2 api
    return !!canApplyResult.result
  }

  public async getCanApplyForCategoryTemporary(params: { nationalId: string }) {
    const canApplyResult = await this.v1.apiOkuskirteiniKennitalaCanapplyforTemporaryGet(
      {
        kennitala: params.nationalId,
      },
    )

    return !!canApplyResult.result
  }

  public async postCreateDrivingAssessment(params: {
    nationalIdStudent: string
    nationalIdTeacher: string
    dateOfAssessment: Date
  }) {
    return await this.v1.apiOkuskirteiniNewDrivingassesmentPost({
      postNewDrivingAssessment: {
        kennitala: params.nationalIdStudent,
        kennitalaOkukennara: params.nationalIdTeacher,
        dagsetningMats: params.dateOfAssessment,
      },
    })
  }

  public async postCreateDrivingLicenseTemporary(params: {
    nationalIdApplicant: string
    nationalIdTeacher: string
    willBringHealthCertificate: boolean
    willBringQualityPhoto: boolean
    juristictionId: number
    sendLicenseInMail: boolean
  }) {
    const response = await this.v1.apiOkuskirteiniApplicationsNewTemporaryPost({
      postTemporaryLicense: {
        kemurMedLaeknisvottord: params.willBringHealthCertificate,
        kennitala: params.nationalIdApplicant,
        kemurMedNyjaMynd: params.willBringQualityPhoto,
        embaetti: params.juristictionId,
        kennitalaOkukennara: params.nationalIdTeacher,
        sendaSkirteiniIPosti: params.sendLicenseInMail,
      },
    })

    // Service returns empty string on success (actually different but the generated
    // client forces it to)
    const success = '' + response === DRIVING_LICENSE_SUCCESSFUL_RESPONSE_VALUE

    if (!success) {
      throw new Error(
        `POST apiOkuskirteiniApplicationsNewTemporaryPost was not successful, response was: ${response}`,
      )
    }

    return success
  }

  async postCreateDrivingLicenseFull(params: {
    nationalIdApplicant: string
    willBringHealthCertificate: boolean
    willBringQualityPhoto: boolean
    juristictionId: number
    sendLicenseInMail: boolean
    sendLicenseToAddress: string
    category: string
  }): Promise<boolean> {
    const response = await this.v2.apiOkuskirteiniApplicationsNewCategoryPost({
      category: params.category,
      postNewFinalLicense: {
        authorityNumber: params.juristictionId,
        needsToPresentHealthCertificate: params.willBringHealthCertificate
          ? 1
          : 0,
        personIdNumber: params.nationalIdApplicant,
        bringsNewPhoto: params.willBringQualityPhoto ? 1 : 0,
        sendLicenseInMail: params.sendLicenseInMail ? 1 : 0,
        sendToAddress: params.sendLicenseToAddress,
      },
      apiVersion: DRIVING_LICENSE_API_VERSION_V2,
    })

    // Service returns empty string on success (actually different but the generated
    // client forces it to)
    const success = '' + response === DRIVING_LICENSE_SUCCESSFUL_RESPONSE_VALUE

    if (!success) {
      throw new Error(
        `POST apiOkuskirteiniApplicationsNewTemporaryPost was not successful, response was: ${response}`,
      )
    }

    return success
  }

  async getHasQualityPhoto(params: { nationalId: string }): Promise<boolean> {
    const result = await this.v1.apiOkuskirteiniKennitalaHasqualityphotoGet({
      kennitala: params.nationalId,
    })

    return result > 0
  }

  async getQualityPhoto(params: {
    nationalId: string
  }): Promise<QualityPhoto | null> {
    const image = await this.v1.apiOkuskirteiniKennitalaGetqualityphotoGet({
      kennitala: params.nationalId,
    })

    return {
      data: image,
    }
  }
}
