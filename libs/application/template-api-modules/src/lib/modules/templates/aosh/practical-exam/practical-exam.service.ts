import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'

import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiModuleActionProps } from '../../../../types'
import { PracticalExam } from '@island.is/application/templates/aosh/practical-exam'

import { TemplateApiError } from '@island.is/nest/problem'
import {
  ExamCategoryDto,
  PracticalExamsClientService,
} from '@island.is/clients/practical-exams-ver'
import { getValueViaPath } from '@island.is/application/core'

@Injectable()
export class PracticalExamTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly practicalExamClientService: PracticalExamsClientService,
  ) {
    super(ApplicationTypes.PRACTICAL_EXAM)
  }

  async getExamCategories({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<Array<ExamCategoryDto>> {
    try {
      const response = await this.practicalExamClientService.getExamcategories(
        auth,
        { xCorrelationID: application.id },
      )
      if (!response || response.length === 0) {
        this.logger.warning(
          '[practical-exam.service]: Empty or no exam category response',
        )
        throw new TemplateApiError(
          {
            summary:
              'Villa í gögnum frá Vinnueftirliti, vinsamlegast reynið síðar',
            title: 'Villa í umsókn',
          },
          400,
        )
      }
      return response
    } catch (error) {
      this.logger.error(
        '[practical-exam.service]: Error fetching exam categories from VER',
        error,
      )
      throw new TemplateApiError(
        {
          summary:
            'Ekki tókst að sækja gögn til VER, vinsamlegast reynið síðar',
          title: 'Villa í umsókn',
        },
        400,
      )
    }
  }

  async submitApplication({
    application,
    auth,
  }: TemplateApiModuleActionProps): Promise<void> {
    const answers = application.answers as unknown as PracticalExam

    return Promise.resolve()
  }
}
