import {
  buildForm,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { Application, Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'
import { Individual } from '../types'

export const done: Form = buildForm({
  id: 'MarriageConditionsApplicationComplete',
  mode: FormModes.COMPLETED,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      id: 'done',
      title: m.nextStepsTitle,
      description: (application: Application) => ({
        ...m.nextStepsDescriptionWithSpouseName,
        values: {
          spouseName: (application.answers.spouse as Individual)?.person.name,
        },
      }),
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
