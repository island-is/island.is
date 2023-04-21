import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { Form, FormModes } from '@island.is/application/types'

export const Done: Form = buildForm({
  id: 'Done',
  title: m.doneTitle.defaultMessage,
  mode: FormModes.COMPLETED,
  children: [
    buildMultiField({
      title: '',
      children: [
        buildDescriptionField({
          id: 'done',
          title: m.doneTitle,
          description: m.doneInfo,
        }),
      ],
    }),
  ],
})
