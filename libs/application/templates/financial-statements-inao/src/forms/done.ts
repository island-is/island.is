import {
  buildForm,
  buildSection,
  buildMultiField,
  buildCustomField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: 'Umsókn móttekin',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'conclusionSection',
      title: '',
      children: [
        buildMultiField({
          id: 'conclusion',
          title: m.received,
          children: [
            buildCustomField({
              id: 'overview',
              component: 'Success',
              title: m.applicationAccept,
            }),
          ],
        }),
      ],
    }),
  ],
})
