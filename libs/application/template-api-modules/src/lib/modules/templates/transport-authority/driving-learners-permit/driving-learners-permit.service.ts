import { Inject, Injectable } from '@nestjs/common'

import { TemplateApiModuleActionProps } from '../../../../types'
import type { Logger } from '@island.is/logging'

import { DrivingLicenseApi } from '@island.is/clients/driving-license'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { getValueViaPath } from '@island.is/application/core'
import { TemplateApiError } from '@island.is/nest/problem'
import { LOGGER_PROVIDER } from '@island.is/logging'

@Injectable()
export class DrivingLearnersPermitService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly drivingLicenseService: DrivingLicenseApi,
  ) {
    super(ApplicationTypes.DRIVING_LEARNERS_PERMIT)
  }

  async completeApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps) {
    const studentSSN =
      getValueViaPath<string>(
        application.answers,
        'studentMentorability.studentNationalId',
        '',
      ) ?? ''
    const practicePermitApplication = await this.drivingLicenseService
      .postPracticePermitApplication({
        token: auth.authorization.split(' ')[1], // Removes the Bearer prefix
        studentSSN,
      })
      .catch(() => {
        this.logger.warn(
          '[driving-learners-permit-service]: error in response from driving license api',
        )
        throw new TemplateApiError(
          {
            summary: 'Umsókn hafnað af ökuskírteinaskrá',
            title: 'Villa í umsókn',
          },
          400,
        )
      })

    if (!practicePermitApplication.isOk) {
      this.logger.warn(
        '[driving-learners-permit-service]: Submission rejected by driving license api (not isOK)',
      )
      throw new TemplateApiError(
        {
          summary: 'Umsókn hafnað af ökuskírteinaskrá',
          title: 'Villa í umsókn',
        },
        400,
      )
    }

    return {
      practicePermitApplication,
    }
  }
}
