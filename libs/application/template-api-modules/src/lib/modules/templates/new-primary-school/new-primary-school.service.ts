import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'
import {
  errorMessages,
  getApplicationAnswers,
  getOtherGuardian,
  getSelectedChild,
} from '@island.is/application/templates/new-primary-school'
import { ApplicationTypes } from '@island.is/application/types'
import { FriggClientService } from '@island.is/clients/mms/frigg'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { isRunningOnEnvironment } from '@island.is/shared/utils'
import { Inject, Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { transformApplicationToNewPrimarySchoolDTO } from './new-primary-school.utils'

@Injectable()
export class NewPrimarySchoolService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly friggClientService: FriggClientService,
    private readonly nationalRegistryService: NationalRegistryXRoadService,
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
    const maxYear = currentYear - 7 // 2nd grade
    const minYear = currentYear - 16 // 10th grade

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
        yearOfBirth >= minYear &&
        yearOfBirth <= maxYear
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

  async getCitizenship({ application }: TemplateApiModuleActionProps) {
    const child = getSelectedChild(
      application.answers,
      application.externalData,
    )
    const guardian = getOtherGuardian(
      application.answers,
      application.externalData,
    )

    let childCitizenshipCode = ''
    if (child) {
      const citizenship = await this.nationalRegistryService.getCitizenship(
        child.nationalId,
      )

      childCitizenshipCode = citizenship?.code || ''
    }

    let otherGuardianCitizenshipCode = ''
    if (guardian) {
      const citizenship = await this.nationalRegistryService.getCitizenship(
        guardian.nationalId,
      )

      otherGuardianCitizenshipCode = citizenship?.code || ''
    }

    return {
      childCitizenshipCode,
      otherGuardianCitizenshipCode,
    }
  }

  async sendApplication({ auth, application }: TemplateApiModuleActionProps) {
    const newPrimarySchoolDTO =
      transformApplicationToNewPrimarySchoolDTO(application)

    console.log('Sending application with DTO:', newPrimarySchoolDTO)
    // throw new Error('This is a placeholder error for debugging purposes.')
    return await this.friggClientService.sendApplication(
      auth,
      newPrimarySchoolDTO,
    )
  }
}
