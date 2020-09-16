import {
  buildForm,
  buildIntroductionField,
  Form,
} from '@island.is/application/core'

export const Rejected: Form = buildForm({
  id: 'ExampleRejected',
  name: 'Hafnað',
  mode: 'rejected',
  children: [
    buildIntroductionField({
      id: 'rejected',
      name: 'Því miður...',
      introduction: 'Umsókn þinni verið hafnað! Það er frekar leiðinlegt.',
    }),
  ],
})
