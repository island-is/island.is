import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'
import {
  errorMessages,
  FIRST_GRADE_AGE,
  getApplicationAnswers,
  needsPayerApproval,
  TENTH_GRADE_AGE,
} from '@island.is/application/templates/new-primary-school'
import { ApplicationTypes } from '@island.is/application/types'
import {
  FriggClientService,
  GetOrganizationsByTypeTypeEnum,
} from '@island.is/clients/mms/frigg'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { SharedTemplateApiService } from '../../shared'
import {
  generateAssignPayerEmail,
  generatePayerApprovedApplicationEmail,
  generatePayerRejectedApplicationEmail,
} from './emailGenerators'
import { transformApplicationToNewPrimarySchoolDTO } from './new-primary-school.utils'

@Injectable()
export class NewPrimarySchoolService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly friggClientService: FriggClientService,
    private readonly nationalRegistryService: NationalRegistryXRoadService,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.NEW_PRIMARY_SCHOOL)
  }

  async getChildInformation({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const { childNationalId } = getApplicationAnswers(application.answers)

    if (!childNationalId) return undefined

    return await this.friggClientService.getUserById(auth, childNationalId)
  }

  async getChildren({ auth }: TemplateApiModuleActionProps) {
    const currentYear = new Date().getFullYear()
    const firstGradeYear = currentYear - FIRST_GRADE_AGE
    const tenthGradeYear = currentYear - TENTH_GRADE_AGE

    const children =
      await this.nationalRegistryService.getChildrenCustodyInformation(auth)

    // Check if the child is at primary school age and lives with the applicant
    const filteredChildren = children.filter((child) => {
      // Allow test children to pass through
      const validChildren = [
        '1111111119',
        '2222222229',
        '5555555559',
        '6666666669',
      ]
      if (
        (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) &&
        validChildren.includes(child.nationalId)
      ) {
        return true
      }

      if (!child.nationalId) {
        return false
      }

      const yearOfBirth = kennitala
        .info(child.nationalId)
        .birthday.getFullYear()

      return (
        child.livesWithApplicant &&
        yearOfBirth >= tenthGradeYear &&
        yearOfBirth <= firstGradeYear
      )
    })

    if (filteredChildren.length === 0) {
      throw new TemplateApiError(
        {
          title: errorMessages.noChildrenFoundTitle,
          summary: errorMessages.noChildrenFoundMessage,
        },
        400,
      )
    }

    return filteredChildren
  }

  async getPreferredSchool({
    auth,
    application,
  }: TemplateApiModuleActionProps) {
    const { childNationalId } = getApplicationAnswers(application.answers)

    if (!childNationalId) return undefined

    return await this.friggClientService.getPreferredSchool(
      auth,
      childNationalId,
    )
  }

  async sendApplication({ auth, application }: TemplateApiModuleActionProps) {
    const newPrimarySchoolDTO =
      transformApplicationToNewPrimarySchoolDTO(application)

    const response = await this.friggClientService.sendApplication(
      auth,
      newPrimarySchoolDTO,
    )

    if (needsPayerApproval(application)) {
      await this.sharedTemplateAPIService
        .sendEmail(generatePayerApprovedApplicationEmail, application)
        .catch((e) => {
          this.logger.error('Failed to send payer approved email', {
            e,
            applicationId: application.id,
          })
        })
    }

    return response
  }

  async assignPayer({ application }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService
      .sendEmail(generateAssignPayerEmail, application)
      .catch((e) => {
        this.logger.error('Failed to send assign payer email', {
          e,
          applicationId: application.id,
        })
      })
  }

  async notifyApplicantOfRejectionFromPayer({
    application,
  }: TemplateApiModuleActionProps) {
    await this.sharedTemplateAPIService
      .sendEmail(generatePayerRejectedApplicationEmail, application)
      .catch((e) => {
        this.logger.error('Failed to send payer rejected email', {
          e,
          applicationId: application.id,
        })
      })
  }

  async getSchools({ auth }: TemplateApiModuleActionProps) {
    return await this.friggClientService.getOrganizationsByType(auth, {
      type: GetOrganizationsByTypeTypeEnum.School,
    })
  }
}
