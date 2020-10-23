import {
  buildForm,
  buildIntroductionField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const Rejected: Form = buildForm({
  id: 'ExampleRejected',
  name: 'Hafnað',
  mode: FormModes.REJECTED,
  children: [
    buildIntroductionField({
      id: 'rejected',
      name: 'Því miður...',
      introduction: 'Umsókn þinni verið hafnað! Það er frekar leiðinlegt.',
    }),
  ],
})
