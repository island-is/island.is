import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
import { PracticalExam } from '@island.is/application/templates/aosh/practical-exam'

import { TemplateApiError } from '@island.is/nest/problem'

@Injectable()
export class PracticalExamTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly practicalExamClientService: unknown, // TODO: Replace with actual client service when VER provides it
  ) {
    super(ApplicationTypes.PRACTICAL_EXAM)
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as unknown as PracticalExam

    return Promise.resolve()
  }
}
