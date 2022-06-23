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
import { Routes } from '../lib/constants'

export const Prerequisites: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
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
            buildDataProviderItem({
              id: 'veita',
              type: DataProviderTypes.Veita,
              title: '',
              subTitle: undefined,
            }),
            buildDataProviderItem({
              id: 'taxDataFetch',
              type: DataProviderTypes.TaxDataFetch,
              title: m.externalData.taxData.title,
              subTitle: m.externalData.taxData.dataInfo,
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
      id: Routes.ACCECPTCONTRACT,
      title: m.aboutForm.general.sectionTitle,
      children: [
        buildMultiField({
          id: Routes.ACCECPTCONTRACT,
          title: m.aboutForm.general.pageTitle,
          children: [
            buildCustomField({
              id: Routes.ACCECPTCONTRACT,
              title: m.aboutForm.general.pageTitle,
              component: 'AboutForm',
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
