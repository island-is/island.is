import { Injectable, Inject } from '@nestjs/common'
import { logger } from '@island.is/logging'
import {
  ParentalLeaveService,
  ReferenceTemplateService,
  TemplateApiModuleActionProps,
} from '@island.is/application/template-api-modules'
import { ApplicationTypes } from '@island.is/application/core'

interface ApplicationApiAction {
  templateId: string
  type: string
  props: TemplateApiModuleActionProps
}

interface PerformActionEvent {
  response: any
}

type PerformActionResult = [boolean, PerformActionEvent?]

@Injectable()
export class ApplicationActionRunnerService {
  constructor(
    private readonly parentalLeaveService: ParentalLeaveService,
    private readonly referenceTemplateService: ReferenceTemplateService,
  ) {}

  async tryRunningActionOnService(
    service: any,
    action: ApplicationApiAction,
  ): Promise<PerformActionResult> {
    if (typeof service[action.type] === 'function') {
      try {
        const response = await service[action.type](action.props)

        return [true, { response }]
      } catch (e) {
        return [false, { response: e }]
      }
    }

    return [false, { response: new Error('invalid action') }]
  }

  async performAction(
    action: ApplicationApiAction,
  ): Promise<PerformActionResult> {
    switch (action.templateId) {
      case ApplicationTypes.EXAMPLE:
        return this.tryRunningActionOnService(
          this.referenceTemplateService,
          action,
        )
      case ApplicationTypes.PARENTAL_LEAVE:
        return this.tryRunningActionOnService(this.parentalLeaveService, action)
    }

    return [false]
  }
}
