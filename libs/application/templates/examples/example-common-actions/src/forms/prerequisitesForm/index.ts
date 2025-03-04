import {
  buildForm,
  buildSection,
  buildExternalDataProvider,
  buildDataProviderItem,
  buildSubmitField,
  coreMessages,
} from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { UserProfileApi } from '@island.is/application/types'
import {
  ReferenceDataApi,
  MyMockProvider,
  NationalRegistryApi,
} from '../../dataProviders'

export const Prerequisites: Form = buildForm({
  id: 'PrerequisitesDraft',
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
  children: [
    buildSection({
      id: 'conditions',
      title: '', // If this is empty, we will not have a visible stepper on the right side of the screen.
      tabTitle: 'Forkröfur', // If there is no stepper, add tabTitle to have a title on the browser tab.
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
              provider: ReferenceDataApi,
              title: 'getReferenceData',
              subTitle: 'Reference data',
            }),
            buildDataProviderItem({
              provider: NationalRegistryApi,
              title: 'National Registry',
              subTitle: 'Information about you in the National Registry.',
            }),
            buildDataProviderItem({
              provider: MyMockProvider,
              title: 'Mock Data',
              subTitle: 'Returns data for mocking',
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
    }),
  ],
})
