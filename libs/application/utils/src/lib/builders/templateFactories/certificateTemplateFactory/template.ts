import {
  ApplicationContext,
  ApplicationStateSchema,
  ApplicationTemplate,
  ApplicationTypes,
  DefaultEvents,
  FactoryDataproviderBuilderItem,
  InstitutionNationalIds,
  NationalRegistryUserApi,
  PaymentCatalogApi,
  TemplateApi,
  UserProfileApi,
} from '@island.is/application/types'
import { applicationBuilder, state } from '../../template/applicationBuilder'
import { EventObject } from 'xstate'
import { buildDataProviderItem } from '@island.is/application/core'

import dataProviders from './providers'
import { generateCompleted, generatePayment } from './forms/'
import { prerequisitesForm } from '../../form/prerequisitesBuilder'

export function buildCertificateTemplate(
  name: string,
  certificateProvider: FactoryDataproviderBuilderItem,
  getPdfApi: TemplateApi<unknown>,
  templateId: ApplicationTypes,
  title: string,
) {
  const prerequisites = state('prerequisites', 'draft')
  const payment = state('payment', 'draft')
  const completed = state('completed', 'completed')

  const prereq = prerequisitesForm('Sakavottorð')
    .addExternalDataProvider(...dataProviders, certificateProvider)
    .build()

  const application = applicationBuilder(name, templateId)
    .addState(
      prerequisites
        .apis(
          NationalRegistryUserApi,
          UserProfileApi,
          PaymentCatalogApi.configure({
            params: {
              organizationId: InstitutionNationalIds.SYSLUMENN,
            },
          }),
          certificateProvider.provider,
        )
        .setForm(prereq)
        .addTransition(DefaultEvents.SUBMIT, payment.name),
    )
    .addState(
      payment
        .setForm(generatePayment(title))
        .addTransition(DefaultEvents.SUBMIT, completed.name),
    )
    .addState(completed.setForm(generateCompleted(title)).addOnEntry(getPdfApi))
    .build()

  return application
}
