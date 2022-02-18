import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'

export const done: Form = buildForm({
  id: 'done',
  title: 'Andlátstilkynning móttekin',
  mode: FormModes.APPLYING,
  children: [
    buildCustomField({
      id: 'overview',
      component: 'Completed',
      title: 'Andlátstilkynning móttekin',
    }),
  ],
})
