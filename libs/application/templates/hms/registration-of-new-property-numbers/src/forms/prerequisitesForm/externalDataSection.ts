import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import { UserProfileApi } from '@island.is/application/types'
import {
  HMSPaymentCatalogApi,
  IdentityApi,
  MockableHMSPaymentCatalogApi,
  propertiesApi,
} from '../../dataProviders'
import * as m from '../../lib/messages'

export const externalDataSection = buildSection({
  id: 'conditions',
  tabTitle: m.prereqMessages.tabTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.prereqMessages.prereqTitle,
      subTitle: m.prereqMessages.subTitle,
      checkboxLabel: m.prereqMessages.checkboxLabel,
      dataProviders: [
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.prereqMessages.userProfileTitle,
          subTitle: m.prereqMessages.userProfileSubtitle,
        }),
        buildDataProviderItem({
          provider: IdentityApi,
          title: m.prereqMessages.nationalRegistryTitle,
          subTitle: m.prereqMessages.nationalRegistrySubtitle,
        }),
        buildDataProviderItem({
          provider: propertiesApi,
          title: m.prereqMessages.propertiesTitle,
          subTitle: m.prereqMessages.propertiesSubtitle,
        }),
        buildDataProviderItem({
          provider: HMSPaymentCatalogApi,
        }),
        buildDataProviderItem({
          provider: MockableHMSPaymentCatalogApi,
        }),
      ],
    }),
  ],
})
