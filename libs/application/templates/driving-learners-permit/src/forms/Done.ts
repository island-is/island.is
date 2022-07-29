import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { Form, FormModes } from '@island.is/application/types'

export const Draft: Form = buildForm({
  id: 'Done',
  title: m.doneTitle.defaultMessage,
  mode: FormModes.EDITING,
  children: [
    buildMultiField({
      title: '',
      children: [
        buildDescriptionField({
          id: 'waitingToAssign',
          title: m.doneTitle,
          description: m.doneInfo,
        }),
      ],
    }),
  ],
})
