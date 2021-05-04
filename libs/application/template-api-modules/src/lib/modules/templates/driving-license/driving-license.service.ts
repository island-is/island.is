import { Injectable } from '@nestjs/common'
import get from 'lodash/get'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { generateDrivingAssessmentApprovalEmail } from './emailGenerators'

const calculateNeedsHealthCert = (healthDeclaration = {}) => {
  return !!Object.values(healthDeclaration).find((val) => val === 'yes')
}

@Injectable()
export class DrivingLicenseService {
  constructor(
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async submitApplication({
    authorization,
    application
  }: TemplateApiModuleActionProps) {
    const { answers } = application

    const needsHealthCert = calculateNeedsHealthCert(answers.healthDeclaration)
    const juristictionId = answers.juristiction

    const QUERY_NEW_DRIVING_LICENSE = `
      mutation {
        drivingLicenseNewDrivingLicense(input: {
          needsToPresentHealthCertificate: ${needsHealthCert},
          juristictionId: ${juristictionId},
        }) {
          success
          errorMessage
        }
      }
    `

    const result = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, QUERY_NEW_DRIVING_LICENSE)
      .then((response) => response.json())
      .then((res) => {
        if (res.errors) {
          const {
            errors: [ firstError ]
          } = res

          throw new Error(firstError)
        }

        return res.data.drivingLicenseNewDrivingLicense
      })

    if (!result?.success) {
      throw new Error(result?.errorMessage || 'Error submitting application')
    }

    return {
      success: result.success,
    }
  }

  async submitAssessmentConfirmation({
    authorization,
    application
  }: TemplateApiModuleActionProps) {
    const studentNationalId = get(application.answers, 'student.nationalId')
    const QUERY_NEW_DRIVING_ASSESSMENT = `
      mutation {
        drivingLicenseNewDrivingAssessment(input: {
          studentNationalId: "${studentNationalId}",
        }) {
          success
        }
      }
    `

    const result = await this.sharedTemplateAPIService
      .makeGraphqlQuery(authorization, QUERY_NEW_DRIVING_ASSESSMENT)
      .then((response) => response.json())
      .catch((e) => e)

    if (result.success) {
      await this.sharedTemplateAPIService.sendEmail(
        generateDrivingAssessmentApprovalEmail,
        application,
      )
    } else {
      console.log(result.errors[0].extensions)
      throw new Error('No success result from QUERY_NEW_DRIVING_ASSESSMENT')
    }

    return {
      success: result.success,
    }
  }
}
