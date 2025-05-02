import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import {
  CurrentUserTypeProvider,
  IdentityApiProvider,
  UserInfoApi,
} from '../../dataProviders'
import { DefaultEvents } from '@island.is/application/types'

export const prerequisitesSection = buildSection({
  id: 'ExternalDataSection',
  title: '',
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.dataCollectionTitleUserIndividual,
      checkboxLabel: m.dataCollectionCheckboxLabel,
      dataProviders: [
        buildDataProviderItem({
          provider: IdentityApiProvider,
          title: m.dataCollectionNationalRegistryTitle,
          subTitle: m.dataCollectionNationalRegistrySubtitle,
        }),
        buildDataProviderItem({
          provider: UserInfoApi,
          title: m.dataCollectionUserProfileTitle,
          subTitle: m.dataCollectionUserProfileSubtitle,
        }),
        buildDataProviderItem({
          provider: CurrentUserTypeProvider,
          title: m.dataCollectionUserFinancialInfoTitle,
          subTitle: m.dataCollectionUserFinancialInfo,
        }),
      ],
      submitField: buildSubmitField({
        id: 'submit',
        placement: 'footer',
        refetchApplicationAfterSubmit: true,
        actions: [
          {
            event: DefaultEvents.SUBMIT,
            name: coreMessages.buttonNext,
            type: 'primary',
          },
        ],
      }),
    }),
  ],
})
