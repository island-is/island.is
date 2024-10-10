import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
import { WorkAccidentNotification } from '@island.is/application/templates/aosh/work-accident-notification'
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

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as unknown as WorkAccidentNotification

    await this.workAccidentClientService.createAccident(auth, {
      accidentForCreationDto: {
        companySSN: '', // TODO
        sizeOfEnterprise: 0, // TODO
        nameOfBranchOrDepartment: '', // TODO
        address: '', // TODO
        postcode: '', // TODO
        workplaceHealthAndSafety: [], // TODO
        buyersSSN: '', // TODO
        dateAndTimeOfAccident: new Date(), // TODO
        aoshCame: true, // TODO
        policeCame: true, // TODO
        numberOfVictims: 0, // TODO
        municipalityWhereAccidentOccured: '', // TODO
        specificLocationOfAccident: '', // TODO
        detailedDescriptionOfAccident: '', // TODO
        workingEnvironment: '', // TODO
        victims: [
          {
            victimsSSN: '',
            employmentStatusOfVictim: 0,
            employmentAgencySSN: '',
            startedEmploymentForCompany: new Date(),
            lengthOfEmployment: 0,
            percentageOfFullWorkTime: 0,
            workhourArrangement: 0,
            startOfWorkingDay: new Date(),
            workStation: 0,
            victimsOccupation: '',
            absenceDueToAccident: 0,
            specificPhysicalActivities: [],
            specificPhysicalActivityMostSevere: '',
            workDeviations: [],
            workDeviationMostSevere: '',
            contactModeOfInjuries: [],
            contactModeOfInjuryMostSevere: '',
            partsOfBodyInjured: [],
            partOfBodyInjuredMostSevere: '',
            typesOfInjury: [],
            typeOfInjuryMostSevere: '',
          },
        ], // TODO
        userPhoneNumber: '', // TODO
        userEmail: '', // TODO
      },
    })
  }
}
