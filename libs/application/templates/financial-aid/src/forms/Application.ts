import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildSection,
  Form,
  FormModes,
  buildCustomField,
} from '@island.is/application/core'
import { DataProviderTypes } from '../types'

import * as m from '../lib/messages'

export const Application: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'nationalRegistryData',
      title: m.section.dataGathering,
      children: [
        buildExternalDataProvider({
          title: m.externalData.general.pageTitle,
          id: 'approveExternalData',
          subTitle: m.externalData.general.subTitle,
          description: m.externalData.general.description,
          checkboxLabel: m.externalData.general.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: DataProviderTypes.NationalRegistry,
              title: m.externalData.applicant.title,
              subTitle: m.externalData.applicant.subTitle,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'aboutForm',
      title: m.aboutForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'acceptContract',
          title: m.aboutForm.general.pageTitle,
          component: 'AboutForm',
        }),
      ],
    }),
    buildSection({
      id: 'homeCircumstancesForm',
      title: m.homeCircumstancesForm.general.sectionTitle,
      children: [
        buildCustomField({
          id: 'homeCircumstances',
          title: m.homeCircumstancesForm.general.pageTitle,
          component: 'HomeCircumstancesForm',
        }),
      ],
    }),
  ],
})
