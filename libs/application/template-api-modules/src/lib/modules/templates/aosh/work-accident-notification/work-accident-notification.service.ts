import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
// import {
//   employmentStatusOfTheVictim,
//   lengthOfEmployments,
//   victimsOccupationSubMajorGroup,
//   sizeOfEnterprises,
//   victimsOccupationMajorGroup,
//   workhourArrangements,
//   workingEnvironmentGroup,
//   workingEnvironmentSubGroup,
//   workplaceHealthAndSafety,
//   workStations,
//   absenceDueToAccident,
//   specificPhysicalActivityGroups,
//   victimOccupationMinorGroups,
//   activities,
//   deviationGroups,
//   deviations,
//   contactModesOfInjury,
//   typeOfInjuryGroups,
//   typeOfInjuries,
//   partOfBodyInjuredGroups,
//   partOfBodyInjured,
//   victimsOccupationUnitGroups,
// } from './work-accident-notification.mockData'
import {
  DataDto,
  WorkAccidentClientService,
} from '@island.is/clients/work-accident-ver'

@Injectable()
export class WorkAccidentNotificationTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly workAccidentClientService: WorkAccidentClientService,
  ) {
    super(ApplicationTypes.WORK_ACCIDENT_NOTIFICATION)
  }

  async getInputOptions({
    auth,
  }: TemplateApiModuleActionProps): Promise<DataDto> {
    const data = await this.workAccidentClientService.getOptionsData(auth)

    // const result = {
    //   sizeOfEnterprises,
    //   workplaceHealthAndSafety,
    //   workingEnvironmentGroup,
    //   workingEnvironmentSubGroup,
    //   workStations,
    //   employmentStatusOfTheVictim,
    //   lengthOfEmployments,
    //   workhourArrangements,
    //   victimsOccupationMajorGroup,
    //   victimsOccupationSubMajorGroup,
    //   absenceDueToAccident,
    //   specificPhysicalActivityGroups,
    //   victimOccupationMinorGroups,
    //   activities,
    //   deviationGroups,
    //   deviations,
    //   contactModesOfInjury,
    //   typeOfInjuryGroups,
    //   typeOfInjuries,
    //   partOfBodyInjuredGroups,
    //   partOfBodyInjured,
    //   victimsOccupationUnitGroups,
    // }

    return data
  }
}
