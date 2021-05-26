import { Injectable } from '@nestjs/common'
import get from 'lodash/get'
import { DrivingLicenseService } from '@island.is/api/domains/driving-license'

import { SharedTemplateApiService } from '../../shared'
import { TemplateApiModuleActionProps } from '../../../types'

import { generateDrivingAssessmentApprovalEmail } from './emailGenerators'
import { User } from '@island.is/api/domains/national-registry'

const calculateNeedsHealthCert = (healthDeclaration = {}) => {
  return !!Object.values(healthDeclaration).find((val) => val === 'yes')
}

@Injectable()
export class DrivingLicenseSubmissionService {
  constructor(
    private readonly drivingLicenseService: DrivingLicenseService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {}

  async submitApplication({
    application,
  }: TemplateApiModuleActionProps) {
    const { answers, externalData } = application
    const { nationalRegistry } = externalData
    const applicant = nationalRegistry.data

    const needsHealthCert = calculateNeedsHealthCert(answers.healthDeclaration)
    const juristictionId = answers.juristiction

    const result = await this.drivingLicenseService
      .newDrivingLicense((applicant as User).nationalId, {
        juristictionId: juristictionId as number,
        needsToPresentHealthCertificate: needsHealthCert,
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
    const { answers, externalData } = application
    const studentNationalId = get(answers, 'student.nationalId')
    const { nationalRegistry } = externalData
    const applicant = nationalRegistry.data

    const result = await this.drivingLicenseService
      .newDrivingAssessment(studentNationalId as string, (applicant as User).nationalId)

    if (result.success) {
      await this.sharedTemplateAPIService.sendEmail(
        generateDrivingAssessmentApprovalEmail,
        application,
      )
    } else {
      throw new Error('No success result from QUERY_NEW_DRIVING_ASSESSMENT')
    }

    return {
      success: result.success,
    }
  }
}
