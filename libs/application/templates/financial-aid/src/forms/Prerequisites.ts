import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'

import * as m from '../lib/messages'
import { Routes } from '../lib/constants'
import {
  CurrentApplicationApi,
  NationalRegistryUserApi,
  NationalRegistrySpouseApi,
  MunicipalityApi,
  TaxDataApi,
} from '../dataProviders'

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
              provider: NationalRegistryUserApi,
              title: m.externalData.applicant.title,
              subTitle: m.externalData.applicant.subTitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistrySpouseApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: MunicipalityApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: CurrentApplicationApi,
              title: '',
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: TaxDataApi,
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
