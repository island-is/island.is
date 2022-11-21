import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: 'Umsókn móttekin',
  mode: FormModes.DRAFT,
  children: [
    buildCustomField({
      id: 'overview',
      component: 'Congratulations',
      title: m.overviewDone,
    }),
  ],
})
