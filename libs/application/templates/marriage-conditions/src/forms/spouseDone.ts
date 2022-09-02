import {
  buildForm,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const spouseDone: Form = buildForm({
  id: 'spouseDone',
  title: m.applicationComplete,
  mode: FormModes.APPLYING,
  children: [
    buildMultiField({
      id: 'spouseDone',
      title: m.applicationComplete,
      description: m.spouseDoneDescription,
      children: [
        buildCustomField({
          id: 'spouseCongrats',
          component: 'SpouseDone',
          title: m.applicationComplete,
        }),
      ],
    }),
  ],
})
