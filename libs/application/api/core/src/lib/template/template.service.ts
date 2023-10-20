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
  UserProfileApi,
  ValidateCriminalRecordApi,
} from '@island.is/application/types'
import { Injectable } from '@nestjs/common'
import { EventObject } from 'xstate'
import { getApplicationTemplateByTypeId } from '@island.is/application/template-loader'
import { ApplicationBlueprint, buildTemplate } from './template.model'
import {
  data,
  payment,
  completedData,
  prerequisites,
  generatePrerequisites,
} from './states'
import { buildDataProviderItem } from '@island.is/application/core'

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
      return this.buildCertificateTemplate(
        'Umsókn um skírteini',
        {
          provider: ValidateCriminalRecordApi,
          title: 'Information from the criminal record database',
          subTitle: 'Skjal sem inniheldur sakavottorðið þitt.',
        },
        templateId,
      )
    }

    return getApplicationTemplateByTypeId(templateId)
  }

  buildCertificateTemplate<
    TContext extends ApplicationContext,
    TStateSchema extends ApplicationStateSchema<TEvents>,
    TEvents extends EventObject,
  >(
    name: string,
    certificateProvider: DataProviderBuilderItem,
    templateId: ApplicationTypes,
  ): ApplicationTemplate<TContext, TStateSchema, TEvents> {
    const dataString: string = JSON.stringify(data)
    const completedDataString: string = JSON.stringify(completedData)

    const providers = [
      buildDataProviderItem({
        provider: NationalRegistryUserApi,
        title: 'Persónuupplýsingar úr Þjóðskrá',
        subTitle:
          'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      }),
      buildDataProviderItem({
        provider: UserProfileApi,
        title: 'Netfang og símanúmer úr þínum stillingum',
        subTitle:
          'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
      }),
      buildDataProviderItem(certificateProvider),
      /*buildDataProviderItem({
        provider: ValidateCriminalRecordApi,
        title: 'Information from the criminal record database',
        subTitle: 'Skjal sem inniheldur sakavottorðið þitt.',
      }),*/
    ]

    const prerequisitesString: string = generatePrerequisites(providers)

    const blueprint: ApplicationBlueprint = {
      ApplicatonType: templateId,
      initalState: 'prerequisites',
      name: name,
      dataProviders: [
        PaymentCatalogApi,
        UserProfileApi,
        NationalRegistryUserApi,
        ValidateCriminalRecordApi,
      ],
      states: [
        {
          name: 'prerequisites',
          status: 'draft',
          form: prerequisitesString,
          transitions: [{ event: 'SUBMIT', target: 'draft' }],
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 1 * 24 * 3600 * 1000,
          },
        },
        {
          name: 'draft',
          status: 'draft',
          form: dataString,
          transitions: [{ event: 'SUBMIT', target: 'completed' }],
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 1 * 24 * 3600 * 1000,
          },
        },
        {
          name: 'completed',
          status: 'completed',
          form: completedDataString,
          transitions: [{ event: 'SUBMIT', target: 'prerequisites' }],
          lifecycle: {
            shouldBeListed: true,
            shouldBePruned: true,
            whenToPrune: 1 * 24 * 3600 * 1000,
          },
        },
      ],
    }
    return buildTemplate(blueprint)
  }

  async getApplicationTranslationNamespaces(
    application: Application,
  ): Promise<string[]> {
    const template = await this.getApplicationTemplate(application.typeId)

    // We load the core namespace for the application system + the ones defined in the application template
    return ['application.system', ...(template?.translationNamespaces ?? [])]
  }
}
