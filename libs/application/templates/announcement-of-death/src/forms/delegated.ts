import {
  buildForm,
  buildMultiField,
  buildImageField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import CoatOfArms from '../assets/CoatOfArms'
import { m } from '../lib/messages'
import AOD from '../assets/AOD'

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
          image: AOD,
          imagePosition: 'center',
        }),
      ],
    }),
  ],
})
