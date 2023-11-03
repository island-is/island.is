import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationFormTypes,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
} from '@island.is/application/types'
import { Injectable } from '@nestjs/common'
import { EventObject } from 'xstate'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { TemplateMapper } from '@island.is/application/server-templates'

@Injectable()
export class TemplateService {
  async getApplicationTemplate<
    TContext extends ApplicationContext,
    TStateSchema extends ApplicationStateSchema<TEvents>,
    TEvents extends EventObject,
  >(
    templateId: ApplicationTypes,
  ): Promise<ApplicationTemplate<TContext, TStateSchema, TEvents>> {
    const config = ApplicationConfigurations[templateId]

    if (config.formType === ApplicationFormTypes.DYNAMIC) {
      const template = TemplateMapper[templateId]
      if (!template) {
        throw new Error(
          `Template for ${templateId} not found in TemplateMapper`,
        )
      }

      return template as ApplicationTemplate<TContext, TStateSchema, TEvents>
    }

    return getApplicationTemplateByTypeId(templateId)
  }

  async getApplicationTranslationNamespaces(
    application: Application,
  ): Promise<string[]> {
    const template = await this.getApplicationTemplate(application.typeId)

    // We load the core namespace for the application system + the ones defined in the application template
    return ['application.system', ...(template?.translationNamespaces ?? [])]
  }
}
