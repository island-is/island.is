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
import {
  getDateAndTime,
  getValueList,
  mapVictimData,
} from './work-accident-notification.utils'
import { getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class WorkAccidentNotificationTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly workAccidentClientService: WorkAccidentClientService,
  ) {
    super(ApplicationTypes.WORK_ACCIDENT_NOTIFICATION)
  }

  async getInputOptions({
    currentUserLocale,
    auth,
  }: TemplateApiModuleActionProps): Promise<DataDto> {
    const data = await this.workAccidentClientService
      .getOptionsData(auth, currentUserLocale)
      .catch(() => {
        this.logger.warn(
          '[work-accident-notification-service]: Error fetching data from AOSH',
        )
        throw new TemplateApiError(
          {
            summary:
              'Ekki tókst að sækja gögn til VER, vinsamlegast reynið síðar',
            title: 'Villa í umsókn',
          },
          400,
        )
      })

    return data
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as unknown as WorkAccidentNotification
    const payload = this.workAccidentClientService.createAccident(auth, {
      accidentForCreationDto: {
        companySSN: answers.companyInformation.nationalId,
        sizeOfEnterprise: parseInt(
          answers.companyInformation.numberOfEmployees,
          10,
        ),
        nameOfBranchOrDepartment:
          answers.companyInformation.nameOfBranch ??
          answers.companyInformation.name,
        address:
          answers.companyInformation.addressOfBranch ??
          answers.companyInformation.address,
        postcode:
          answers.companyInformation.postnumberOfBranch?.slice(0, 3) ??
          answers.companyInformation.postnumber.slice(0, 3),
        workplaceHealthAndSafety:
          answers.companyLaborProtection.workhealthAndSafetyOccupation?.map(
            (code: string) => {
              return parseInt(code, 10)
            },
          ),

        buyersSSN: answers.projectPurchase.nationalId ?? '',
        dateAndTimeOfAccident: getDateAndTime(
          answers.accident.date,
          answers.accident.time.slice(0, 2),
          answers.accident.time.slice(2, 4),
        ),
        aoshCame: answers.accident.didAoshCome === 'yes',
        policeCame: answers.accident.didPoliceCome === 'yes',
        numberOfVictims: answers.employee.length,
        municipalityWhereAccidentOccured: answers.accident.municipality,
        specificLocationOfAccident: answers.accident.exactLocation,
        detailedDescriptionOfAccident: answers.accident.wasDoing.concat(
          '\n',
          answers.accident.wentWrong,
          '\n',
          answers.accident.how,
        ),
        workingEnvironment: answers.accident.accidentLocation.value,
        victims: answers.employee.map((employee, index) => {
          return mapVictimData(employee, index, answers, application)
        }),
        userPhoneNumber: answers.companyInformation.phonenumber,
        userEmail: answers.companyInformation.email,
      },
    })

    await payload.catch(() => {
      this.logger.warn(
        '[work-accident-notification-service]: Error submitting application to AOSH',
      )
      return {
        success: false,
        message: 'Villa í umsókn, ekki tókst að skila umsókn til VER.',
      }
    })
  }
}
