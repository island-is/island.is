import { Injectable } from '@nestjs/common'
import {
  CanApplyErrorCodeBFull,
  CanApplyForCategoryResult,
  DrivingAssessment,
  QualityPhoto,
} from '..'
import * as v4 from '../v4'
import * as v5 from '../v5'
import {
  CanApplyErrorCodeBTemporary,
  DriversLicense,
  QualitySignature,
  RemarkCode,
  DrivingLicenseV4V5Dto,
  Jurisdiction,
  Remark,
} from './drivingLicenseApi.types'
import { handleCreateResponse } from './utils/handleCreateResponse'
import {
  PracticePermitDto,
  DriverLicenseWithoutImagesDto,
  ImagesFromThjodskraDto,
} from '../v5'

@Injectable()
export class DrivingLicenseApi {
  constructor(
    private readonly v4: v4.ApiV4,
    private readonly v5: v5.ApiV5,
    private readonly applicationV5: v5.ApplicationApiV5,
    private readonly v5CodeTable: v5.CodeTableV5,
    private readonly imageApiV5: v5.ImageApiV5,
  ) {}

  public async postTemporaryLicenseWithHealthDeclaratio(input: {
    nationalId: string
    token?: string
    healthDecleration: v5.PostTemporaryLicenseWithHealthDeclaration
  }): Promise<v5.NewTemporaryLicsenseDto> {
    return this.v5.apiDrivinglicenseV5ApplicationsNewTemporarywithhealthdeclarationPost(
      {
        apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
        apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
        jwttoken: input.token ?? '',
        postTemporaryLicenseWithHealthDeclaration: input.healthDecleration,
      },
    )
  }

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

    if (license?.comments) {
      const remarks = await this.getRemarksCodeTable()
      const licenseRemarks: Remark[] = license.comments.map((remark) => ({
        code: remark.nr ?? '',
        description:
          remarks?.find((r) => r.index === remark?.nr?.toString())?.name ?? '',
      }))
      return {
        ...DrivingLicenseApi.normalizeDrivingLicenseDTO(license),
        remarks: licenseRemarks,
      }
    }

    return DrivingLicenseApi.normalizeDrivingLicenseDTO(license)
  }

  public async legacyGetCurrentLicense(input: {
    nationalId: string
    token?: string
  }): Promise<DriversLicense | null> {
    try {
      const licenseRaw = await this.v4.getCurrentLicenseV4({
        sSN: input.nationalId,
        apiVersion: v4.DRIVING_LICENSE_API_VERSION_V4,
        apiVersion2: v4.DRIVING_LICENSE_API_VERSION_V4,
      })
      if (!licenseRaw || !licenseRaw.id) {
        return null
      }
      const license = DrivingLicenseApi.normalizeDrivingLicenseDTO(licenseRaw)
      if (licenseRaw.comments) {
        const remarks = await this.v5CodeTable.apiCodetablesRemarksGet({
          apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
          apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
        })
        const licenseRemarks: Remark[] = licenseRaw.comments
          .filter((remark) => remark.id === licenseRaw.id && !!remark.nr)
          .map((remark) => ({
            code: remark.comment ?? '',
            description: remark.nr || '',
          }))

        const filteredRemarks: Remark[] = remarks
          .filter(
            (remark) =>
              !!remark.heiti &&
              licenseRemarks.some((lremark) =>
                lremark.description.includes(remark.nr || ''),
              ),
          )
          .map((remark) => ({
            code: remark.nr || '',
            description: remark.heiti || '',
          }))
        return {
          ...license,
          remarks: filteredRemarks,
        }
      }

      return license
    } catch (e) {
      if (e.body.detail === 'Ökuskírteini er ekki í gildi') {
        const oldLicenses = await this.getAllLicensesV4(input)
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
        const getAllLicenses = await this.getAllLicensesV4(input)
        const currentLicense = getAllLicenses.find((license) => {
          const categoryB = license.categories.find((cat) => cat.nr === 'B')
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

  private static normalizeDrivingLicenseDTO(
    license: DrivingLicenseV4V5Dto,
  ): DriversLicense {
    const normalizedLicense: DriversLicense = {
      ...license,
      id: license.id ?? -1,
      name: license.name ?? '',
      publishPlaceName: license.publishPlaceName,
      categories:
        license.categories?.map((category) => {
          return {
            ...category,
            id: category.id ?? -1,
            issued: category.publishDate ?? null,
            comments: category.comment ?? null,
            name: category.categoryName ?? '',
            expires: category.dateTo ?? null,
            nr: category.nr ?? '',
          }
        }) ?? [],
      disqualification: license.deprivation
        ? {
            from: license.deprivation?.dateFrom ?? null,
            to: license.deprivation?.dateTo ?? null,
          }
        : null,
      issued: license.publishDate ?? null,
      expires: license.dateValidTo ?? null,
    }
    return normalizedLicense
  }

  public async getAllLicensesV4(input: {
    nationalId: string
  }): Promise<DriversLicense[]> {
    const response = await this.v4.apiDrivinglicenseV4SSNAllGet({
      apiVersion: v4.DRIVING_LICENSE_API_VERSION_V4,
      apiVersion2: v4.DRIVING_LICENSE_API_VERSION_V4,
      sSN: input.nationalId,
    })

    return response.map(DrivingLicenseApi.normalizeDrivingLicenseDTO)
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

  public async getIsTeacher(params: { token: string }) {
    const statusStr = await this.v5.apiDrivinglicenseV5HasteachingrightsGet({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.token.replace('Bearer ', ''),
    })

    // API says number, type says number, but deserialization happens with a text
    // deserializer (runtime.TextApiResponse).
    // Seems to be an outstanding bug? or I have no idea what I'm doing
    // See https://github.com/OpenAPITools/openapi-generator/issues/2870

    // TODO: try this as a number again
    // There still is indeed a TextApiResponse in the JSON response of the generated API
    return parseInt(statusStr.toString(), 10) > 0
  }

  public async getDrivingAssessment(params: {
    token: string
  }): Promise<DrivingAssessment | null> {
    let assessment
    try {
      assessment = await this.v5.apiDrivinglicenseV5DrivingassessmentGet({
        apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
        apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
        jwttoken: params.token.replace('Bearer ', ''),
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
      nationalIdStudent: assessment.ssn ?? '',
      nationalIdTeacher: assessment.instructorSSN ?? '',
      created: assessment.dateOfAssessment ?? null,
    }
  }

  public async getListOfJurisdictions(): Promise<Jurisdiction[]> {
    return (
      await this.v5CodeTable.apiCodetablesDistrictsGet({
        apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
        apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      })
    ).map(({ nr, postnumer, nafn }) => ({
      id: nr || 0,
      zip: postnumer || 0,
      name: nafn || '',
    }))
  }

  public async getHasFinishedOkugerdi(params: {
    token: string
  }): Promise<boolean> {
    const res = await this.v5.apiDrivinglicenseV5Hasfinisheddrivingschool3Get({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.token.replace('Bearer ', ''),
    })

    return Boolean(res.hasFinishedDrivingSchool3)
  }

  public async getCanApplyForCategoryFull(params: {
    category: string
    token: string
  }): Promise<CanApplyForCategoryResult<CanApplyErrorCodeBFull>> {
    const response =
      await this.v5.apiDrivinglicenseV5CanapplyforCategoryFullGet({
        apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
        apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
        category: params.category,
        jwttoken: params.token,
      })

    return {
      result: !!response.result,
      errorCode: response.errorCode
        ? (response.errorCode as CanApplyErrorCodeBFull)
        : undefined,
    }
  }

  public async getCanApplyForRenewal65(params: {
    token: string
  }): Promise<CanApplyForCategoryResult<CanApplyErrorCodeBFull>> {
    const response = await this.v5.apiDrivinglicenseV5CanapplyforRenewal65Get({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.token,
    })

    return {
      result: !!response.result,
      errorCode: response.errorCode
        ? (response.errorCode as CanApplyErrorCodeBFull)
        : undefined,
    }
  }

  public async getCanApplyForCategoryTemporary(params: {
    token: string
  }): Promise<CanApplyForCategoryResult<CanApplyErrorCodeBTemporary>> {
    const response = await this.v5.apiDrivinglicenseV5CanapplyforTemporaryGet({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.token,
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
    return await this.v5.apiDrivinglicenseV5DrivingassessmentPost({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      postNewDrivingAssessment: {
        dateOfAssessment: params.dateOfAssessment,
        instructorSSN: params.nationalIdTeacher,
        ssn: params.nationalIdStudent,
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
    auth: string
  }) {
    try {
      const response =
        await this.v5.apiDrivinglicenseV5ApplicationsNewTemporaryPost({
          apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
          apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
          postTemporaryLicense: {
            bringsHealthCertificate: params.willBringHealthCertificate,
            ssn: params.nationalIdApplicant,
            bringNewPhoto: params.willBringQualityPhoto,
            instructorSSN: params.nationalIdTeacher,
            sendLicenseInMail: params.sendLicenseInMail,
            email: params.email,
            gsm: params.phone,
            authority: params.jurisdictionId,
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
          token: params.auth,
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
    sendLicenseInMail: number
    sendLicenseToAddress: string
    category: string
  }): Promise<boolean> {
    const response =
      await this.v5.apiDrivinglicenseV5ApplicationsNewCategoryPost({
        apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
        apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
        category: params.category,
        postNewFinalLicense: {
          authorityNumber: params.jurisdictionId,
          needsToPresentHealthCertificate: params.willBringHealthCertificate
            ? 1
            : 0,
          personIdNumber: params.nationalIdApplicant,
          bringsNewPhoto: params.willBringQualityPhoto ? 1 : 0,
          sendLicenseInMail: params.sendLicenseInMail,
          sendToAddress: params.sendLicenseToAddress,
        },
      })

    const handledResponse = handleCreateResponse(response)

    if (!handledResponse.success) {
      throw new Error(
        `POST apiOkuskirteiniApplicationsNewCategoryPost was not successful, response was: ${handledResponse.error}`,
      )
    }

    return handledResponse.success
  }

  async postRenewLicenseOver65(params: {
    input: v5.PostRenewal65AndOver
    auth: string
  }) {
    return await this.v5.apiDrivinglicenseV5ApplicationsRenewal65Post({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.auth,
      postRenewal65AndOver: {
        ...params.input,
        renewalDate: new Date(),
        userId: v5.DRIVING_LICENSE_API_USER_ID,
      },
    })
  }

  async postApplyForBELicense(params: {
    nationalIdApplicant: string
    token: string
    jurisdictionId: number
    instructorSSN: string
    phoneNumber: string
    email: string
  }): Promise<boolean> {
    const response = await this.applicationV5.apiApplicationsV5ApplyforBePost({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.token.replace('Bearer ', ''),
      postApplicationForBEModel: {
        districtId: params.jurisdictionId,
        userId: v5.DRIVING_LICENSE_API_USER_ID,
        instructorSSN: params.instructorSSN,
        primaryPhoneNumber: params.phoneNumber,
        studentEmail: params.email,
      },
    })

    return response.result ?? false
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
    pickUpLicense: boolean
    imageBiometricsId: string | null
  }): Promise<number> {
    const {
      districtId,
      token,
      stolenOrLost,
      pickUpLicense,
      imageBiometricsId,
    } = params
    return await this.v5.apiDrivinglicenseV5ApplicationsNewCollaborativePost({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: token.replace('Bearer ', ''),
      postNewCollaborative: {
        districtId,
        licenseStolenOrLost: stolenOrLost,
        userId: v5.DRIVING_LICENSE_API_USER_ID,
        pickUpLicense,
        imageBiometricsId,
      },
    })
  }

  async getHasQualityPhoto(params: { token: string }): Promise<boolean> {
    const result = await this.v5.apiDrivinglicenseV5HasqualityphotoGet({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.token.replace('Bearer ', ''),
    })

    return result > 0
  }

  async getQualityPhoto(params: {
    token: string
  }): Promise<QualityPhoto | null> {
    const image = await this.v5.apiDrivinglicenseV5GetqualityphotoGet({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.token.replace('Bearer ', ''),
    })

    return {
      data: image,
    }
  }

  async getHasQualitySignature(params: { token: string }): Promise<boolean> {
    const result = await this.v5.apiDrivinglicenseV5HasqualitysignatureGet({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.token.replace('Bearer ', ''),
    })
    return result > 0
  }

  async getQualitySignature(params: {
    token: string
  }): Promise<QualitySignature | null> {
    const image = await this.v5.apiDrivinglicenseV5GetqualitysignatureGet({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.token.replace('Bearer ', ''),
    })
    return {
      data: image,
    }
  }

  async getHasQualityScannedPhoto(params: { token: string }): Promise<boolean> {
    const res =
      await this.imageApiV5.apiImagecontrollerV5HasqualityscannedphotoGet({
        apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
        apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
        jwttoken: params.token.replace('Bearer ', ''),
      })

    return res > 0
  }

  async getAllPhotosFromThjodskra(params: {
    token: string
  }): Promise<ImagesFromThjodskraDto> {
    const res =
      await this.imageApiV5.apiImagecontrollerV5FromnationalregistryWithagerestrictionGet(
        {
          apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
          apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
          jwttoken: params.token.replace('Bearer ', ''),
        },
      )

    return res
  }

  async getAllDriverLicenses(
    token: string,
  ): Promise<DriverLicenseWithoutImagesDto[]> {
    return await this.v5.apiDrivinglicenseV5AllGet({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: token.replace('Bearer ', ''),
    })
  }
}
