import { Injectable } from '@nestjs/common'
import {
  CanApplyErrorCodeBFull,
  CanApplyForCategoryResult,
  DrivingAssessment,
  QualityPhoto,
} from '..'
import * as v4 from '../v4'
import * as v5 from '../v5'
import * as v6 from '../v6'
import {
  CanApplyErrorCodeBTemporary,
  CanApplyErrorCodeRenewal65,
  DriversLicense,
  QualitySignature,
  QualityPhotoAndSignature,
  RemarkCode,
  DrivingLicenseV4V5Dto,
  Jurisdiction,
  Remark,
} from './drivingLicenseApi.types'
import { handleCreateResponse } from './utils/handleCreateResponse'
import {
  DtoV6PracticePermitDto,
  DtoV6DriverLicenseWithoutImagesDto,
  DtoImagesFromThjodskraDto,
} from '../v6'

@Injectable()
export class DrivingLicenseApi {
  // v6 = caller-identity endpoints: RLS v6 dropped the jwttoken/ssn params and
  // derives the subject from the forwarded X-Road end-user token (see the
  // authSource:'context' v6 providers in apiConfiguration.ts).
  // v4 is KEPT for by-SSN / cross-subject / token-less lookups that v6 cannot
  // serve (getCurrentLicenseV4, getAllLicensesV4, getTeachersV4 and the
  // legacyGetCurrentLicense path). v5 is KEPT solely for the legacy 65+ submit
  // (postRenewLicenseOver65), whose endpoint was removed in v6 — drop it once
  // is65RenewalRedesignEnabled is permanently ON in prod.
  constructor(
    private readonly v4: v4.ApiV4,
    private readonly v6: v6.ApiV6,
    private readonly applicationV6: v6.ApplicationApiV6,
    private readonly v6CodeTable: v6.CodeTableV6,
    private readonly imageApiV6: v6.ImageApiV6,
    private readonly v5: v5.ApiV5,
  ) {}

  public async postTemporaryLicenseWithHealthDeclaratio(input: {
    nationalId: string
    token?: string
    healthDecleration: v6.ModelsV6PostTemporaryLicenseWithHealthDeclaration
  }): Promise<v6.DtoV6NewTemporaryLicsenseDto> {
    return this.v6.apiDrivinglicenseV6ApplicationsNewTemporarywithhealthdeclarationPost(
      {
        apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
        apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
        modelsV6PostTemporaryLicenseWithHealthDeclaration:
          input.healthDecleration,
      },
    )
  }

  public notifyOnPkPassCreation(_input: {
    nationalId: string
    token?: string
  }): Promise<void> {
    return this.v6.apiDrivinglicenseV6DigitallicensecreatedPost({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
    })
  }

  public async getRemarksCodeTable(): Promise<RemarkCode[] | null> {
    const codeTable = await this.v6CodeTable.apiCodetablesV6RemarksGet({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
    })
    if (!codeTable) return null
    return codeTable.map((c) => ({
      index: c.nr ?? '',
      name: c.heiti ?? '',
    }))
  }

  // Static, shared reference data (no jwttoken / national ID), so the full
  // catalogue is memoised once per instance. Empty and failed responses are not
  // cached, so a transient blip retries on the next call rather than disabling
  // descriptions on this pod until restart.
  private errorCodeDescriptionsCache?: Promise<v6.DtoErrorCodeDescriptionDto[]>

  public async getErrorCodeDescriptions(): Promise<
    v6.DtoErrorCodeDescriptionDto[]
  > {
    if (!this.errorCodeDescriptionsCache) {
      this.errorCodeDescriptionsCache = this.v6CodeTable
        .apiCodetablesV6ErrorCodesGet({
          apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
          apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
        })
        .then((codeTable) => {
          // A null/empty body (mirrors the guard in getRemarksCodeTable) is
          // almost certainly a transient blip rather than RLS having zero
          // codes, so don't memoise it — clear the cache and retry next call.
          if (!codeTable || codeTable.length === 0) {
            this.errorCodeDescriptionsCache = undefined
            return []
          }
          return codeTable
        })
        .catch((e) => {
          this.errorCodeDescriptionsCache = undefined
          throw e
        })
    }
    return this.errorCodeDescriptionsCache
  }

  // NOTE: name retained for caller stability (license-client PkPass). Now hits
  // v6 (caller-identity via forwarded token); rename to *V6 in the cleanup PR.
  public async getCurrentLicenseV5(_input: {
    nationalId: string
    token?: string
  }): Promise<v6.DtoV6DriverLicenseDto | null> {
    const skirteini = await this.v6.getCurrentLicenseV6({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
    })
    if (!skirteini || !skirteini.id) {
      return null
    }
    return skirteini
  }

  // KEPT on v4: by-SSN lookup for token-less / cross-subject contexts
  // (PkPass verify/pullUpdate). v6 has no by-SSN endpoint.
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

  public async getCurrentLicense(_input: {
    token: string
  }): Promise<DriversLicense> {
    const license = await this.v6.getCurrentLicenseV6({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
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

  // KEPT on v4: by-SSN lookup (teacher→student, token-less contexts).
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
        const remarks = await this.v6CodeTable.apiCodetablesV6RemarksGet({
          apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
          apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
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

  // KEPT on v4: by-SSN lookup (token-less student/admin contexts).
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

  // KEPT on v4: reference data (driving instructors), no caller identity needed.
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

  public async getDeprivation(_input: {
    nationalId: string
    token?: string
  }): Promise<v6.DtoV6DeprivationDto> {
    return await this.v6.apiDrivinglicenseV6DeprivationGet({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
    })
  }

  public async getIsTeacher(_params: { token: string }) {
    const statusStr = await this.v6.apiDrivinglicenseV6HasteachingrightsGet({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
    })

    // API says number, type says number, but deserialization happens with a text
    // deserializer (runtime.TextApiResponse).
    // Seems to be an outstanding bug? or I have no idea what I'm doing
    // See https://github.com/OpenAPITools/openapi-generator/issues/2870

    // TODO: try this as a number again
    // There still is indeed a TextApiResponse in the JSON response of the generated API
    return parseInt(statusStr.toString(), 10) > 0
  }

  public async getDrivingAssessment(_params: {
    token: string
  }): Promise<DrivingAssessment | null> {
    let assessment
    try {
      assessment = await this.v6.apiDrivinglicenseV6DrivingassessmentGet({
        apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
        apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
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
      await this.v6CodeTable.apiCodetablesV6DistrictsGet({
        apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
        apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
      })
    ).map(({ nr, postnumer, nafn }) => ({
      id: nr || 0,
      zip: postnumer || 0,
      name: nafn || '',
    }))
  }

  public async getHasFinishedOkugerdi(_params: {
    token: string
  }): Promise<boolean> {
    const res = await this.v6.apiDrivinglicenseV6Hasfinisheddrivingschool3Get({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
    })

    return Boolean(res.hasFinishedDrivingSchool3)
  }

  public async getCanApplyForCategoryFull(params: {
    category: string
    token: string
  }): Promise<CanApplyForCategoryResult<CanApplyErrorCodeBFull>> {
    const response = await this.v6.apiDrivinglicenseV6CanapplyforCategoryFullGet(
      {
        apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
        apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
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

  public async getCanApplyForRenewal65(_params: {
    token: string
  }): Promise<CanApplyForCategoryResult<CanApplyErrorCodeRenewal65>> {
    const response = await this.applicationV6.apiApplicationsV6CanapplyRenewal65Get(
      {
        apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
        apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
      },
    )

    return {
      result: !!response.result,
      errorCode: response.errorCode ?? undefined,
    }
  }

  public async getCanApplyForCategoryTemporary(_params: {
    token: string
  }): Promise<CanApplyForCategoryResult<CanApplyErrorCodeBTemporary>> {
    const response = await this.v6.apiDrivinglicenseV6CanapplyforTemporaryGet({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
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
    return await this.v6.apiDrivinglicenseV6DrivingassessmentPost({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
      modelsV6PostNewDrivingAssessment: {
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
    photoBiometricsId?: string | null
    signatureBiometricsId?: string | null
  }) {
    try {
      const response = await this.v6.apiDrivinglicenseV6ApplicationsNewTemporaryPost(
        {
          apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
          apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
          modelsV6PostTemporaryLicense: {
            bringsHealthCertificate: params.willBringHealthCertificate,
            bringNewPhoto: params.willBringQualityPhoto,
            instructorSSN: params.nationalIdTeacher,
            sendLicenseInMail: params.sendLicenseInMail,
            email: params.email,
            gsm: params.phone,
            authority: params.jurisdictionId,
            photoBiometricsId: params.photoBiometricsId,
            signatureBiometricsId: params.signatureBiometricsId,
          },
        },
      )
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
    const response = await this.v6.apiDrivinglicenseV6ApplicationsNewCategoryPost(
      {
        apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
        apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
        category: params.category,
        modelsV6PostNewFinalLicense: {
          authorityNumber: params.jurisdictionId,
          needsToPresentHealthCertificate: params.willBringHealthCertificate
            ? 1
            : 0,
          bringsNewPhoto: params.willBringQualityPhoto ? 1 : 0,
          sendLicenseInMail: params.sendLicenseInMail,
          sendToAddress: params.sendLicenseToAddress,
        },
      },
    )

    const handledResponse = handleCreateResponse(response)

    if (!handledResponse.success) {
      throw new Error(
        `POST apiOkuskirteiniApplicationsNewCategoryPost was not successful, response was: ${handledResponse.error}`,
      )
    }

    return handledResponse.success
  }

  async postApplyForRenewal65(params: {
    token: string
    districtId: number
    phoneNumber: string
    email: string
    pickupPlasticAtDistrict?: boolean
    sendPlasticToPerson?: boolean
    contentList?: v6.ContractsRLSApplicationSystemRLSApplicationContentModel[]
    photoBiometricsId?: string | null
    signatureBiometricsId?: string | null
  }): Promise<boolean> {
    const response = await this.applicationV6.apiApplicationsV6ApplyforRenewal65Post(
      {
        apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
        apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
        modelsV6PostRenewal65: {
          districtId: params.districtId,
          primaryPhoneNumber: params.phoneNumber,
          email: params.email,
          sendPlasticToPerson: params.sendPlasticToPerson,
          contentList: params.contentList,
          photoBiometricsId: params.photoBiometricsId,
          signatureBiometricsId: params.signatureBiometricsId,
          userId: v6.DRIVING_LICENSE_API_USER_ID,
        },
      },
    )

    return response.result ?? false
  }

  // Legacy 65+ submit endpoint, used when `is65RenewalRedesignEnabled` is OFF.
  // The v6 API removed this endpoint (and the PostRenewal65AndOver model), so
  // this method stays on the v5 client until the redesign flag has been fully
  // ON in prod long enough that no flag-OFF 65+ submissions reach this branch,
  // at which point this method and the v5 injection can be deleted.
  async postRenewLicenseOver65(params: {
    token: string
    districtId: number
    pickupPlasticAtDistrict?: boolean
    sendPlasticToPerson?: boolean
  }): Promise<v5.DtoV5Renewal65AndOver> {
    return await this.v5.apiDrivinglicenseV5ApplicationsRenewal65Post({
      apiVersion: v5.DRIVING_LICENSE_API_VERSION_V5,
      apiVersion2: v5.DRIVING_LICENSE_API_VERSION_V5,
      jwttoken: params.token.replace('Bearer ', ''),
      modelsV5PostRenewal65AndOver: {
        userId: v5.DRIVING_LICENSE_API_USER_ID,
        districtId: params.districtId,
        renewalDate: new Date(),
        pickupPlasticAtDistrict: params.pickupPlasticAtDistrict,
        sendPlasticToPerson: params.sendPlasticToPerson,
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
    contentList?: v6.ContractsRLSApplicationSystemRLSApplicationContentModel[]
    photoBiometricsId?: string | null
    signatureBiometricsId?: string | null
    sendPlasticToPerson?: boolean
    healthDeclarationModel: v6.ModelsHealthDeclarationModel
  }): Promise<boolean> {
    const response = await this.applicationV6.apiApplicationsV6ApplyforBePost({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
      modelsV6PostApplicationForBEModel: {
        districtId: params.jurisdictionId,
        instructorSSN: params.instructorSSN,
        primaryPhoneNumber: params.phoneNumber,
        studentEmail: params.email,
        contentList: params.contentList,
        photoBiometricsId: params.photoBiometricsId,
        signatureBiometricsId: params.signatureBiometricsId,
        sendPlasticToPerson: params.sendPlasticToPerson,
        healthDeclaration: params.healthDeclarationModel,
      },
    })

    return response.result ?? false
  }

  async postCanApplyForPracticePermit(params: {
    token: string
    studentSSN: string
  }): Promise<DtoV6PracticePermitDto> {
    return await this.v6.apiDrivinglicenseV6CanapplyforPracticepermitPost({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
      modelsV6PostPracticePermit: {
        dateFrom: new Date(),
        studentSSN: params.studentSSN,
        userId: v6.DRIVING_LICENSE_API_USER_ID,
      },
    })
  }

  async postPracticePermitApplication(params: {
    token: string
    studentSSN: string
  }): Promise<DtoV6PracticePermitDto> {
    return await this.v6.apiDrivinglicenseV6ApplicationsPracticepermitPost({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
      modelsV6PostPracticePermit: {
        dateFrom: new Date(),
        studentSSN: params.studentSSN,
        userId: v6.DRIVING_LICENSE_API_USER_ID,
      },
    })
  }

  async postApplicationNewCollaborative(params: {
    token: string
    districtId: number
    stolenOrLost: boolean
    pickUpLicense: boolean
    imageBiometricsId: string | null
    signatureBiometricsId: string | null
  }): Promise<number> {
    const {
      districtId,
      stolenOrLost,
      pickUpLicense,
      imageBiometricsId,
      signatureBiometricsId,
    } = params
    return await this.v6.apiDrivinglicenseV6ApplicationsNewCollaborativePost({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
      modelsV6PostNewCollaborative: {
        districtId,
        licenseStolenOrLost: stolenOrLost,
        userId: v6.DRIVING_LICENSE_API_USER_ID,
        pickUpLicense,
        photoBiometricsId: imageBiometricsId,
        signatureBiometricsId,
      },
    })
  }

  async getHasQualityPhoto(_params: { token: string }): Promise<boolean> {
    const result = await this.imageApiV6.apiImagecontrollerV6HasqualityphotoGet(
      {
        apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
        apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
      },
    )

    return result > 0
  }

  async getQualityPhoto(_params: {
    token: string
  }): Promise<QualityPhoto | null> {
    const image = await this.imageApiV6.apiImagecontrollerV6GetqualityphotoGet({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
    })

    return {
      data: image,
    }
  }

  async getHasQualitySignature(_params: { token: string }): Promise<boolean> {
    const result = await this.imageApiV6.apiImagecontrollerV6HasqualitysignatureGet(
      {
        apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
        apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
      },
    )
    return result > 0
  }

  async getQualitySignature(_params: {
    token: string
  }): Promise<QualitySignature | null> {
    const image = await this.imageApiV6.apiImagecontrollerV6GetqualitysignatureGet(
      {
        apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
        apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
      },
    )
    return {
      data: image,
    }
  }

  async getQualityPhotoAndSignature(_params: {
    token: string
  }): Promise<QualityPhotoAndSignature | null> {
    try {
      const res = await this.imageApiV6.apiImagecontrollerV6GetqualityphotoandsignatureGet(
        {
          apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
          apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
        },
      )

      return {
        imageId: res.imageId ?? null,
        imageTypeId: res.imageTypeId ?? null,
        imageTypeName: res.imageTypeName ?? null,
        imageDate: res.imageDate ?? null,
        pohto: res.photo ?? null,
        signatureId: res.signatureId ?? null,
        signatureTypeId: res.signatureTypeId ?? null,
        signatureTypeName: res.signatureTypeName ?? null,
        signatureDate: res.signatureDate ?? null,
        signature: res.signature ?? null,
      }
    } catch {
      return null
    }
  }

  async getHasQualityScannedPhoto(_params: {
    token: string
  }): Promise<boolean> {
    const res = await this.imageApiV6.apiImagecontrollerV6HasqualityscannedphotoGet(
      {
        apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
        apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
      },
    )

    return res > 0
  }

  async getAllPhotosFromThjodskra(_params: {
    token: string
  }): Promise<DtoImagesFromThjodskraDto> {
    const res = await this.imageApiV6.apiImagecontrollerV6FromnationalregistryWithagerestrictionGet(
      {
        apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
        apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
      },
    )

    return res
  }

  async getAllDriverLicenses(
    _token: string,
  ): Promise<DtoV6DriverLicenseWithoutImagesDto[]> {
    return await this.v6.apiDrivinglicenseV6AllGet({
      apiVersion: v6.DRIVING_LICENSE_API_VERSION_V6,
      apiVersion2: v6.DRIVING_LICENSE_API_VERSION_V6,
    })
  }
}
