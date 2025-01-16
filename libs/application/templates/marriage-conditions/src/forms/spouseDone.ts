import {
  buildForm,
  buildMultiField,
  buildDescriptionField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const spouseDone: Form = buildForm({
  id: 'spouseDone',
  mode: FormModes.IN_PROGRESS,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      id: 'spouseDone',
      title: m.applicationComplete,
      description: m.spouseDoneDescription,
      children: [
        buildDescriptionField({
          id: 'spouseNextStepsTitle',
          title: m.nextSteps,
          titleVariant: 'h3',
        }),
        buildDescriptionField({
          id: 'spouseNextStepsBullets',
          description: m.spouseNextSteps,
          space: 'gutter',
        }),
      ],
    }),
  ],
})
