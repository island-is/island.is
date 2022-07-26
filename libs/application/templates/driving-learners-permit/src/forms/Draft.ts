import {
  buildForm,
  buildDescriptionField,
  buildSubmitField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const Draft: Form = buildForm({
  id: 'Draft',
  title: 'Í vinnslu',
  mode: FormModes.EDITING,
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
