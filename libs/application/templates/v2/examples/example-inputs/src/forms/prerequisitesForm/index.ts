import { coreMessages, FormBuilder } from '@island.is/application/core'
import { DefaultEvents, Form, FormModes } from '@island.is/application/types'
import { UserProfileApi } from '@island.is/application/types'
import { ReferenceDataApi, NationalRegistryApi } from '../../dataProviders'

export const Prerequisites: Form = new FormBuilder('PrerequisitesDraft', '', {
  mode: FormModes.NOT_STARTED,
  renderLastScreenButton: true,
})
  .addSection(
    'conditions',
    '',
    (section) => {
      section.addExternalDataProvider('approveExternalData', 'External data', {
        dataProviders: [
          {
            provider: UserProfileApi,
            title: 'User profile',
            subTitle: 'User profile',
          },
          {
            provider: ReferenceDataApi,
            title: 'getReferenceData',
            subTitle: 'Reference data',
          },
          {
            provider: NationalRegistryApi,
            title: 'National Registry',
            subTitle: 'Information about you in the National Registry.',
          },
        ],
        // Button to trigger the submit event to move the application from the NOT_STARTED state to the DRAFT state.
        submitField: {
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
        },
      })
    },
    {
      // If there is no stepper or title, add tabTitle to have a title on the browser tab.
      tabTitle: 'Forkröfur',
    },
  )
  .build()
