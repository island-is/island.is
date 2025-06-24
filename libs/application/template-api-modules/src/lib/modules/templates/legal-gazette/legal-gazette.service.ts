import { Inject, Injectable } from '@nestjs/common'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { BaseTemplateApiService } from '../../base-template-api.service'
import { ApplicationTypes } from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../../../types'
import { LegalGazetteClientService } from '@island.is/clients/legal-gazette'
import { legalGazetteDataSchema } from '@island.is/application/templates/legal-gazette'
import { getValueViaPath } from '@island.is/application/core'
import { Identity } from '@island.is/clients/identity'
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

  async deleteApplication({ application, auth }: TemplateApiModuleActionProps) {
    await this.legalGazetteClient.deleteApplication(application.id, auth)
  }

  async submitApplication({ application, auth }: TemplateApiModuleActionProps) {
    const { answers, externalData } = application

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

    const identityInformation = getValueViaPath<Identity>(
      externalData,
      'identity.data',
    )

    if (!identityInformation) {
      this.logger.error('Identity information not found in external data', {
        category: LOGGING_CATEGORY,
      })
      return {
        success: false,
      }
    }

    const actor = identityInformation.actor
      ? {
          name: identityInformation.actor.name,
          nationalId: identityInformation.actor.nationalId,
        }
      : {
          name: identityInformation.name,
          nationalId: identityInformation.nationalId,
        }

    const institution = identityInformation.actor
      ? {
          name: identityInformation.name,
          nationalId: identityInformation.nationalId,
        }
      : undefined

    const {
      application: appl,
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
      applicationId: application.id,
      categoryId: appl.categoryId,
      caption: appl.caption,
      htmlBase64: appl.html,
      signature: signature,
      channels: communication.channels.map((ch) => ({
        email: ch.email,
        phone: ch.phone ?? '',
      })),
      actor: actor,
      institution: institution,
      publishingDates: dates,
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
