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
import { getDateAndTime } from './work-accident-notification.utils'

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
        companySSN: answers.companyInformation.nationalId,
        sizeOfEnterprise: parseInt(
          answers.companyInformation.numberOfEmployees,
          10,
        ),
        nameOfBranchOrDepartment: answers.companyInformation.nameOfBranch,
        address: answers.companyInformation.address,
        postcode: answers.companyInformation.postnumber,
        workplaceHealthAndSafety:
          answers.companyLaborProtection.workhealthAndSafetyOccupation?.map(
            (code: string) => {
              return parseInt(code, 10)
            },
          ),
        buyersSSN: '', // TODO ????
        dateAndTimeOfAccident: getDateAndTime(
          answers.accident.date,
          answers.accident.time.split(':')[0],
          answers.accident.time.split(':')[1],
        ),
        aoshCame: answers.accident.didAoshCome === 'yes',
        policeCame: answers.accident.didPoliceCome === 'yes',
        numberOfVictims: answers.employee.length,
        municipalityWhereAccidentOccured: answers.accident.municipality, // Vilja þau code eða name til baka?
        specificLocationOfAccident: answers.accident.exactLocation,
        detailedDescriptionOfAccident: answers.accident.wasDoing.concat(
          '\n',
          answers.accident.wentWrong,
          '\n',
          answers.accident.how,
        ),
        workingEnvironment: answers.accident.accidentLocation.value,
        victims: answers.employee.map((employee, index) => {
          return {
            victimsSSN: employee.nationalField.nationalId,
            employmentStatusOfVictim: employee.employmentStatus
              ? parseInt(employee.employmentStatus, 10)
              : 0,
            employmentAgencySSN: employee.tempEmploymentSSN ?? '',
            startedEmploymentForCompany: new Date(employee.startDate),
            lengthOfEmployment: employee.employmentTime
              ? parseInt(employee.employmentTime, 10)
              : 0,
            percentageOfFullWorkTime: employee.employmentRate
              ? parseInt(employee.employmentRate, 10)
              : 0,
            workhourArrangement: employee.workhourArrangement
              ? parseInt(employee.workhourArrangement, 10)
              : 0,
            startOfWorkingDay: new Date(),
            workStation: 0,
            victimsOccupation: employee.victimsOccupation.value,
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
          }
        }), // TODO
        userPhoneNumber: '', // TODO: Þetta kemur ekki fram í umsókn og því ekki víst að þetta sé til staðar?
        userEmail: '', // TODO
      },
    })
  }
}
