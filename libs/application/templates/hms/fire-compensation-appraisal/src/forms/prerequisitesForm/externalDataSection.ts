import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildSection,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { UserProfileApi } from '@island.is/application/types'
import { NationalRegistryApi, propertiesApi } from '../../dataProviders'
import * as m from '../../lib/messages'

export const externalDataSection = buildSection({
  id: 'conditions',
  tabTitle: m.prereqMessages.tabTitle,
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: m.prereqMessages.prereqTitle,
      dataProviders: [
        buildDataProviderItem({
          provider: UserProfileApi,
          title: m.prereqMessages.userProfileTitle,
          subTitle: m.prereqMessages.userProfileSubtitle,
        }),
        buildDataProviderItem({
          provider: NationalRegistryApi,
          title: m.prereqMessages.nationalRegistryTitle,
          subTitle: m.prereqMessages.nationalRegistrySubtitle,
        }),
        buildDataProviderItem({
          provider: propertiesApi,
          title: m.prereqMessages.propertiesTitle,
          subTitle: m.prereqMessages.propertiesSubtitle,
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
