import {
  buildDescriptionField,
  buildForm,
  buildSection,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { applicationBlockedMessages } from '../lib/messages'

export const ApplicationBlocked: Form = buildForm({
  id: 'newPrimarySchoolApplicationBlocked',
  mode: FormModes.NOT_STARTED,
  children: [
    buildSection({
      id: 'applicationBlocked',
      tabTitle: applicationBlockedMessages.title,
      children: [
        buildDescriptionField({
          id: 'applicationBlocked.description',
          title: applicationBlockedMessages.title,
          description: applicationBlockedMessages.description,
        }),
      ],
    }),
  ],
})
