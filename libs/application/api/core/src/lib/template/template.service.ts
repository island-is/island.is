import {
  Application,
  ApplicationConfigurations,
  ApplicationContext,
  ApplicationFormTypes,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DataProviderBuilderItem,
  NationalRegistryUserApi,
  PaymentCatalogApi,
  TemplateApi,
  UserProfileApi,
  ValidateCriminalRecordApi,
  defineTemplateApi,
} from '@island.is/application/types'
import { Injectable } from '@nestjs/common'
import { EventObject } from 'xstate'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { CertificateTemplateMapper } from './applicationTemplates/certificates'

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
      const template = CertificateTemplateMapper[templateId]
      if (!template) {
        throw new Error(
          `Template for ${templateId} not found in CertificateTemplateMapper`,
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
