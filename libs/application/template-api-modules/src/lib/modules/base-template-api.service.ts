import { PerformActionResult } from '@island.is/application/types'
import { TemplateApiError } from '@island.is/nest/problem'
import { TemplateApiModuleActionProps } from '../types'

export interface ApplicationApiAction {
  templateId: string
  actionId: string
  props: TemplateApiModuleActionProps
}

export class BaseTemplateApiService {
  serviceId: string

  constructor(id: string) {
    this.serviceId = id
  }

  async performAction(
    action: ApplicationApiAction,
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
      } catch (e) {
        console.log(e) // CHange

        return {
          success: false,
          error: e as TemplateApiError,
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
