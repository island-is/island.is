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
    let children =
      await this.nationalRegistryService.getChildrenCustodyInformation(auth)

    const currentYear = new Date().getFullYear()
    const maxYear = currentYear - 7 // 2nd grade
    const minYear = currentYear - 16 // 10th grade

    // Mock test children
    if (isRunningOnEnvironment('local') || isRunningOnEnvironment('dev')) {
      // If Gervimaður Afríka
      // else others
      if (auth.audkenniSimNumber == '0103019') {
        children = [
          {
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '2007104360',
            livesWithApplicant: true,
            fullName: 'Elsa Inga Bergdísardóttir Wilson',
            genderCode: '2',
          },
          {
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '2203122590',
            livesWithApplicant: true,
            fullName: 'Ylur Poncet Maximesson',
            genderCode: '1',
          },
          {
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '1810183720',
            livesWithApplicant: true,
            fullName: 'Bríet Alva Þorsteinsdóttir',
            genderCode: '2',
          },
          {
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '1007112730',
            livesWithApplicant: true,
            fullName: 'Ægir Daðason',
            genderCode: '1',
          },
          {
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '1311132690',
            livesWithApplicant: true,
            fullName: 'Hafdís Arna Gunnarsdóttir',
            genderCode: '2',
          },
        ]
      } else {
        children = [
          {
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '0801093420',
            livesWithApplicant: true,
            fullName: 'Júlía Huld Birkisdóttir',
            genderCode: '2',
          },
          {
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '0801093690',
            livesWithApplicant: true,
            fullName: 'Hilmar Atli Birkisson',
            genderCode: '1',
          },
          {
            // eslint-disable-next-line local-rules/disallow-kennitalas
            nationalId: '1311143460',
            livesWithApplicant: true,
            fullName: 'Hrannar Árni Birkisson',
            genderCode: '2',
          },
          {
            nationalId: '1111111119',
            livesWithApplicant: true,
            fullName: 'Stubbur Maack',
            genderCode: '1',
          },
          {
            nationalId: '2222222229',
            livesWithApplicant: true,
            fullName: 'Stúfur Maack',
            genderCode: '1',
          },
          {
            nationalId: '5555555559',
            livesWithApplicant: true,
            fullName: 'Bína Maack',
            genderCode: '2',
          },
          {
            nationalId: '6666666669',
            livesWithApplicant: true,
            fullName: 'Snúður Maack',
            genderCode: '10',
          },
        ]
      }
    }

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

  async sendApplication({ auth, application }: TemplateApiModuleActionProps) {
    const newPrimarySchoolDTO =
      transformApplicationToNewPrimarySchoolDTO(application)

    return await this.friggClientService.sendApplication(
      auth,
      newPrimarySchoolDTO,
    )
  }
}
