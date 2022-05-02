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
      id: 'overview',
      component: 'Success',
      title: 'Umsókn móttekin',
    }),
  ],
})
