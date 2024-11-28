import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
import {
  NamskeidDto,
  Seminar,
  SeminarsClientService,
} from '@island.is/clients/seminars-ver'
import { TemplateApiError } from '@island.is/nest/problem'

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
  }: TemplateApiModuleActionProps): Promise<Array<Seminar>> {
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

    return data
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    return
  }
}
