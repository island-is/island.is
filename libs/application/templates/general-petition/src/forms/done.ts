import { buildForm, buildCustomField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: m.listCreatedTitle,
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [
    buildCustomField({
      id: 'done',
      title: m.listCreatedTitle,
      component: 'ListCreated',
    }),
  ],
})
