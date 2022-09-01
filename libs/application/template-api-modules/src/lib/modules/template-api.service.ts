import { Inject, Injectable } from '@nestjs/common'
import { PerformActionResult } from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../types'
import { LOGGER_PROVIDER } from '@island.is/logging'
import type { Logger } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { TEMPLATE_API_SERVICES } from './template-api.constants'
import { BaseTemplateApiService } from './base-template-api.service'

interface ApplicationApiAction {
  templateId: string
  actionId: string
  action: string
  props: TemplateApiModuleActionProps
}

@Injectable()
export class TemplateAPIService {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(TEMPLATE_API_SERVICES)
    private services: Array<BaseTemplateApiService>,
  ) {
    this.logger = logger.child({ context: 'TemplateAPIService' })
  }

  async performAction(
    action: ApplicationApiAction,
  ): Promise<PerformActionResult> {
    const serviceId = this.getServiceId(action)

    const service = this.services.find((x) => x.serviceId === serviceId)

    if (service) {
      return await service.performAction(action)
    }

    return {
      success: false,
      error: new TemplateApiError(
        {
          title: 'Invalid application template',
          summary: 'application could not be found',
        },
        500,
      ),
    }
  }

  getServiceId(action: ApplicationApiAction): string {
    if (action.actionId.includes('.')) {
      return action.actionId.split('.')[0]
    }
    return action.templateId
  }
}
