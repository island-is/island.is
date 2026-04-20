import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubmitField,
} from '@island.is/application/core'
import {
  Application,
  DefaultEvents,
  Form,
  FormModes,
} from '@island.is/application/types'

import * as m from '../lib/messages'
import { Routes } from '../lib/constants'
import {
  CurrentApplicationApi,
  NationalRegistryV3UserApi,
  NationalRegistryV3SpouseApi,
  ChildrenCustodyInformationApiV3,
  MunicipalityApi,
  TaxDataApi,
} from '../dataProviders'
import { createElement } from 'react'
import { Logo } from '../components/Logo/Logo'

export const Prerequisites: Form = buildForm({
  id: 'FinancialAidApplication',
  title: m.application.name,
  mode: FormModes.DRAFT,
  logo: (application: Application) => {
    const logo = createElement(Logo, { application })
    return () => logo
  },
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
              provider: NationalRegistryV3UserApi,
              title: m.externalData.applicant.title,
              subTitle: m.externalData.applicant.subTitle,
            }),
            buildDataProviderItem({
              provider: NationalRegistryV3SpouseApi,
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: ChildrenCustodyInformationApiV3,
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: MunicipalityApi,
              subTitle: '',
            }),
            buildDataProviderItem({
              provider: CurrentApplicationApi,
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
          children: [],
        }),
      ],
    }),
  ],
})
