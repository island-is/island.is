import { Injectable } from '@nestjs/common'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { generateDrivingAssessmentApprovalEmail } from './emailGenerators'
import type { Item } from '@island.is/clients/payment'

const calculateNeedsHealthCert = (healthDeclaration = {}) => {
  return !!Object.values(healthDeclaration).find((val) => val === 'yes')
}

@Injectable()
export class DrivingLicenseSubmissionService {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async createCharge({
    application: { id, externalData },
    auth,
  }: TemplateApiModuleActionProps) {
    const parsedPaymentData = externalData.payment.data as Item
    return this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      id,
      parsedPaymentData.chargeItemCode,
    )
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { answers } = application
    const nationalId = application.applicant
    const needsHealthCert = calculateNeedsHealthCert(answers.healthDeclaration)
    const needsQualityPhoto = answers.willBringQualityPhoto === 'yes'
    const juristictionId = answers.juristiction

    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (isPayment.fulfilled) {
      const result = await this.drivingLicenseService
        .newDrivingLicense(nationalId, {
          juristictionId: juristictionId as number,
          needsToPresentHealthCertificate: needsHealthCert,
          needsToPresentQualityPhoto: needsQualityPhoto,
        })
        .catch((e) => {
          return {
            success: false,
            errorMessage: e.message,
          }
        })

      if (!result.success) {
        throw new Error(
          `Application submission failed (${result.errorMessage})`,
        )
      }

      return {
        success: result.success,
      }
    } else {
      throw new Error(
        'Ekki er búið að staðfesta greiðslu, hinkraðu þar til greiðslan er staðfest.',
      )
    }
  }

  async submitAssessmentConfirmation({
    application,
  }: TemplateApiModuleActionProps) {
    const { answers } = application
    const studentNationalId = (answers.student as { nationalId: string })
      .nationalId
    const teacherNationalId = application.applicant

    const result = await this.drivingLicenseService.newDrivingAssessment(
      studentNationalId as string,
      teacherNationalId,
    )

    if (result.success) {
      await this.sharedTemplateAPIService.sendEmail(
        generateDrivingAssessmentApprovalEmail,
        application,
      )
    } else {
      throw new Error(
        `Unexpected error (creating driver's license): '${result.errorMessage}'`,
      )
    }

    return {
      success: result.success,
    }
  }
}
