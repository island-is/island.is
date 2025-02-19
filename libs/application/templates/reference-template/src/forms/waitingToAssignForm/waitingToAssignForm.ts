import {
  buildForm,
  buildDescriptionField,
  buildSubmitField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const PendingReview: Form = buildForm({
  id: 'ExamplePending',
  title: 'In review',
  mode: FormModes.IN_PROGRESS,
  children: [
    buildMultiField({
      children: [
        buildDescriptionField({
          id: 'waitingToAssign',
          title: 'In review',
          description: 'Waiting for review.',
        }),
        buildSubmitField({
          id: 'submitWaiting',
          placement: 'footer',
          title: 'Continue',
          refetchApplicationAfterSubmit: true,
          actions: [{ event: 'SUBMIT', name: 'Continue', type: 'primary' }],
        }),
      ],
    }),
    buildDescriptionField({
      id: 'neverDisplayed',
      description: '',
    }),
  ],
})
