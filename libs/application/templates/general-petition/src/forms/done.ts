import {
  buildForm,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  mode: FormModes.COMPLETED,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      id: 'done',
      title: m.listCreatedTitle,
      description: m.listCreatedSubtitle,
      children: [
        buildCustomField({
          id: 'done',
          title: m.listCreatedTitle,
          component: 'ListCreated',
        }),
      ],
    }),
  ],
})
