import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../types'
import { LegalGazetteClientService } from '@island.is/clients/legal-gazette'
import { legalGazetteDataSchema } from '@island.is/application/templates/legal-gazette'
import { isDateString } from 'class-validator'

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

  async getTypes({ auth }: TemplateApiModuleActionProps) {
    try {
      this.logger.debug('Fetching types from Legal Gazette API', {
        category: LOGGING_CATEGORY,
      })
      const { types } = await this.legalGazetteClient.getTypes(auth)

      return types.map((t) => ({ id: t.id, title: t.title, slug: t.slug }))
    } catch (error) {
      this.logger.error('Failed to get types', {
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
      application: fields,
      communication,
      publishing,
      signature,
    } = parsed.data

    const dates: string[] = []
    publishing.dates.forEach(({ date }) => {
      if (date && isDateString(date)) {
        dates.push(date)
      }
    })

    const submitApplicationDto = {
      islandIsApplicationId: application.id,
      typeId: fields.typeId,
      categoryId: fields.categoryId,
      caption: fields.caption,
      htmlBase64: fields.html,
      signatureDate: signature.date,
      signatureName: signature.name,
      signatureLocation: signature.location,
      signatureOnBehalfOf: signature.onBehalfOf,
      additionalText: undefined,
      publishingDates: dates,
      communicationChannels: communication.channels.map((ch) => ({
        email: ch.email,
        phone: ch.phone ?? '',
      })),
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
