import {
  buildForm,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'MarriageConditionsApplicationComplete',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      id: 'done',
      title: m.nextStepsTitle,
      description: m.nextStepsDescription,
      children: [
        buildCustomField({
          id: 'congrats',
          component: 'NextSteps',
          title: m.nextStepsTitle,
        }),
      ],
    }),
  ],
})
