import {
  buildForm,
  buildCustomField,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'
import { m } from '../../lib/messages'

export const done: Form = buildForm({
  id: 'estateWithoutAssetsDone',
  title: '',
  mode: FormModes.COMPLETED,
  renderLastScreenButton: true,
  children: [
    buildMultiField({
      id: 'done',
      title: m.doneTitle,
      description: m.estateWithoutAssetsSubtitle,
      children: [
        buildCustomField({
          id: 'doneImage',
          component: 'DoneImage',
          title: '',
        }),
      ],
    }),
  ],
})
