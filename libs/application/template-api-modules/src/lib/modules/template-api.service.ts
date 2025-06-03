import { Inject, Injectable } from '@nestjs/common'
import { PerformActionResult } from '@island.is/application/types'
import { TemplateApiModuleActionProps } from '../types'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { TemplateApiError } from '@island.is/nest/problem'
import { TEMPLATE_API_SERVICES } from './template-api.constants'
import { BaseTemplateApiService } from './base-template-api.service'
import { coreErrorMessages } from '@island.is/application/core'

export interface ApplicationApiAction<Params = unknown> {
  templateId: string
  actionId: string
  action: string
  props: TemplateApiModuleActionProps<Params>
}

interface HttpError {
  http?: {
    status_code: number
  }
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
      const result = await service.performAction(
        action,
        this.handleError.bind(this),
      )

      return result
    }

    const noTemplateError = new TemplateApiError(
      {
        title: 'Invalid template api',
        summary: 'No api registered with: ' + serviceId,
      },
      500,
    )
    this.logger.error(noTemplateError)
    return {
      success: false,
      error: noTemplateError,
    }
  }

  /**
   * Catches all errors and returns them as Template Api Error to display on the client
   * If error is 500 or unexpected it logs the actual error and returns as a default TemplateApiErrorProblem
   * @param action
   * @param error
   * @returns TemplateApiError
   */
  handleError(action: ApplicationApiAction, error: Error): TemplateApiError {
    const problemError: TemplateApiError =
      'problem' in error
        ? (error as TemplateApiError)
        : new TemplateApiError(coreErrorMessages.defaultTemplateApiError, 500)

    const httpError = error as unknown as HttpError

    if (
      httpError.http &&
      httpError.http.status_code >= 300 &&
      httpError.http.status_code < 500
    ) {
      this.logger.info(`PerformAction error`, {
        stack: error?.stack,
        templateId: action.templateId,
        actionId: action.actionId,
        applicationId: action.props.application.id,
      })
    } else if (
      problemError?.problem?.status &&
      problemError?.problem?.status >= 500
    ) {
      this.logger.error(`PerformAction error`, {
        ...error,
        stack: error?.stack,
        templateId: action.templateId,
        actionId: action.actionId,
        applicationId: action.props.application.id,
      })
    }
    return problemError
  }

  getServiceId(action: ApplicationApiAction): string {
    if (action.actionId.includes('.')) {
      return action.actionId.split('.')[0]
    }
    return action.templateId
  }
}
