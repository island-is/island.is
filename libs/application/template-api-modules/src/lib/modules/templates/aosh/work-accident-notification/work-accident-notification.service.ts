import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  employmentStatusOfTheVictim,
  lengthOfEmployments,
  victimsOccupationSubMajorGroup,
  sizeOfEnterprises,
  victimsOccupationMajorGroup,
  workhourArrangements,
  workingEnvironmentGroup,
  workingEnvironmentSubGroup,
  workplaceHealthAndSafety,
  workStations,
  absenceDueToAccident,
  specificPhysicalActivityGroups,
  victimOccupationMinorGroups,
  activities,
  deviationGroups,
  deviations,
  contactModesOfInjury,
  typeOfInjuryGroups,
  typeOfInjuries,
  partOfBodyInjuredGroups,
  partOfBodyInjured,
  victimsOccupationUnitGroups,
} from './work-accident-notification.mockData'

@Injectable()
export class WorkAccidentNotificationTemplateService extends BaseTemplateApiService {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {
    super(ApplicationTypes.WORK_ACCIDENT_NOTIFICATION)
  }

  async getInputOptions({ auth }: TemplateApiModuleActionProps): Promise<any> {
    const result = {
      sizeOfEnterprises,
      workplaceHealthAndSafety,
      workingEnvironmentGroup,
      workingEnvironmentSubGroup,
      workStations,
      employmentStatusOfTheVictim,
      lengthOfEmployments,
      workhourArrangements,
      victimsOccupationMajorGroup,
      victimsOccupationSubMajorGroup,
      absenceDueToAccident,
      specificPhysicalActivityGroups,
      victimOccupationMinorGroups,
      activities,
      deviationGroups,
      deviations,
      contactModesOfInjury,
      typeOfInjuryGroups,
      typeOfInjuries,
      partOfBodyInjuredGroups,
      partOfBodyInjured,
      victimsOccupationUnitGroups,
    }

    return result
  }
}
