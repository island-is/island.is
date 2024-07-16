import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSubSection,
} from '@island.is/application/core'
import {
  ChildrenCustodyInformationApi,
  NationalRegistryUserApi,
  UserProfileApi,
} from '@island.is/application/types'
import { GetKeyOptionsTypesApi, OptionsApi } from '../../dataProviders'
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
          provider: NationalRegistryUserApi,
          title: newPrimarySchoolMessages.pre.nationalRegistryInformationTitle,
          subTitle:
            newPrimarySchoolMessages.pre.nationalRegistryInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: ChildrenCustodyInformationApi,
          title: '',
          subTitle: '',
        }),
        buildDataProviderItem({
          provider: UserProfileApi,
          title: newPrimarySchoolMessages.pre.userProfileInformationTitle,
          subTitle: newPrimarySchoolMessages.pre.userProfileInformationSubTitle,
        }),
        buildDataProviderItem({
          provider: GetKeyOptionsTypesApi,
          title: 'KeyOptionsTypes',
        }),
        buildDataProviderItem({
          provider: OptionsApi,
          title: 'Options',
        }),
      ],
    }),
  ],
})
