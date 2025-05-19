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

export const externalDataSection = buildSection({
  id: 'conditions',
  tabTitle: 'Forkröfur',
  children: [
    buildExternalDataProvider({
      id: 'approveExternalData',
      title: 'External data',
      dataProviders: [
        buildDataProviderItem({
          provider: UserProfileApi,
          title: 'User profile',
          subTitle: 'User profile',
        }),
        buildDataProviderItem({
          provider: NationalRegistryApi,
          title: 'National registry',
          subTitle: 'National registry',
        }),
        buildDataProviderItem({
          provider: propertiesApi,
          title: 'Properties',
          subTitle: 'Properties',
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
