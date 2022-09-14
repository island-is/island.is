import { buildForm, buildDescriptionField } from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: '',
  mode: FormModes.APPLYING,
  children: [
    buildDescriptionField({
      id: 'officialExchangeDone#markdown',
      title: m.doneTitle,
      description: m.officialExchangeDoneSubtitle,
    }),
  ],
})
