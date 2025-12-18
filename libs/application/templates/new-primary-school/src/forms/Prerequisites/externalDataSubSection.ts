import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSubSection,
} from '@island.is/application/core'
import {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { ChildrenApi, SchoolsApi } from '../../dataProviders'
import { prerequisitesMessages } from '../../lib/messages'

export const externalDataSubSection = buildSubSection({
  id: 'externalDataSubSection',
  title: prerequisitesMessages.externalData.subSectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: prerequisitesMessages.externalData.subSectionTitle,
      subTitle: prerequisitesMessages.externalData.description,
      checkboxLabel: prerequisitesMessages.externalData.checkboxProvider,
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title:
            prerequisitesMessages.externalData.nationalRegistryInformationTitle,
          subTitle:
            prerequisitesMessages.externalData
              .nationalRegistryInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: ChildrenApi,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: prerequisitesMessages.externalData.userProfileInformationTitle,
          subTitle:
            prerequisitesMessages.externalData.userProfileInformationSubTitle,
        }),
        buildDataProviderItem({
          title: prerequisitesMessages.externalData.childInformationTitle,
          subTitle: prerequisitesMessages.externalData.childInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: SchoolsApi,
        }),
      ],
    }),
  ],
})
