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
  Application,
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
        ? 'AY115'
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
    application: Application,
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

    // Determine photo selection
    const selectedPhoto = getValueViaPath<string>(answers, 'selectLicensePhoto')
    const needsQualityPhoto =
      selectedPhoto === 'bringNewPhoto' ||
      answers.willBringQualityPhoto === 'yes'

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
      // Read uploaded health certificate if present
      let healtCertificate: string | null = null
      const healthCertFiles = getValueViaPath<
        Array<{ key: string; name: string }>
      >(answers, 'healthCertificate')

      if (healthCertFiles?.length) {
        try {
          const files = await this.attachmentS3Service.getFiles(
            application as ApplicationWithAttachments,
            ['healthCertificate'],
          )
          const firstFile = files.find((f) => f.fileContent)
          if (firstFile) {
            healtCertificate = firstFile.fileContent
          }
        } catch (e) {
          this.log('error', 'Failed to read health certificate files for 65+', {
            e,
          })
        }
      }

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
          ...(healtCertificate ? { healtCertificate } : {}),
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
        licenseCategory: DrivingLicenseCategory.B,
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
      const bePhone = getValueViaPath<string>(answers, 'phone')

      // Determine biometric IDs from photo selection
      const imageBiometricsId =
        !selectedPhoto ||
        selectedPhoto === 'qualityPhoto' ||
        selectedPhoto === 'fakePhoto' ||
        selectedPhoto === 'bringNewPhoto'
          ? null
          : selectedPhoto

      const allThjodskraPhotos = getValueViaPath<
        { biometricId: string; contentSpecification: string }[]
      >(application.externalData, 'allPhotosFromThjodskra.data.images', [])

      const signatureBiometricsId = imageBiometricsId
        ? allThjodskraPhotos?.find(
            (p) => p.contentSpecification === 'SIGNATURE',
          )?.biometricId ?? null
        : null

      // Get health certificate files if uploaded
      let contentList = null
      if (needsHealthCert || remarks) {
        const healthCertFiles = getValueViaPath<
          Array<{ key: string; name: string }>
        >(answers, 'healthCertificate')

        if (healthCertFiles?.length) {
          try {
            const files = await this.attachmentS3Service.getFiles(
              application as ApplicationWithAttachments,
              ['healthCertificate'],
            )

            contentList = files
              .filter((f) => f.fileContent)
              .map((f) => {
                const ext = f.fileName.split('.').pop() ?? ''
                return {
                  fileName: f.fileName,
                  fileExtension: ext,
                  contentType:
                    ext === 'pdf' ? 'application/pdf' : `image/${ext}`,
                  content: f.fileContent,
                  description: 'Læknisvottorð',
                }
              })
          } catch (e) {
            this.log('error', 'Failed to read health certificate files', { e })
          }
        }
      }

      return this.drivingLicenseService.applyForBELicense(
        nationalId,
        auth.authorization,
        {
          jurisdiction: jurisdictionId,
          instructorSSN: instructorSSN ?? '',
          primaryPhoneNumber: bePhone ?? '',
          studentEmail: beEmail ?? '',
          contentList: contentList?.length ? contentList : undefined,
          photoBiometricsId: imageBiometricsId,
          signatureBiometricsId: signatureBiometricsId,
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
