import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../types'
import { LegalGazetteClientService } from '@island.is/clients/legal-gazette'
import { legalGazetteDataSchema } from '@island.is/application/templates/legal-gazette'

const LOGGING_CATEGORY = 'LegalGazetteTemplateService'

@Injectable()
export class LegalGazetteTemplateService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(LegalGazetteClientService)
    private legalGazetteClient: LegalGazetteClientService,
  ) {
    super(ApplicationTypes.LEGAL_GAZETTE)
  }

  async getCategories({ auth }: TemplateApiModuleActionProps) {
    try {
      const { categories } = await this.legalGazetteClient.getCategories(auth)

      return categories.map((c) => ({ id: c.id, title: c.title, slug: c.slug }))
    } catch (error) {
      this.logger.error('Failed to get categories', {
        error,
        category: LOGGING_CATEGORY,
      })

      throw error
    }
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { answers } = application

    const parsed = legalGazetteDataSchema.safeParse(answers)

    if (!parsed.success) {
      this.logger.error('Failed to parse answers', {
        error: parsed.error,
        category: LOGGING_CATEGORY,
      })

      return {
        success: false,
      }
    }

    const {
      application: appl,
      communication,
      publishing,
      signature,
    } = parsed.data

    const submitApplicationDto = {
      applicationId: application.id,
      categoryId: appl.categoryId,
      caption: appl.caption,
      htmlBase64: appl.html,
      signature: signature,
      channels: communication.channels.map((ch) => ({
        email: ch.email,
        phone: ch.phone ?? '',
      })),
      publishingDates: publishing.dates.map(({ date }) => date),
    }

    try {
      await this.legalGazetteClient.submitApplication(
        submitApplicationDto,
        auth,
      )

      return {
        success: true,
      }
    } catch (error) {
      this.logger.error('Failed to submit application', {
        error,
        category: LOGGING_CATEGORY,
      })

      return {
        success: false,
      }
    }
  }
}
