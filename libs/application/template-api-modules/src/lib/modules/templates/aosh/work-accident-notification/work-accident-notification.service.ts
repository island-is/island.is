import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
import { WorkAccidentNotification } from '@island.is/application/templates/aosh/work-accident-notification'
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
        buyersSSN: answers.projectPurchase.nationalId,
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
            startOfWorkingDay: new Date(), // TODO: Missing date in dataschema!
            workStation: employee.workstation
              ? parseInt(employee.workstation, 10)
              : 0,
            victimsOccupation: employee.victimsOccupation.value,
            absenceDueToAccident: answers.absence[index]
              ? parseInt(answers.absence[index], 10)
              : 0,
            specificPhysicalActivities: [],
            specificPhysicalActivityMostSevere: '',
            workDeviations: [],
            // Object.values(answers.deviations[index]).map((values) => {
            //   return values?.map(({ value }) => {
            //     return value
            //   })
            // }),
            workDeviationMostSevere: '',
            contactModeOfInjuries: [],
            contactModeOfInjuryMostSevere: '',
            partsOfBodyInjured: [],
            partOfBodyInjuredMostSevere: '',
            typesOfInjury: [],
            typeOfInjuryMostSevere: '',
          }
        }), // TODO
        userPhoneNumber: answers.companyInformation.phonenumber,
        userEmail: answers.companyInformation.email,
      },
    })
  }
}
