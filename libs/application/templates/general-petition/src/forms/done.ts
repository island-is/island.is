import {
  buildForm,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: m.listCreatedTitle,
  mode: FormModes.IN_PROGRESS,
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
