import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSubSection,
} from '@island.is/application/core'
import {
  NationalRegistryV3UserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { ChildrenApi, SchoolsApi } from '../../dataProviders'
import { newPrimarySchoolMessages } from '../../lib/messages'

export const externalDataSubSection = buildSubSection({
  id: 'externalDataSubSection',
  title: newPrimarySchoolMessages.pre.externalDataSubSection,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: newPrimarySchoolMessages.pre.externalDataSubSection,
      subTitle: newPrimarySchoolMessages.pre.externalDataDescription,
      checkboxLabel: newPrimarySchoolMessages.pre.checkboxProvider,
      dataProviders: [
        buildDataProviderItem({
          provider: NationalRegistryV3UserApi,
          title: newPrimarySchoolMessages.pre.nationalRegistryInformationTitle,
          subTitle:
            newPrimarySchoolMessages.pre.nationalRegistryInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: ChildrenApi,
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: newPrimarySchoolMessages.pre.userProfileInformationTitle,
          subTitle: newPrimarySchoolMessages.pre.userProfileInformationSubTitle,
        }),
        buildDataProviderItem({
          title: newPrimarySchoolMessages.pre.childInformationTitle,
          subTitle: newPrimarySchoolMessages.pre.childInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: SchoolsApi,
        }),
      ],
    }),
  ],
})
