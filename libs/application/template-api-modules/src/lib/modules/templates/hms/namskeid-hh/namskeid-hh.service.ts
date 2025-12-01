import { Inject, Injectable } from '@nestjs/common'
import { ApplicationTypes } from '@island.is/application/types'
import { BaseTemplateApiService } from '../../../base-template-api.service'
import { TemplateApiModuleActionProps } from '../../../..'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { SharedTemplateApiService } from '../../../shared'

@Injectable()
export class NamskeidHhService extends BaseTemplateApiService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    private readonly sharedTemplateAPIService: SharedTemplateApiService,
  ) {
    super(ApplicationTypes.NAMSKEID_HH)
  }

  async submitApplication({ application }: TemplateApiModuleActionProps) {
    const isPayment = await this.sharedTemplateAPIService.getPaymentStatus(
      application.id,
    )

    if (!isPayment?.fulfilled) {
      this.logger.error(
        'Attempting to submit namskeid-hh application that has not been paid.',
      )
      throw new Error(
        'Ekki er hægt að skila inn umsókn af því að ekki hefur tekist að taka við greiðslu.',
      )
    }

    // TODO: Implement actual submission logic
    this.logger.info(
      `[NamskeidHhService] Application ${application.id} submitted successfully`,
    )
  }
}

