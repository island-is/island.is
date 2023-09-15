import {
  buildForm,
  buildDescriptionField,
  buildSubmitField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const PendingReview: Form = buildForm({
  id: 'ExamplePending',
  title: 'Í vinnslu',
  mode: FormModes.IN_PROGRESS,
  children: [
    buildMultiField({
      title: '',
      children: [
        buildDescriptionField({
          id: 'waitingToAssign',
          title: 'Í bið',
          description: 'Beðið eftir umsjón.',
        }),
        buildSubmitField({
          id: 'submitWaiting',
          placement: 'footer',
          title: 'Halda áfram',
          refetchApplicationAfterSubmit: true,
          actions: [{ event: 'SUBMIT', name: 'Halda áfram', type: 'primary' }],
        }),
      ],
    }),
    buildDescriptionField({
      id: 'neverDisplayed',
      title: '',
      description: '',
    }),
  ],
})
