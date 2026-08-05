import {
  buildForm,
  buildMultiField,
  buildImageField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { CoatOfArms } from '@island.is/application/assets/institution-logos'
import { m } from '../lib/messages'
import { GhostOnABench } from '@island.is/application/assets/graphics'

export const delegated: Form = buildForm({
  id: 'delegated',
  mode: FormModes.IN_PROGRESS,
  logo: CoatOfArms,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      id: 'delegated',
      title: m.delegatedTitle,
      description: m.delegatedDescription,
      space: 1,
      children: [
        buildImageField({
          id: 'completeStepImage',
          image: GhostOnABench,
          imagePosition: 'center',
        }),
      ],
    }),
  ],
})
