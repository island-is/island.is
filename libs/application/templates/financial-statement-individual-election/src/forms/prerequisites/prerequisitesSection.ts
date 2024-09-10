import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { m } from '../../lib/utils/messages'
import {
  CurrentUserTypeProvider,
  IndentityApiProvider,
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
          provider: IndentityApiProvider,
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
        title: '',
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
