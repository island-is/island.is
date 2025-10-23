import { Inject, Injectable } from '@nestjs/common'
import {
  DrivingLicenseCategory,
  DrivingLicenseService,
  NewDrivingLicenseResult,
  Pickup,
} from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import {
  coreErrorMessages,
  getValueViaPath,
  YES,
} from '@island.is/application/core'
import {
  ApplicationTypes,
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
