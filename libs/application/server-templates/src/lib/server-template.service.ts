import { Inject, Injectable } from '@nestjs/common'
import {
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  PerformActionResult,
} from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { TEMPLATE_API_SERVICES } from './template-api.constants'
import { BaseTemplateApiService } from './base-template-api.service'
import { coreErrorMessages } from '@island.is/application/core'
import { TEMPLATE_MODULES } from './server-template.modules'
import { BaseTemplateService } from './ITemplateService'

import { AnyEventObject, EventObject } from 'xstate'
import { REQUEST } from '@nestjs/core'

@Injectable()
export class TemplateService<T extends EventObject = AnyEventObject> {
  constructor(
    @Inject(LOGGER_PROVIDER) private logger: Logger,
    @Inject(TEMPLATE_MODULES)
    private templates: Array<BaseTemplateService>,
    @Inject(REQUEST) private request: Request,
  ) {
    this.logger = logger.child({ context: 'TemplateAPIService' })
  }

  getByTemplateTypeId(templateId: ApplicationTypes): BaseTemplateService {
    const template = this.templates.find(
      (s) => s.getTemplateId() === templateId,
    )

    if (template) {
      return template
    }
    throw new Error('Template not found')
  }

  async getStuff() {
    const templst = this.getByTemplateTypeId(ApplicationTypes.EXAMPLE)

    t
  }
}
