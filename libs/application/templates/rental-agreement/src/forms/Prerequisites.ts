import {
  buildCustomField,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'
import {
  CurrentApplicationApi,
  NationalRegistryUserApi,
} from '../dataProviders'

import { Form, FormModes } from '@island.is/application/types'
import * as m from '../lib/messages'
import { Routes } from '../lib/constants'

export const Prerequisites: Form = buildForm({
  id: 'RentalAgreementApplication',
  title: m.application.name,
  mode: FormModes.DRAFT,
  children: [
    buildSection({
      id: 'prerequisites',
      title: m.prerequisites.intro.sectionTitle,
      children: [
        buildSubSection({
          id: Routes.GENERALINFORMATION,
          title: m.prerequisites.intro.subSectionTitle,
          children: [
            buildMultiField({
              id: Routes.GENERALINFORMATION,
              title: m.prerequisites.intro.pageTitle,
              children: [
                buildCustomField({
                  id: Routes.GENERALINFORMATION,
                  title: m.prerequisites.intro.subSectionTitle,
                  component: 'GeneralInfoForm',
                }),
              ],
            }),
          ],
        }),
        buildSubSection({
          id: 'externalData',
          title: m.prerequisites.externalData.sectionTitle,
          children: [
            buildExternalDataProvider({
              id: 'externalData',
              title: m.prerequisites.externalData.pageTitle,
              subTitle: m.prerequisites.externalData.subTitle,
              description: '',
              checkboxLabel: m.prerequisites.externalData.checkboxLabel,
              dataProviders: [
                buildDataProviderItem({
                  provider: CurrentApplicationApi,
                  title: m.prerequisites.externalData.currentApplicationTitle,
                  subTitle:
                    m.prerequisites.externalData.currentApplicationSubTitle,
                }),
                buildDataProviderItem({
                  provider: NationalRegistryUserApi,
                  title: m.prerequisites.externalData.nationalRegistryTitle,
                  subTitle:
                    m.prerequisites.externalData.nationalRegistrySubTitle,
                }),
              ],
            }),
          ],
        }),
      ],
    }),
    // buildSection({
    //   id: 'accommodationData',
    //   title: 'Húsnæðið',
    //   children: [],
    // }),
    // buildSection({
    //   id: 'periodAndAmount',
    //   title: 'Tímabil og fjárhæð',
    //   children: [],
    // }),
    // buildSection({
    //   id: 'summary',
    //   title: 'Samantekt',
    //   children: [],
    // }),
    // buildSection({
    //   id: 'signing',
    //   title: 'Undirritun',
    //   children: [],
    // }),
  ],
})
