import { Inject, Injectable } from '@nestjs/common'
import {
  DrivingLicenseCategory,
  DrivingLicenseService,
  NewDrivingLicenseResult,
  Pickup,
} from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../../shared'
import { AttachmentS3Service } from '../../../shared/services'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  coreErrorMessages,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  ApplicationTypes,
  ApplicationWithAttachments,
  FormValue,
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  generateDrivingLicenseSubmittedEmail,
  generateDrivingAssessmentApprovalEmail,
} from './emailGenerators'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { FetchError } from '@island.is/clients/middlewares'
import { TemplateApiError } from '@island.is/nest/problem'
import { User } from '@island.is/auth-nest-tools'
import { DriverLicenseWithoutImages } from '@island.is/clients/driving-license'
import {
  PostTemporaryLicenseWithHealthDeclarationMapper,
  DrivingLicenseSchema,
} from './utils/healthDeclarationMapper'
import { formatPhoneNumber } from './utils'

const calculateNeedsHealthCert = (healthDeclaration = {}) => {
  return !!Object.values(healthDeclaration).find((val) => val === 'yes')
}

const getContentType = (fileName: string): string => {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? ''
  switch (ext) {
    case 'pdf':
      return 'application/pdf'
    case 'jpg':
    case 'jpeg':
      return 'image/jpeg'
    case 'png':
      return 'image/png'
    default:
      return 'application/octet-stream'
  }
}

@Injectable()
export class DrivingLicenseSubmissionService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    private readonly attachmentS3Service: AttachmentS3Service,
  ) {
    super(ApplicationTypes.DRIVING_LICENSE)
  }

  async createCharge({
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    const applicationFor = getValueViaPath<
      'B-full' | 'B-temp' | 'BE' | 'B-full-renewal-65'
    >(answers, 'applicationFor', 'B-full')

    const chargeItemCode =
      applicationFor === 'B-full'
        ? 'AY110'
        : applicationFor === 'BE'
        ? 'AY148'
        : applicationFor === 'B-full-renewal-65'
        ? 'AY113'
        : 'AY114'

    const response = await this.sharedTemplateAPIService.createCharge(
      auth,
      id,
      InstitutionNationalIds.SYSLUMENN,
      [{ code: chargeItemCode }],
    )

    // last chance to validate before the user receives a dummy
    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }

    return response
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    const { answers } = application
    const nationalId = application.applicant

    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      application.id,
    )

    if (!isPayment?.fulfilled) {
      return {
        success: false,
      }
    }

    let result
    try {
      result = await this.createLicense(nationalId, answers, auth, application)
    } catch (e) {
      this.log('error', 'Creating license failed', {
        e,
        applicationFor: answers.applicationFor,
        jurisdiction: answers.jurisdictionId,
      })

      if (e instanceof Error && e.name === 'FetchError') {
        const err = e as unknown as FetchError

        if (
          err.problem?.title === 'INSTRUCTOR_DOES_NOT_HAVE_BE_CATEGORY'
        ) {
          throw new TemplateApiError(
            {
              title: coreErrorMessages.failedDataProviderSubmit,
              summary:
                'Ökukennari er ekki með BE réttindi á ökuskírteini sínu. Vinsamlegast veldu annan ökukennara.',
            },
            400,
          )
        }

        throw new TemplateApiError(
          {
            title:
              err.problem?.title || coreErrorMessages.failedDataProviderSubmit,
            summary: err.problem?.detail || '',
          },
          err.status || 400,
        )
      }

      throw e
    }

    if (!result.success) {
      throw new Error(`Application submission failed (${result.errorMessage})`)
    }

    try {
      await this.sharedTemplateAPIService.sendEmail(
        generateDrivingLicenseSubmittedEmail,
        application,
      )
    } catch (e) {
      this.log(
        'error',
        'Could not send email to applicant after successful submission',
        { e },
      )
    }

    return {
      success: true,
    }
  }

  private log(lvl: 'error' | 'info', message: string, meta: unknown) {
    this.logger.log(lvl, `[driving-license-submission] ${message}`, meta)
  }

  private async createLicense(
    nationalId: string,
    answers: FormValue,
    auth: User,
    application: ApplicationWithAttachments,
  ): Promise<NewDrivingLicenseResult> {
    // If using fake data, skip calling RLS and pretend submission succeeded
    const useFakeData = getValueViaPath<'yes' | 'no'>(
      answers,
      'fakeData.useFakeData',
    )
    if (useFakeData === YES) {
      return {
        success: true,
        errorMessage: null,
      }
    }

    const applicationFor =
      getValueViaPath<'B-full' | 'B-temp' | 'BE' | 'B-full-renewal-65'>(
        answers,
        'applicationFor',
      ) ?? 'B-full'

    const needsHealthCert = calculateNeedsHealthCert(answers.healthDeclaration)
    const remarks = answers.hasHealthRemarks === 'yes'
    const needsQualityPhoto = answers.willBringQualityPhoto === 'yes'
    const jurisdictionId = Number(
      getValueViaPath(answers, 'delivery.jurisdiction'),
    )
    const teacher = answers.drivingInstructor as string
    const email = answers.email as string
    const deliveryMethod = getValueViaPath(answers, 'delivery.deliveryMethod')
    const phone = formatPhoneNumber(answers.phone as string)
    const setJurisdictionToKopavogur = 37

    const postHealthDeclaration = async (
      nationalId: string,
      answers: FormValue,
      auth: User,
    ) => {
      await this.drivingLicenseService
        .postHealthDeclaration(
          nationalId,
          PostTemporaryLicenseWithHealthDeclarationMapper(
            answers as DrivingLicenseSchema,
          ),
          auth.authorization.split(' ')[1] ?? '',
        )
        .catch((e) => {
          throw new Error(
            `Unexpected error (creating driver's license with health declarations): '${e}'`,
          )
        })
    }

    if (applicationFor === 'B-full-renewal-65') {
      return this.drivingLicenseService.renewDrivingLicense65AndOver(
        auth.authorization.replace('Bearer ', ''),
        {
          districtId: jurisdictionId
            ? jurisdictionId
            : setJurisdictionToKopavogur,
          ...(deliveryMethod
            ? {
                pickupPlasticAtDistrict: deliveryMethod === Pickup.DISTRICT,
                sendPlasticToPerson: deliveryMethod === Pickup.POST,
              }
            : {}),
        },
      )
    } else if (applicationFor === 'B-full') {
      return this.drivingLicenseService.newDrivingLicense(nationalId, {
        jurisdictionId: jurisdictionId
          ? jurisdictionId
          : setJurisdictionToKopavogur,
        sendLicenseInMail: deliveryMethod === Pickup.POST ? 1 : 0,
        needsToPresentHealthCertificate: needsHealthCert || remarks,
        needsToPresentQualityPhoto: needsQualityPhoto,
        licenseCategory:
          applicationFor === 'B-full'
            ? DrivingLicenseCategory.B
            : DrivingLicenseCategory.BE,
      })
    } else if (applicationFor === 'B-temp') {
      if (needsHealthCert) {
        await postHealthDeclaration(nationalId, answers, auth)
      }
      return this.drivingLicenseService.newTemporaryDrivingLicense(
        nationalId,
        auth.authorization.replace('Bearer ', ''),
        {
          jurisdictionId: jurisdictionId
            ? jurisdictionId
            : setJurisdictionToKopavogur,
          sendLicenseInMail: deliveryMethod === Pickup.POST ? true : false,
          needsToPresentHealthCertificate: needsHealthCert,
          needsToPresentQualityPhoto: needsQualityPhoto,
          teacherNationalId: teacher,
          email: email,
          phone: phone,
        },
      )
    } else if (applicationFor === 'BE') {
      const instructorSSN = getValueViaPath<string>(
        answers,
        'drivingInstructor',
      )
      const beEmail = getValueViaPath<string>(answers, 'email')
      const bePhone = formatPhoneNumber(
        getValueViaPath<string>(answers, 'phone') ?? '',
      )
      const selectedPhoto = getValueViaPath<string>(
        answers,
        'selectLicensePhoto',
      )

      // Determine photo biometric IDs based on user selection
      let photoBiometricsId: string | null = null
      let signatureBiometricsId: string | null = null

      if (selectedPhoto === 'qualityPhoto') {
        // User selected the RLS quality photo — verify it actually exists
        const qualityPhotoData = application.externalData
          ?.qualityPhotoAndSignature?.data as {
          pohto?: string | null
          imageTypeId?: number | null
        } | null

        if (!qualityPhotoData?.pohto) {
          this.log(
            'error',
            'User selected qualityPhoto but no quality photo exists in externalData',
            {},
          )
        }

        // Backend already has the quality photo — no biometric IDs needed
        photoBiometricsId = null
        signatureBiometricsId = null
      } else if (selectedPhoto) {
        // User selected a Thjodskra photo — validate against FACIAL entries only
        const allThjodskraPhotos =
          getValueViaPath<
            Array<{ biometricId: string; contentSpecification: string }>
          >(application.externalData, 'allPhotosFromThjodskra.data.images') ??
          []

        const facialPhotos = allThjodskraPhotos.filter(
          (p) => p.contentSpecification === 'FACIAL',
        )

        const isValidFacial = facialPhotos.some(
          (p) => p.biometricId === selectedPhoto,
        )

        if (!isValidFacial) {
          this.log(
            'error',
            'Selected photo biometricId does not match any FACIAL Thjodskra photo',
            { selectedPhoto },
          )
        }

        photoBiometricsId = isValidFacial ? selectedPhoto : null
        signatureBiometricsId = isValidFacial
          ? allThjodskraPhotos.find(
              (p) => p.contentSpecification === 'SIGNATURE',
            )?.biometricId ?? null
          : null
      }

      // Health certificate handling
      const healthDeclaration =
        getValueViaPath<Record<string, string>>(answers, 'healthDeclaration') ??
        {}
      const beNeedsHealthCert =
        calculateNeedsHealthCert(healthDeclaration) ||
        remarks ||
        getValueViaPath<boolean>(
          application.externalData,
          'glassesCheck.data',
        ) === true

      let contentList:
        | Array<{
            fileName: string
            fileExtension: string
            contentType: string
            content: string
            description: string
          }>
        | undefined

      if (beNeedsHealthCert) {
        try {
          const files = await this.attachmentS3Service.getFiles(application, [
            'healthCertificate',
          ])

          contentList = files
            .filter((f) => f.fileContent)
            .map((f) => {
              const rawExt = f.fileName.split('.').pop()?.toLowerCase() ?? ''
              const ext = rawExt === 'jpg' ? 'jpeg' : rawExt
              return {
                fileName: f.fileName,
                fileExtension: ext,
                contentType: getContentType(f.fileName),
                content: f.fileContent,
                description: 'Laeknisvottord',
              }
            })
        } catch (e) {
          this.log('error', 'Failed to read health certificate files from S3', {
            e,
          })
          throw e
        }

        if (!contentList || contentList.length === 0) {
          throw new TemplateApiError(
            {
              title: coreErrorMessages.failedDataProviderSubmit,
              summary:
                'Health certificate is required but no valid files were found',
            },
            400,
          )
        }
      }

      // Health declaration model — always sent for BE
      const healthDeclarationModel = {
        isDisabled: healthDeclaration?.isDisabled === 'yes',
        hasDiabetes: healthDeclaration?.hasDiabetes === 'yes',
        hasEpilepsy: healthDeclaration?.hasEpilepsy === 'yes',
        isAlcoholic: healthDeclaration?.isAlcoholic === 'yes',
        hasHeartDisease: healthDeclaration?.hasHeartDisease === 'yes',
        hasMentalIllness: healthDeclaration?.hasMentalIllness === 'yes',
        hasOtherDiseases: healthDeclaration?.hasOtherDiseases === 'yes',
        usesMedicalDrugs: healthDeclaration?.usesMedicalDrugs === 'yes',
        usesContactGlasses: healthDeclaration?.usesContactGlasses === 'yes',
        hasReducedPeripheralVision:
          healthDeclaration?.hasReducedPeripheralVision === 'yes',
      }

      return this.drivingLicenseService.applyForBELicense(
        nationalId,
        auth.authorization,
        {
          jurisdiction: jurisdictionId
            ? jurisdictionId
            : setJurisdictionToKopavogur,
          instructorSSN: instructorSSN ?? '',
          primaryPhoneNumber: bePhone,
          studentEmail: beEmail ?? '',
          contentList,
          photoBiometricsId,
          signatureBiometricsId,
          healthDeclarationModel,
        },
      )
    }

    throw new Error('application for unknown type of license')
  }

  async submitAssessmentConfirmation({
    application,
  }: TemplateApiModuleActionProps) {
    const { answers } = application
    const studentNationalId = (answers.student as { nationalId: string })
      .nationalId
    const teacherNationalId = application.applicant

    try {
      const result = await this.drivingLicenseService.newDrivingAssessment(
        studentNationalId as string,
        teacherNationalId,
      )

      if (result.success) {
        await this.sharedTemplateAPIService.sendEmail(
          generateDrivingAssessmentApprovalEmail,
          application,
        )
        return {
          success: result.success,
        }
      } else {
        throw new Error(
          `Unexpected error (creating driver's license): '${result.errorMessage}'`,
        )
      }
    } catch (e) {
      if (e instanceof Error && e.name === 'FetchError') {
        const err = e as unknown as FetchError
        throw new TemplateApiError(
          {
            title:
              err.problem?.title || coreErrorMessages.failedDataProviderSubmit,
            summary: err.problem?.detail || '',
          },
          400,
        )
      }
    }
  }

  async glassesCheck({ auth }: TemplateApiModuleActionProps): Promise<boolean> {
    const licences: DriverLicenseWithoutImages[] =
      await this.drivingLicenseService.getAllDriverLicenses(auth.authorization)
    const hasGlasses: boolean = licences.some((license) => {
      // Visual impairments comments on driving licenses are prefixed with "01."
      return !!license.comments?.some((comment) => comment.nr?.includes('01.'))
    })
    return hasGlasses
  }
}
