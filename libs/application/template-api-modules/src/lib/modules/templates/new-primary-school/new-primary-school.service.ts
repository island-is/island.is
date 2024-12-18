import { NationalRegistryXRoadService } from '@island.is/api/domains/national-registry-x-road'
import {
  errorMessages,
  getApplicationAnswers,
} from '@island.is/application/templates/new-primary-school'
import { ApplicationTypes } from '@island.is/application/types'
import { FriggClientService } from '@island.is/clients/mms/frigg'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { Inject, Injectable } from '@nestjs/common'
import * as kennitala from 'kennitala'
import { TemplateApiModuleActionProps } from '../../../types'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { transformApplicationToNewPrimarySchoolDTO } from './new-primary-school.utils'
import { isRunningOnEnvironment } from '@island.is/shared/utils'

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

    if (!childNationalId) {
      return undefined
    }

    return await this.friggClientService.getUserById(auth, childNationalId)
  }

  async getChildren({ auth }: TemplateApiModuleActionProps) {
    if (isRunningOnEnvironment('dev')) {
      if (auth.nationalId === '0101303019') {
        return [
          {
            nationalId: '1111111119',
            fullName: 'Stubbur Maack',
            genderCode: '3',
            livesWithApplicant: true,
            livesWithBothParents: true,
          },
        ]
      }
      if (auth.nationalId === '0101302989') {
        return [
          {
            nationalId: '2222222229',
            fullName: 'Stúfur Maack ',
            genderCode: '3',
            livesWithApplicant: true,
            livesWithBothParents: true,
            otherParent: {
              nationalId: '0101302399',
              fullName: 'Gervimaður Færeyjar',
              address: {
                streetName: 'Hvassaleiti 5',
                postalCode: '103',
                city: 'Reykjavík',
                municipalityCode: '0000',
              },
              genderCode: '2',
            },
          },
          {
            nationalId: '5555555559',
            fullName: 'Bína Maack ',
            genderCode: '4',
            livesWithApplicant: true,
            livesWithBothParents: true,
          },
          {
            nationalId: '6666666669',
            fullName: 'Snúður Maack',
            genderCode: '3',
            livesWithApplicant: true,
            livesWithBothParents: true,
          },
        ]
      }
      if (auth.nationalId === '0101304929') {
        return [
          {
            nationalId: '6666666669',
            fullName: 'Snúður Maack',
            genderCode: '3',
            livesWithApplicant: true,
            livesWithBothParents: true,
          },
        ]
      }
    }
    const children =
      await this.nationalRegistryService.getChildrenCustodyInformation(auth)

    const currentYear = new Date().getFullYear()
    const maxYear = currentYear - 7 // 2nd grade
    const minYear = currentYear - 16 // 10th grade

    // Check if the child is at primary school age and lives with the applicant
    const filteredChildren = children.filter((child) => {
      // Allow children to pass through
      const validChildren = [
        '1111111119',
        '2222222229',
        '5555555559',
        '6666666669',
      ]
      if (
        isRunningOnEnvironment('local') &&
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

  async sendApplication({ auth, application }: TemplateApiModuleActionProps) {
    const newPrimarySchoolDTO =
      transformApplicationToNewPrimarySchoolDTO(application)

    return await this.friggClientService.sendApplication(
      auth,
      newPrimarySchoolDTO,
    )
  }
}
