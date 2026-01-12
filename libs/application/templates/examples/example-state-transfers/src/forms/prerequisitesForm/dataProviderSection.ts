import {
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents } from '@island.is/application/types'
import { UserProfileApi } from '@island.is/application/types'

export const dataproviderSection = buildSection({
  id: 'conditions',
  tabTitle: 'Prerequisites',
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
      ],

      // Button to trigger the submit event to move the application from the NOT_STARTED state to the DRAFT state.
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
