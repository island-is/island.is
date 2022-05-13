import {
  buildForm,
  buildCustomField,
  Form,
  FormModes,
  buildMultiField,
  buildSubmitField,
} from '@island.is/application/core'
import CoatOfArms from '../assets/CoatOfArms'
import { m } from '../lib/messages'

export const delegated: Form = buildForm({
  id: 'delegated',
  title: '',
  mode: FormModes.APPLYING,
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
