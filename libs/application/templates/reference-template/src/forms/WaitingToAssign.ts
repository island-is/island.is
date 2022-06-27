import {
  buildForm,
  buildDescriptionField,
  Form,
  FormModes,
  buildSubmitField,
  buildMultiField,
} from '@island.is/application/core'

export const PendingReview: Form = buildForm({
  id: 'ExamplePending',
  title: 'Í vinnslu',
  mode: FormModes.REVIEW,
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
