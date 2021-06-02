import { Injectable } from '@nestjs/common'
import get from 'lodash/get'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { generateDrivingAssessmentApprovalEmail } from './emailGenerators'

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
    application: { applicant, externalData, answers },
  }: TemplateApiModuleActionProps) {
    console.log('==== creating charge ====')
    console.log({ externalData })
    console.log({ answers })
    const result = await this.sharedTemplateAPIService
      .createCharge({
        chargeItemSubject: 'Fullnaðarskírteini',
        chargeType: 'atype',
        immediateProcess: true,
        charges: [
          {
            amount: 2000,
            chargeItemCode: 'someitemcode',
            priceAmount: 2,
            quantity: 2,
            reference: 'no idea',
          },
        ],
        payeeNationalID: applicant,
        performerNationalID: applicant,
        // sýslumannskennitala - úr juristictions
        performingOrgID: '0910815209',
        systemID: 'sysid',
        payInfo: {
          RRN: '',
          cardType: '',
          paymentMeans: '',
          authCode: '',
          PAN: '',
          payableAmount: 2000,
        },
      })
      .catch((e) => {
        console.error(e)

        return { error: e }
      })

    console.log({ result })

    return result
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const { answers } = application
    const nationalId = application.applicant

    const needsHealthCert = calculateNeedsHealthCert(answers.healthDeclaration)
    const juristictionId = answers.juristiction

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
