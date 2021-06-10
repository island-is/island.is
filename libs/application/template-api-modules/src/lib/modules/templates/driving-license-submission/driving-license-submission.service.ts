import { Injectable } from '@nestjs/common'
import get from 'lodash/get'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { generateDrivingAssessmentApprovalEmail } from './emailGenerators'
import { ChargeResult } from '@island.is/api/domains/payment'

//import { PaymentService } from '../../../../../../../../apps/application-system/api/src/app/modules/payment/payment.service'
//import { PaymentService as ApiDomainsPaymentService } from '@island.is/api/domains/payment'
import { resolveModelGetter } from 'sequelize-typescript'

const calculateNeedsHealthCert = (healthDeclaration = {}) => {
  return !!Object.values(healthDeclaration).find((val) => val === 'yes')
}

interface Payment {
  chargeItemCode: string,
  chargeItemName: string,
  priceAmount: number,
  performingOrgID: string,
  chargeType: string,
}

@Injectable()
export class DrivingLicenseSubmissionService {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
    //private readonly apiDomainsPaymentService: ApiDomainsPaymentService,
  ) {}

  async createCharge({
    application: { applicant, externalData, answers, id },
  }: TemplateApiModuleActionProps) {
    console.log('==== creating charge ====')
    console.log({ externalData })
    console.log({ answers })

    const payment = (externalData.payment.data as Payment)

    const chargeItem = {
      chargeItemCode: payment.chargeItemCode,
      quantity: 1,
      priceAmount: payment.priceAmount,
      amount: payment.priceAmount * 1,
      reference: 'Vinnslugjald',
    }

    const result = await this.sharedTemplateAPIService
      .createCharge({
        chargeItemSubject: 'Fullnaðarskírteini',
        chargeType: payment.chargeType,
        immediateProcess: true,
        charges: [
          chargeItem,
        ],
        payeeNationalID: applicant,
        // TODO: possibly somebody else, if 'umboð'
        performerNationalID: applicant,
        // TODO: sýslumannskennitala - úr juristictions
        performingOrgID: payment.performingOrgID,
        systemID: 'ISL',
      }, id)
      .catch((e) => {
        console.log('submission service error.')
        console.error(e)

        return ({ error: e } as ChargeResult)
      })

    if (result.error || !result.success) {
      throw new Error('Villa kom upp við að stofna til greiðslu')
    }

    console.log({ result })

    return result
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const { answers } = application
    const { externalData } = application
    const nationalId = application.applicant

    const payment = (externalData.payment.data as Payment)

    const needsHealthCert = calculateNeedsHealthCert(answers.healthDeclaration)
    const juristictionId = answers.juristiction

    
    // const res = await this.apiPaymentService
    //   .createPayment({
    //     applicationId: application.id,
    //     fulfilled: false,
    //     user4: '',
    //     definition: '',
    //     amount: payment.priceAmount,
    //     expiresAt: new Date(calcExpiration)
    //   })
    //   .catch((e) => {
    //     return {
    //       success: false,
    //       errorMessage: e.message,
    //     }
    //   })
    // const res = await this.apiDomainsPaymentService
    //   .createCharge({
    //     systemID: 'ISL',
    //     performingOrgID: payment.performingOrgID,
    //     payeeNationalID: nationalId,
    //     chargeType: payment.chargeType,
    //     chargeItemSubject: payment.chargeItemName,
    //     performerNationalID: payment.performingOrgID,
    //     immediateProcess: true,
    //     charges: [],
    //   })

    const result = await this.drivingLicenseService
      .newDrivingLicense(nationalId, {
        juristictionId: juristictionId as number,
        needsToPresentHealthCertificate: needsHealthCert,
      })
      .catch((e) => {
        return {
          success: false,
          errorMessage: e.message,
        }
      })

    if (!result.success) {
      throw new Error(`Application submission failed (${result.errorMessage})`)
    }

    return {
      success: result.success,
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
