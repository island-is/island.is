import { Injectable } from '@nestjs/common'
import {
  DrivingLicenseService,
  NewDrivingLicenseResult,
} from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { generateDrivingAssessmentApprovalEmail } from './emailGenerators'
import { FormValue } from '@island.is/application/core'

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
    application: { id, answers },
    auth,
  }: TemplateApiModuleActionProps) {
    // TODO: this logic should really be shared between the application and
    // this function right here, one way or another...
    const applicationFor = answers.applicationFor || 'B-full'
    const chargeItemCode = applicationFor === 'B-full' ? 'AY110' : 'AY114'

    return this.sharedTemplateAPIService.createCharge(
      auth.authorization,
      id,
      chargeItemCode,
    )
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { answers } = application
    const nationalId = application.applicant

    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      auth.authorization,
      application.id,
    )

    if (isPayment?.fulfilled) {
      const result = await this.createLicense(nationalId, answers).catch(
        (e) => {
          return {
            success: false,
            errorMessage: e.message,
          }
        },
      )

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

  private async createLicense(
    nationalId: string,
    answers: FormValue,
  ): Promise<NewDrivingLicenseResult> {
    const applicationFor = answers.applicationFor || 'B-full'

    const needsHealthCert = calculateNeedsHealthCert(answers.healthDeclaration)
    const needsQualityPhoto = answers.willBringQualityPhoto === 'yes'
    const juristictionId = answers.juristiction
    const teacher = answers.drivingInstructor as string

    if (applicationFor === 'B-full') {
      return this.drivingLicenseService.newDrivingLicense(nationalId, {
        juristictionId: juristictionId as number,
        needsToPresentHealthCertificate: needsHealthCert,
        needsToPresentQualityPhoto: needsQualityPhoto,
      })
    } else if (applicationFor === 'B-temp') {
      return this.drivingLicenseService.newTemporaryDrivingLicense(nationalId, {
        juristictionId: juristictionId as number,
        needsToPresentHealthCertificate: needsHealthCert,
        needsToPresentQualityPhoto: needsQualityPhoto,
        teacherNationalId: teacher,
      })
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
