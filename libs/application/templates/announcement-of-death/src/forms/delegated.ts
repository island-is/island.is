import {
  buildForm,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import CoatOfArms from '../assets/CoatOfArms'
import { m } from '../lib/messages'

export const delegated: Form = buildForm({
  id: 'delegated',
  title: '',
  mode: FormModes.DRAFT,
  logo: CoatOfArms,
  children: [
    buildMultiField({
      id: 'delegataed',
      title: m.delegatedTitle,
      description: m.delegatedDescription,
      space: 1,
      children: [
        buildCustomField({
          id: 'completeStepImage',
          title: '',
          component: 'AnnouncementCompleteImage',
        }),
        buildCustomField({
          id: 'myPagesButton',
          title: '',
          component: 'Delegated',
        }),
      ],
    }),
  ],
})
