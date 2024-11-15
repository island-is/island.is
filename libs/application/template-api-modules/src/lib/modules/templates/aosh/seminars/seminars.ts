import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'

@Injectable()
export class SeminarsTemplateService extends BaseTemplateApiService {
  constructor(@Inject(LOGGER_PROVIDER) private logger: Logger) {
    super(ApplicationTypes.SEMINAR_REGISTRATION)
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    return
  }
}
