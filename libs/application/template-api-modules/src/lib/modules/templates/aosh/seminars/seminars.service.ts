import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  CourseDTO,
  SeminarsClientService,
} from '@island.is/clients/seminars-ver'
import { TemplateApiError } from '@island.is/nest/problem'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class SeminarsTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly seminarsClientService: SeminarsClientService,
  ) {
    super(ApplicationTypes.SEMINAR_REGISTRATION)
  }

  async getSeminars({
    auth,
    application,
  }: TemplateApiModuleActionProps): Promise<CourseDTO> {
    const seminarQueryId = getValueViaPath<string>(
      application.answers,
      `initialQuery`,
      '',
    )
    const data = await this.seminarsClientService
      .getSeminars(auth)
      .catch(() => {
        this.logger.warn('[seminars-service]: Error fetching data from AOSH')
        throw new TemplateApiError(
          {
            summary:
              'Ekki tókst að sækja gögn til VER, vinsamlegast reynið síðar',
            title: 'Villa í umsókn',
          },
          400,
        )
      })
    const selectedSeminar = data.find(
      (seminar) => seminar.courseId?.toString() === seminarQueryId,
    )

    if (!selectedSeminar) {
      throw new TemplateApiError(
        {
          summary: `Ekkert námskeið fannst með þessu númeri: ${seminarQueryId}.`,
          title: 'Villa í umsókn',
        },
        400,
      )
    }

    return selectedSeminar
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    return
  }
}
