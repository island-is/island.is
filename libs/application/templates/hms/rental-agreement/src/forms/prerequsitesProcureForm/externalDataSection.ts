import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import * as m from '../../lib/messages'
import {
  DefaultEvents,
  IdentityApi,
  UserProfileApi,
} from '@island.is/application/types'

export const externalDataSection = buildSection({
  id: 'externalDataProcure',
  title: m.prerequisites.externalData.sectionTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.prerequisites.externalData.pageTitle,
      subTitle: m.prerequisites.externalData.subTitle,
      checkboxLabel: m.prerequisites.externalData.checkboxLabel,
      submitField: buildSubmitField({
        id: 'toDraft',
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
      dataProviders: [
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.prerequisites.externalData.currentApplicationTitle,
          subTitle: m.prerequisites.externalData.currentApplicationSubTitle,
        }),
        buildDataProviderItem({
          provider: IdentityApi,
        }),
      ],
    }),
  ],
})
