import { PerformActionResult } from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import { ApplicationApiAction } from './template-api.service'

export class BaseTemplateApiService {
  serviceId: string

  constructor(id: string) {
    this.serviceId = id
  }

  async performAction(
    action: ApplicationApiAction,
    handleError: (
      action: ApplicationApiAction,
      error: Error,
    ) => TemplateApiError,
  ): Promise<PerformActionResult> {
    // No index signature with a parameter of type 'string' was found on type
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (typeof this[action.action] === 'function') {
      try {
        // No index signature with a parameter of type 'string' was found on type
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const response = await this[action.action](action.props)

        return {
          success: true,
          response,
        }
      } catch (error) {
        return {
          success: false,
          error: handleError(action, error),
        }
      }
    }

    return {
      success: false,
      error: new TemplateApiError(
        {
          title: 'Template api invalid',
          summary: 'action could not be found',
        },
        500,
      ),
    }
  }
}
