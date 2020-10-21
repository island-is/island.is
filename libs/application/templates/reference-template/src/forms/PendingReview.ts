import {
  buildForm,
  buildIntroductionField,
  Form,
} from '@island.is/application/core'

export const PendingReview: Form = buildForm({
  id: 'ExamplePending',
  name: 'Í vinnslu',
  mode: 'pending',
  children: [
    buildIntroductionField({
      id: 'inReview',
      name: 'Í vinnslu',
      introduction: 'Umsókn þín um ökunám er nú í vinnslu. ',
    }),
  ],
})
