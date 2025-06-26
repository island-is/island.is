import { Inject, Injectable } from '@nestjs/common'
import {
  DrivingLicenseCategory,
  DrivingLicenseService,
  NewDrivingLicenseResult,
  Pickup,
} from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { coreErrorMessages, getValueViaPath } from '@island.is/application/core'
import {
  ApplicationTypes,
  BasicChargeItem,
  FormValue,
  InstitutionNationalIds,
} from '@island.is/application/types'
import {
  generateDrivingLicenseSubmittedEmail,
  generateDrivingAssessmentApprovalEmail,
} from './emailGenerators'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { BaseTemplateApiService } from '../../base-template-api.service'
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
  ) {
    super(ApplicationTypes.DRIVING_LICENSE)
  }

  async createCharge({
    application: { id, answers },
    auth,
    params,
  }: TemplateApiModuleActionProps) {
    // Determine the correct charge items based on application answers
    const applicationFor = getValueViaPath<
      'B-full' | 'B-temp' | 'BE' | 'B-full-renewal-65' | 'B-advanced'
    >(answers, 'applicationFor', 'B-full')
    const deliveryMethod = getValueViaPath<Pickup>(
      answers,
      'delivery.deliveryMethod',
    )

    // Determine the correct license charge item code
    const licenseChargeItemCode =
      applicationFor === 'B-full'
        ? 'AY110'
        : applicationFor === 'BE'
        ? 'AY115'
        : applicationFor === 'B-full-renewal-65'
        ? 'AY113'
        : 'AY114' // Default to B-temp

    // Build the expected charge items array
    const expectedChargeItems = [{ code: licenseChargeItemCode }]

    // Add delivery fee if applicable
    if (deliveryMethod === Pickup.POST) {
      expectedChargeItems.push({ code: 'AY145' }) // Delivery fee
    }

    // Validate the charge items if they were provided in params
    if (params?.chargeItems) {
      const providedChargeItems =
        typeof params.chargeItems === 'function'
          ? params.chargeItems(application)
          : params.chargeItems

      // Verify that the provided charge items match the expected ones
      this.validateChargeItems(providedChargeItems, expectedChargeItems)
    }

    // Always use the expected charge items to ensure security
    const response = await this.sharedTemplateAPIService.createCharge(
      auth,
      id,
      InstitutionNationalIds.SYSLUMENN,
      expectedChargeItems,
    )

    // Validate response
    if (!response?.paymentUrl) {
      throw new Error('paymentUrl missing in response')
    }

    return response
  }

  /**
   * Validates that the provided charge items match the expected ones
   * @param providedItems The charge items provided in the request
   * @param expectedItems The expected charge items based on application data
   */
  private validateChargeItems(
    providedItems: BasicChargeItem[],
    expectedItems: BasicChargeItem[],
  ): void {
    // Check if the arrays have the same length
    if (providedItems.length !== expectedItems.length) {
      this.log(
        'error',
        'Charge item validation failed: incorrect number of items',
        {
          providedItems,
          expectedItems,
        },
      )
      throw new Error('Invalid charge items: incorrect number of items')
    }

    // Create sets of charge item codes for easy comparison
    const providedCodes = new Set(providedItems.map((item) => item.code))
    const expectedCodes = new Set(expectedItems.map((item) => item.code))

    // Check if all expected codes are in the provided codes
    for (const code of expectedCodes) {
      if (!providedCodes.has(code)) {
        this.log(
          'error',
          'Charge item validation failed: missing required charge item',
          {
            missingCode: code,
            providedItems,
          },
        )
        throw new Error(
          `Invalid charge items: missing required charge item ${code}`,
        )
      }
    }

    // Check if there are any unexpected codes in the provided codes
    for (const code of providedCodes) {
      if (!expectedCodes.has(code)) {
        this.log(
          'error',
          'Charge item validation failed: unexpected charge item',
          {
            unexpectedCode: code,
            expectedItems,
          },
        )
        throw new Error(`Invalid charge items: unexpected charge item ${code}`)
      }
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<{ success: boolean }> {
    const { answers } = application
    const nationalId = application.applicant

    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth,
      application.id,
    )

    if (!isPayment?.fulfilled) {
      return {
        success: false,
      }
    }

    let result
    try {
      result = await this.createLicense(nationalId, answers, auth)
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
  ): Promise<NewDrivingLicenseResult> {
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
      const email = getValueViaPath<string>(answers, 'email')
      const phone = getValueViaPath<string>(answers, 'phone')
      return this.drivingLicenseService.applyForBELicense(
        nationalId,
        auth.authorization,
        {
          jurisdiction: jurisdictionId,
          instructorSSN: instructorSSN ?? '',
          primaryPhoneNumber: phone ?? '',
          studentEmail: email ?? '',
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
