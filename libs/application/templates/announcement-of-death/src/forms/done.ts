import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
  buildMultiField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { markdownOptions } from '../lib/markdownOptions'

export const done: Form = buildForm({
  id: 'done',
  title: m.announcementComplete,
  mode: FormModes.APPLYING,
  children: [
    buildMultiField({
      id: 'done',
      title: m.announcementComplete,
      description: m.nextStepsText,
      descriptionMarkdownOptions: markdownOptions,
      space: 1,
      children: [
        buildCustomField({
          id: 'completeStepImage',
          title: '',
          component: 'AnnouncementCompleteImage',
        }),
      ],
    }),
  ],
})
