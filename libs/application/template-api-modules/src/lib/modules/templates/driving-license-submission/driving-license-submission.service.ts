import { Injectable } from '@nestjs/common'
import get from 'lodash/get'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'
import { generateDrivingAssessmentApprovalEmail } from './emailGenerators'
import type { Item } from '@island.is/clients/payment'

const calculateNeedsHealthCert = (healthDeclaration = {}) => {
  return !!Object.values(healthDeclaration).find((val) => val === 'yes')
}

interface Payment {
  chargeItemCode: string
  chargeItemName: string
  priceAmount: number
  performingOrgID: string
  chargeType: string
}

@Injectable()
export class DrivingLicenseSubmissionService {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async createCharge({
    application: { id, externalData },
    authorization,
  }: TemplateApiModuleActionProps) {
    const parsedPaymentData = externalData.payment.data as Item
    return this.sharedTemplateAPIService.createCharge(
      authorization,
      id,
      parsedPaymentData.chargeItemCode,
    )
  }

  async submitApplication({ application, authorization }: TemplateApiModuleActionProps) {
    const { answers } = application
    const nationalId = application.applicant
    const needsHealthCert = calculateNeedsHealthCert(answers.healthDeclaration)
    const juristictionId = answers.juristiction

    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(authorization, application.id)
    console.log('THIS IS PAYMENT FULFILLED ======', isPayment.fulfilled)

    if(isPayment.fulfilled) {

      const result = await this.drivingLicenseService
      .newDrivingLicense(nationalId, {
        juristictionId: juristictionId as number,
        needsToPresentHealthCertificate: needsHealthCert,
      })
      .catch((e) => {
        console.log(e.json)
        return {
          success: false,
          errorMessage: e.message,
        }
      })
      
      if (!result.success) {
        console.log('error inside submit application!!! submission service.')
        console.log(result)
        console.log(result.errorMessage)
        throw new Error(`Application submission failed (${result.errorMessage})`)
      }
      
      return {
        success: result.success,
      }
    } else {
      throw new Error('Ekki er búið að greiða fyrir umsóknina.')
    }
  }

  async submitAssessmentConfirmation({
    application,
  }: TemplateApiModuleActionProps) {
    const { answers } = application
    const studentNationalId = get(answers, 'student.nationalId')
    const teacherNationalId = application.applicant

    const result = await this.drivingLicenseService
      .newDrivingAssessment(studentNationalId as string, teacherNationalId)
      .catch((e) => {
        return {
          success: false,
          errorMessage: e.message,
        }
      })

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
