import {
  buildDescriptionField,
  buildSubSection,
} from '@island.is/application/core'

import * as m from '../../lib/messages'

export const externalData = buildSubSection({
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
})
