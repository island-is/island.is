import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const done: Form = buildForm({
  id: 'done',
  title: 'Umsókn móttekin',
  mode: FormModes.APPLYING,
  children: [
    buildCustomField({
      id: 'schoolConfirmed',
      title: '',
      component: 'SchoolConfirmed',
    }),
  ],
})
