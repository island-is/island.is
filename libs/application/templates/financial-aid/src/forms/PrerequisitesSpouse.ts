import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/core'
import { DataProviderTypes } from '../lib/types'

import * as m from '../lib/messages'

export const PrerequisitesSpouse: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalDataSpouse',
      title: m.section.dataGathering,
      children: [
        buildExternalDataProvider({
          title: m.externalData.general.pageTitle,
          id: 'approveExternalDataSpouse',
          subTitle: m.externalData.general.subTitle,
          checkboxLabel: m.externalData.general.checkboxLabel,
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistrySpouse',
              type: DataProviderTypes.NationalRegistrySpouse,
              title: '',
              subTitle: undefined,
            }),
            buildDataProviderItem({
              id: 'taxDataFetchSpouse',
              type: DataProviderTypes.TaxDataFetch,
              title: m.externalData.taxData.title,
              subTitle: m.externalData.taxData.dataInfo,
            }),
            buildDataProviderItem({
              id: 'veita',
              type: DataProviderTypes.Veita,
              title: '',
              subTitle: undefined,
            }),
            buildDataProviderItem({
              id: 'text',
              type: undefined,
              title: '',
              subTitle: m.externalData.taxData.whyDataIsNeeded,
            }),
            buildDataProviderItem({
              id: 'moreTaxInfo',
              type: undefined,
              title: '',
              subTitle: m.externalData.taxData.process,
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'aboutSpouseForm',
      title: m.aboutSpouseForm.general.sectionTitle,
      children: [
        buildMultiField({
          id: 'acceptContract',
          title: m.aboutForm.general.pageTitle,
          children: [
            buildCustomField({
              id: 'acceptContract',
              title: m.aboutSpouseForm.general.pageTitle,
              component: 'AboutSpouseForm',
            }),
            buildSubmitField({
              id: 'toDraft',
              title: '',
              refetchApplicationAfterSubmit: true,
              actions: [
                {
                  event: DefaultEvents.SUBMIT,
                  name: m.aboutForm.goToApplication.button,
                  type: 'primary',
                },
              ],
            }),
          ],
        }),
        // This is here to be able to show submit button on former screen :( :( :(
        buildMultiField({
          id: '',
          title: '',
          children: [],
        }),
      ],
    }),
  ],
})
