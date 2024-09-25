import {
  buildCustomField,
  buildDataProviderItem,
  buildDescriptionField,
  buildExternalDataProvider,
  buildForm,
  buildRadioField,
  buildSection,
  buildSubSection,
} from '@island.is/application/core'

import {
  Form,
  FormModes,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import * as m from '../lib/messages'

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
          id: 'intro',
          title: m.prerequisites.intro.subSectionTitle,
          children: [
            buildCustomField({
              id: 'generalInformation',
              title: m.prerequisites.intro.pageTitle,
              component: 'GeneralInfoForm',
            }),
          ],
        }),
        buildSubSection({
          id: 'externalData',
          title: m.prerequisites.externalData.sectionTitle,
          children: [
            // TODO: Remove description field when data providers are implemented
            buildDescriptionField({
              id: 'externalDataDummyContent',
              title: 'External data',
              description: 'This is where the external data will be displayed',
            }),
            // TODO: Uncomment when data providers are implemented
            // buildExternalDataProvider({
            //   id: 'approveExternalData',
            //   title: m.prerequisites.externalData.pageTitle,
            //   subTitle: m.prerequisites.externalData.subTitle,
            //   checkboxLabel: m.prerequisites.externalData.checkboxLabel,
            //   dataProviders: [
            //     buildDataProviderItem({
            //       provider: UserProfileApi,
            //       title: m.prerequisites.externalData.currentApplicationTitle,
            //       subTitle:
            //         m.prerequisites.externalData.currentApplicationSubTitle,
            //     }),
            //     buildDataProviderItem({
            //       provider: NationalRegistryUserApi,
            //       title: m.prerequisites.externalData.nationalRegistryTitle,
            //       subTitle:
            //         m.prerequisites.externalData.nationalRegistrySubTitle,
            //     }),
            //   ],
            // }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'applicantData',
      title: 'Mínar upplýsingar',
      children: [
        buildSubSection({
          id: 'applicantInfo',
          title: m.applicantInfo.general.title,
          children: [
            buildRadioField({
              id: 'applicationType.option',
              title: 'radioFieldTitle',
              description: 'radioFieldDescription',
              options: [
                {
                  value: 'yes',
                  label: 'Yes',
                },
                {
                  value: 'no',
                  label: 'No',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'accommodationData',
      title: 'Húsnæðið',
      children: [],
    }),
    buildSection({
      id: 'periodAndAmount',
      title: 'Tímabil og fjárhæð',
      children: [],
    }),
    buildSection({
      id: 'summary',
      title: 'Samantekt',
      children: [],
    }),
    buildSection({
      id: 'signing',
      title: 'Undirritun',
      children: [],
    }),
  ],
})
