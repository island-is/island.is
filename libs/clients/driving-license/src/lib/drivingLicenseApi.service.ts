import { ConfigType } from '@island.is/nest/config'
import { Inject, Injectable } from '@nestjs/common'
import {
  CanApplyErrorCodeBFull,
  CanApplyForCategoryResult,
  DrivingAssessment,
  Juristiction,
  QualityPhoto,
} from '..'
import * as v1 from '../v1'
import * as v2 from '../v2'
import { DrivingLicenseApiConfig } from './DrivingLicenseApi.config'
import {
  CanApplyErrorCodeBTemporary,
  DriversLicense,
  Teacher,
} from './drivingLicenseApi.types'
import { handleCreateResponse } from './utils/handleCreateResponse'

const DRIVING_LICENSE_SUCCESSFUL_RESPONSE_VALUE = ''

@Injectable()
export class DrivingLicenseApi {
  constructor(private readonly v1: v1.ApiV1, private readonly v2: v2.ApiV2) {}

  public async getCurrentLicense(input: {
    nationalId: string
  }): Promise<DriversLicense | null> {
    const skirteini = await this.v2.getCurrentLicenseV2({
      kennitala: input.nationalId,
      // apiVersion header indicates that this method will return a single license, rather
      // than an array
      apiVersion: v2.DRIVING_LICENSE_API_VERSION_V2,
    })

    if (!skirteini || !skirteini.id) {
      return null
    }

    return DrivingLicenseApi.normalizeDrivingLicenseType(skirteini)
  }

  private static normalizeDrivingLicenseType(
    skirteini: v2.Okuskirteini | v1.Okuskirteini,
  ): DriversLicense {
    // Pretty sure none of these fallbacks can get triggered, since if the service
    // finds a driver's license, it's going to have the values. - this is mostly to
    // appease the type system, since the downstream type is actually wrong.

    return {
      id: skirteini.id ?? -1,
      name: skirteini.nafn ?? '',
      issued: skirteini.utgafuDagsetning,
      expires: skirteini.gildirTil,
      categories:
        skirteini.rettindi?.map((rettindi: v2.Rettindi | v1.Rettindi) => ({
          id: rettindi.id ?? 0,
          name: rettindi?.nr ?? '',
          issued: rettindi.utgafuDags ?? null,
          expires: rettindi.gildirTil ?? null,
          comments: rettindi.aths ?? '',
        })) ?? [],
    }
  }

  public async getAllLicenses(input: {
    nationalId: string
  }): Promise<DriversLicense[]> {
    const response = await this.v1.apiOkuskirteiniKennitalaAllGet({
      kennitala: input.nationalId,
    })

    return response.map(DrivingLicenseApi.normalizeDrivingLicenseType)
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

    return embaetti.map(({ nr, postnumer, nafn }: v1.EmbaettiDto) => ({
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
  }): Promise<CanApplyForCategoryResult<CanApplyErrorCodeBFull>> {
    const response = await this.v2.apiOkuskirteiniKennitalaCanapplyforCategoryFullGet(
      {
        apiVersion: v2.DRIVING_LICENSE_API_VERSION_V2,
        kennitala: params.nationalId,
        category: params.category,
      },
    )

    return {
      result: !!response.result,
      errorCode: response.errorCode
        ? (response.errorCode as CanApplyErrorCodeBFull)
        : undefined,
    }
  }

  public async getCanApplyForCategoryTemporary(params: {
    nationalId: string
  }): Promise<CanApplyForCategoryResult<CanApplyErrorCodeBTemporary>> {
    const response = await this.v1.apiOkuskirteiniKennitalaCanapplyforTemporaryGet(
      {
        kennitala: params.nationalId,
      },
    )

    return {
      result: !!response.result,
      errorCode: response.errorCode
        ? (response.errorCode as CanApplyErrorCodeBTemporary)
        : undefined,
    }
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
    email: string
    phone: string
  }) {
    const response = await this.v2.apiOkuskirteiniApplicationsNewTemporaryPost({
      apiVersion: v2.DRIVING_LICENSE_API_VERSION_V2,
      postTemporaryLicenseV2: {
        kemurMedLaeknisvottord: params.willBringHealthCertificate,
        kennitala: params.nationalIdApplicant,
        kemurMedNyjaMynd: params.willBringQualityPhoto,
        embaetti: params.juristictionId,
        kennitalaOkukennara: params.nationalIdTeacher,
        sendaSkirteiniIPosti: params.sendLicenseInMail,
        netfang: params.email,
        farsimaNumer: params.phone,
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
      apiVersion: v2.DRIVING_LICENSE_API_VERSION_V2,
    })

    const handledResponse = handleCreateResponse(response)

    if (!handledResponse.success) {
      throw new Error(
        `POST apiOkuskirteiniApplicationsNewCategoryPost was not successful, response was: ${handledResponse.error}`,
      )
    }

    return handledResponse.success
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
