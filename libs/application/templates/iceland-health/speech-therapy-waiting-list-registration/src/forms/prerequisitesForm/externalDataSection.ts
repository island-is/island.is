import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
} from '@island.is/application/core'
import {
  AvailableLocationsApi,
  ChildrenApi,
  LanguagesApi,
  NationalRegistryV3UserApi,
  RejectionReasonsApi,
  SpeechPathologistsApi,
  UserProfileApi,
} from '../../dataProviders'
import { prerequisitesMessages } from '../../lib/messages'

export const externalDataSection = buildSection({
  id: 'externalDataSection',
  title: prerequisitesMessages.externalData.sectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: prerequisitesMessages.externalData.sectionTitle,
      subTitle: prerequisitesMessages.externalData.description,
      checkboxLabel: prerequisitesMessages.externalData.checkboxProvider,
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryV3UserApi,
          title:
            prerequisitesMessages.externalData.nationalRegistryInformationTitle,
          subTitle:
            prerequisitesMessages.externalData
              .nationalRegistryInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: prerequisitesMessages.externalData.userProfileInformationTitle,
          subTitle:
            prerequisitesMessages.externalData.userProfileInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: ChildrenApi,
          title:
            prerequisitesMessages.externalData.icelandHealthInformationTitle,
          subTitle:
            prerequisitesMessages.externalData.icelandHealthInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: LanguagesApi,
        }),
        buildDataProviderItem({
          provider: AvailableLocationsApi,
        }),
        buildDataProviderItem({
          provider: SpeechPathologistsApi,
        }),
        buildDataProviderItem({
          provider: RejectionReasonsApi,
        }),
      ],
    }),
  ],
})
