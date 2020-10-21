import {
  buildForm,
  buildIntroductionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const PendingReview: Form = buildForm({
  id: 'ExamplePending',
  name: 'Í vinnslu',
  mode: FormModes.PENDING,
  children: [
    buildIntroductionField({
      id: 'inReview',
      name: 'Í vinnslu',
      introduction: 'Umsókn þín um ökunám er nú í vinnslu. ',
    }),
  ],
})
