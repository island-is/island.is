import {
  buildForm,
  buildMultiField,
  buildAlertMessageField,
  buildDescriptionField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { Form, FormModes } from '@island.is/application/types'

export const Done: Form = buildForm({
  id: 'done',
  title: m.doneTitle.defaultMessage,
  mode: FormModes.COMPLETED,
  children: [
    buildMultiField({
      title: m.doneTitle,
      children: [
        buildAlertMessageField({
          id: 'done',
          title: m.doneTitle,
          message: m.doneInfo,
          alertType: 'success',
        }),
        buildDescriptionField({
          id: 'doneDescription',
          title: '',
          description: m.doneDescriptionBody,
        }),
      ],
    }),
  ],
})
