import { logger } from '@island.is/logging'
import { Injectable } from '@nestjs/common'
import {
  ParentalLeaveService,
  ReferenceTemplateService,
} from '@island.is/application/template-api-modules'
import { Application, ApplicationTypes } from '@island.is/application/core'
import { EmailService } from '@island.is/email-service'

interface ApplicationApiActionProps {
  application: Application
  clientLocationOrigin: string
  authorization: string
  emailService: EmailService
}

interface ApplicationApiAction {
  templateId: string
  type: string
  props: ApplicationApiActionProps
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
    console.log('trying to perform', action.type, 'on', action.templateId)
    if (typeof service[action.type] === 'function') {
      try {
        const response = await service[action.type](action.props)

        return [true, { response }]
      } catch {
        //
      }
    }

    return [false]
  }

  async performAction(
    action: ApplicationApiAction,
  ): Promise<PerformActionResult> {
    console.log('#######')
    console.log('actionRunner.performAction', action.templateId)
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
