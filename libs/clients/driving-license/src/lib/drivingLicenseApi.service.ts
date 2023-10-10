import { Injectable } from '@nestjs/common'
import {
  CanApplyErrorCodeBFull,
  CanApplyForCategoryResult,
  DrivingAssessment,
  Jurisdiction,
  QualityPhoto,
} from '..'
import * as v1 from '../v1'
import * as v2 from '../v2'
import * as v4 from '../v4'
import * as v5 from '../v5'
import {
  CanApplyErrorCodeBTemporary,
  DriversLicense,
  QualitySignature,
  Teacher,
  RemarkCode,
} from './drivingLicenseApi.types'
import { handleCreateResponse } from './utils/handleCreateResponse'
import { DriverLicenseWithoutImagesDto, PracticePermitDto } from '../v5'

@Injectable()
export class DrivingLicenseApi {
  constructor(
    private readonly v1: v1.ApiV1,
    private readonly v2: v2.ApiV2,
    private readonly v4: v4.ApiV4,
    private readonly v5: v5.ApiV5,
    private readonly v5CodeTable: v5.CodeTableV5,
  ) {}

  public notifyOnPkPassCreation(input: {
    nationalId: string
    token?: string
  }): Promise<void> {
    return this.v5.apiDrivinglicenseV5DigitallicensecreatedPost({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: input.token ?? '',
    })
  }

  public async getRemarksCodeTable(): Promise<RemarkCode[] | null> {
    const codeTable = await this.v5CodeTable.apiCodetablesRemarksGet({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
    })
    if (!codeTable) return null
    return codeTable.map((c) => ({
      index: c.nr ?? '',
      name: c.heiti ?? '',
    }))
  }
  public async getCurrentLicenseV5(input: {
    nationalId: string
    token?: string
  }): Promise<v5.DriverLicenseDto | null> {
    const skirteini = await this.v5.getCurrentLicenseV5({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: input.token ?? '',
    })
    if (!skirteini || !skirteini.id) {
      return null
    }
    return skirteini
  }

  public async getCurrentLicenseV4(input: {
    nationalId: string
  }): Promise<v4.DriverLicenseDto | null> {
    const skirteini = await this.v4.getCurrentLicenseV4({
      apiVersion: v4.DRIVING_LICENSE_API_VERSION_V4,
      apiVersion2: v4.DRIVING_LICENSE_API_VERSION_V4,
      sSN: input.nationalId,
    })
    if (!skirteini || !skirteini.id) {
      return null
    }
    return skirteini
  }

  public async getCurrentLicense(input: {
    token: string
  }): Promise<DriversLicense> {
    const license = await this.v5.getCurrentLicenseV5({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: input.token?.replace('Bearer ', ''),
    })
    return DrivingLicenseApi.normalizeDrivingLicenseDTO(license)
  }

  // TODO: deprecate this function and use getCurrentLicense instead
  public async legacyGetCurrentLicense(input: {
    nationalId: string
    token?: string
  }): Promise<DriversLicense | null> {
    try {
      const skirteini = await this.v2.getCurrentLicenseV2({
        kennitala: input.nationalId,
        // apiVersion header indicates that this method will return a single license, rather
        // than an array
        apiVersion: v2.DRIVING_LICENSE_API_VERSION_V2,
      })
      if (!skirteini || !skirteini.id) {
        return null
      }
      const license = DrivingLicenseApi.normalizeDrivingLicenseType(skirteini)
      if (skirteini.athugasemdir) {
        const remarks = await this.v1.apiOkuskirteiniTegundirathugasemdaGet({
          apiVersion: v1.DRIVING_LICENSE_API_VERSION_V1,
        })
        const licenseRemarks: string[] = skirteini.athugasemdir
          .filter(
            (remark: v1.AtsSkirteini) =>
              remark.id === skirteini.id && !!remark.nr,
          )
          .map((remark: v1.AtsSkirteini) => remark.nr || '')
        const filteredRemarks: string[] = remarks
          .filter(
            (remark: v1.TegundAthugasemdaDto) =>
              !!remark.heiti &&
              licenseRemarks.includes(remark.nr || ('' && !remark.athugasemd)),
          )
          .map((remark: v1.TegundAthugasemdaDto) => remark.heiti || '')
        return { ...license, healthRemarks: filteredRemarks }
      }

      return license
    } catch (e) {
      if (e.body.detail === 'Ökuskírteini er ekki í gildi') {
        const oldLicenses = await this.getAllLicenses(input)
        // Find license that expired within 2 years
        const licenseWithinLimit = oldLicenses.find((license) => {
          const exists = license.categories.find(
            (category) =>
              category.expires &&
              new Date().getFullYear() -
                new Date(category.expires).getFullYear() <
                2,
          )
          return !!exists
        })
        return licenseWithinLimit || null
      }
      // The API returns an error when disqualification present on license.
      // The 'svipting' (en: disqualification) field is never set for the
      // driving license model in any endpoint. We catch the response and
      // disqualification is set manually via the deprivation endpoint.
      // This is less than ideal, but the API offers no alternative.
      if (e.body.detail === 'Einstaklingur er sviptur ökuréttindum') {
        const getAllLicenses = await this.getAllLicenses(input)
        const currentLicense = getAllLicenses.find((license) => {
          const categoryB = license.categories.find((cat) => cat.name === 'B')
          if (categoryB && categoryB.expires && categoryB.issued) {
            const now = new Date()
            return categoryB.issued < now && now < categoryB.expires
          }
          return false
        })

        // Add disqualification to current license.
        const deprivation = await this.getDeprivation(input)
        if (currentLicense && deprivation.dateFrom && deprivation.dateTo) {
          currentLicense.disqualification = {
            from: deprivation.dateFrom,
            to: deprivation.dateTo,
          }
        }
        return currentLicense || null
      }

      return null
    }
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
      disqualification:
        skirteini?.svipting?.dagsTil && skirteini?.svipting?.dagsFra
          ? {
              to: skirteini.svipting.dagsTil,
              from: skirteini.svipting.dagsFra,
            }
          : null,
      birthCountry: skirteini.faedingarStadurHeiti,
    }
  }

  // TODO: We should consider changing the DriversLicense type to reflect
  // the new DTO from v5. This should be done as part of a larger refactor
  // for the driving license client.
  private static normalizeDrivingLicenseDTO(
    license: v5.DriverLicenseDto,
  ): DriversLicense {
    const normalizedLicense: DriversLicense = {
      ...license,
      id: license.id ?? -1,
      name: license.name ?? '',
      categories:
        license.categories?.map((category) => {
          return {
            ...category,
            id: category.id ?? -1,
            issued: category.publishDate ?? null,
            comments: category.comment ?? null,
            name: category.categoryName ?? '',
            expires: category.dateTo ?? null,
          }
        }) ?? [],
    }
    return normalizedLicense
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

  public async getTeachersV4() {
    const teachers = await this.v4.apiDrivinglicenseV4DrivinginstructorsGet({
      apiVersion: v4.DRIVING_LICENSE_API_VERSION_V4,
      apiVersion2: v4.DRIVING_LICENSE_API_VERSION_V4,
    })

    return teachers.map((teacher) => ({
      name: teacher?.name ?? '',
      nationalId: teacher?.ssn ?? '',
      driverLicenseId: teacher?.driverLicenseId,
    }))
  }

  public async getDeprivation(input: {
    nationalId: string
    token?: string
  }): Promise<v5.DeprivationDto> {
    return await this.v5.apiDrivinglicenseV5DeprivationGet({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: input.token?.replace('Bearer ', '') ?? '',
    })
  }

  public async getIsTeacher(params: { nationalId: string }) {
    const statusStr =
      (await this.v1.apiOkuskirteiniHasteachingrightsKennitalaGet({
        kennitala: params.nationalId,
      })) as unknown as string

    // API says number, type says number, but deserialization happens with a text
    // deserializer (runtime.TextApiResponse).
    // Seems to be an outstanding bug? or I have no idea what I'm doing
    // See https://github.com/OpenAPITools/openapi-generator/issues/2870
    return parseInt(statusStr, 10) > 0
  }

  public async getListOfJurisdictions(): Promise<Jurisdiction[]> {
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
    const response =
      await this.v2.apiOkuskirteiniKennitalaCanapplyforCategoryFullGet({
        apiVersion: v2.DRIVING_LICENSE_API_VERSION_V2,
        kennitala: params.nationalId,
        category: params.category,
      })

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
    const response =
      await this.v1.apiOkuskirteiniKennitalaCanapplyforTemporaryGet({
        kennitala: params.nationalId,
      })
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
    jurisdictionId: number
    sendLicenseInMail: boolean
    email: string
    phone: string
  }) {
    try {
      const response =
        await this.v2.apiOkuskirteiniApplicationsNewTemporaryPost({
          apiVersion: v2.DRIVING_LICENSE_API_VERSION_V2,
          postTemporaryLicenseV2: {
            kemurMedLaeknisvottord: params.willBringHealthCertificate,
            kennitala: params.nationalIdApplicant,
            kemurMedNyjaMynd: params.willBringQualityPhoto,
            embaetti: params.jurisdictionId,
            kennitalaOkukennara: params.nationalIdTeacher,
            sendaSkirteiniIPosti: params.sendLicenseInMail,
            netfang: params.email,
            farsimaNumer: params.phone,
          },
        })
      if (!response.result) {
        throw new Error(
          `POST apiOkuskirteiniApplicationsNewTemporaryPost was not successful, response was: ${response.errorCode}`,
        )
      }

      return response.result
    } catch (e) {
      // In cases where first submit fails then resubmission gets 400 response
      // The generated api does not map the error correctly so we check if the canApply status has changed to "HAS_B_Category"
      if ((e as { status: number })?.status === 400) {
        const hasTemp = await this.getCanApplyForCategoryTemporary({
          nationalId: params.nationalIdApplicant,
        })
        return hasTemp.errorCode === 'HAS_B_CATEGORY'
      }
      throw new Error(
        `POST apiOkuskirteiniApplicationsNewTemporaryPost was not successful, response was: ${
          (e as { status: number })?.status
        }`,
      )
    }
  }

  async postCreateDrivingLicenseFull(params: {
    nationalIdApplicant: string
    willBringHealthCertificate: boolean
    willBringQualityPhoto: boolean
    jurisdictionId: number
    sendLicenseInMail: boolean
    sendLicenseToAddress: string
    category: string
  }): Promise<boolean> {
    const response = await this.v2.apiOkuskirteiniApplicationsNewCategoryPost({
      category: params.category,
      postNewFinalLicense: {
        authorityNumber: params.jurisdictionId,
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

  async postCanApplyForPracticePermit(params: {
    token: string
    studentSSN: string
  }): Promise<PracticePermitDto> {
    return await this.v5.apiDrivinglicenseV5CanapplyforPracticepermitPost({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.token.replace('Bearer ', ''),
      postPracticePermit: {
        dateFrom: new Date(),
        studentSSN: params.studentSSN,
        userId: v5.DRIVING_LICENSE_API_USER_ID,
      },
    })
  }

  async postPracticePermitApplication(params: {
    token: string
    studentSSN: string
  }): Promise<PracticePermitDto> {
    return await this.v5.apiDrivinglicenseV5ApplicationsPracticepermitPost({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.token.replace('Bearer ', ''),
      postPracticePermit: {
        dateFrom: new Date(),
        studentSSN: params.studentSSN,
        userId: v5.DRIVING_LICENSE_API_USER_ID,
      },
    })
  }

  async postApplicationNewCollaborative(params: {
    token: string
    districtId: number
    stolenOrLost: boolean
  }): Promise<number> {
    const { districtId, token, stolenOrLost } = params
    return await this.v5.apiDrivinglicenseV5ApplicationsNewCollaborativePost({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: token.replace('Bearer ', ''),
      postNewCollaborative: {
        districtId,
        licenseStolenOrLost: stolenOrLost,
        userId: v5.DRIVING_LICENSE_API_USER_ID,
      },
    })
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

  async getHasQualitySignature(params: {
    nationalId: string
  }): Promise<boolean> {
    const result = await this.v1.apiOkuskirteiniKennitalaHasqualitysignatureGet(
      {
        kennitala: params.nationalId,
      },
    )
    return result > 0
  }

  async getQualitySignature(params: {
    nationalId: string
  }): Promise<QualitySignature | null> {
    const image = await this.v1.apiOkuskirteiniKennitalaGetqualitysignatureGet({
      kennitala: params.nationalId,
    })
    return {
      data: image,
    }
  }

  async getAllDriverLicenses(token: string): Promise<DriverLicenseWithoutImagesDto[]>{
    return await this.v5.apiDrivinglicenseV5AllGet({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: token.replace('Bearer ', ''),
    })
  }
}
