import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSubSection,
} from '@island.is/application/core'
import {
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { ChildrenApi } from '../../dataProviders'
import { primarySchoolMessages } from '../../lib/messages'

export const externalDataSubSection = buildSubSection({
  id: 'externalDataSubSection',
  title: primarySchoolMessages.pre.externalDataSubSection,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: primarySchoolMessages.pre.externalDataSubSection,
      subTitle: primarySchoolMessages.pre.externalDataDescription,
      checkboxLabel: primarySchoolMessages.pre.checkboxProvider,
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryUserApi,
          title: primarySchoolMessages.pre.nationalRegistryInformationTitle,
          subTitle:
            primarySchoolMessages.pre.nationalRegistryInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: ChildrenApi,
          subTitle: '',
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: primarySchoolMessages.pre.userProfileInformationTitle,
          subTitle: primarySchoolMessages.pre.userProfileInformationSubTitle,
        }),
        buildDataProviderItem({
          title: primarySchoolMessages.pre.childInformationTitle,
          subTitle: primarySchoolMessages.pre.childInformationSubTitle,
        }),
      ],
    }),
  ],
})
