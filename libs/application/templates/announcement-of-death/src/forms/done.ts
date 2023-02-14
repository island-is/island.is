import {
  buildForm,
  buildCustomField,
  buildMultiField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: m.announcementComplete,
  mode: FormModes.COMPLETED,
  children: [
    buildMultiField({
      id: 'done',
      title: m.announcementComplete,
      description: m.announcementCompleteDescription,
      space: 1,
      children: [
        buildDescriptionField({
          id: 'nextSteps',
          title: '',
          description: m.nextStepsText,
        }),
        buildCustomField({
          id: 'completeStepImage',
          title: '',
          component: 'AnnouncementCompleteImage',
        }),
      ],
    }),
  ],
})
