import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
} from '@island.is/application/types'
import { Injectable } from '@nestjs/common'
import { EventObject } from 'xstate'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { getApplicationBySubTypeId } from '@island.is/application/server-templates'

@Injectable()
export class TemplateService {
  async getApplicationTemplate<
    TContext extends ApplicationContext,
    TStateSchema extends ApplicationStateSchema<TEvents>,
    TEvents extends EventObject,
  >(
    templateId: ApplicationTypes,
    subTypeId?: string,
  ): Promise<ApplicationTemplate<TContext, TStateSchema, TEvents>> {
    console.log('getApplicationTemplate -------------------')
    console.log('templateId', templateId)
    console.log('subTypeId', subTypeId)
    const config = ApplicationConfigurations[templateId]

    if (subTypeId) {
      console.log('getting a sub type')
      const template = getApplicationBySubTypeId(subTypeId)
      if (!template) {
        throw new Error(
          `Template for ${templateId} not found in TemplateMapper`,
        )
      }
      console.log('template Name', template.name)
      console.log('end found -------------------')
      return template as unknown as ApplicationTemplate<
        TContext,
        TStateSchema,
        TEvents
      >
    }

    console.log('end NOT found! -------------------')
    return getApplicationTemplateByTypeId(templateId)
  }
  async getApplicationTranslationNamespaces(
    application: Application,
  ): Promise<string[]> {
    console.log('getApplicationTranslationNamespaces')
    const template = await this.getApplicationTemplate(
      application.typeId,
      application.subTypeId,
    )

    // We load the core namespace for the application system + the ones defined in the application template
    return ['application.system', ...(template?.translationNamespaces ?? [])]
  }
}
