import {
  buildSubSection,
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import { UserProfileApi, NationalRegistryUserApi } from '../../dataProviders'
import * as m from '../../lib/messages'

export const externalData = buildSection({
  id: 'externalData',
  title: m.prerequisites.externalData.sectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.prerequisites.externalData.pageTitle,
      subTitle: m.prerequisites.externalData.subTitle,
      checkboxLabel: m.prerequisites.externalData.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.prerequisites.externalData.currentApplicationTitle,
          subTitle: m.prerequisites.externalData.currentApplicationSubTitle,
        }),
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: m.prerequisites.externalData.nationalRegistryTitle,
          subTitle: m.prerequisites.externalData.nationalRegistrySubTitle,
        }),
      ],
    }),
  ],
})
