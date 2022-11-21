import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildForm,
  buildMultiField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

import { m } from '../lib/messages'

export const Done: Form = buildForm({
  id: 'OperatingLicenseApplicationComplete',
  title: '',
  mode: FormModes.DRAFT,
  children: [
    buildMultiField({
      id: 'done',
      title: m.applicationComplete,
      children: [
        buildCustomField({
          id: 'overview',
          component: 'Congratulations',
          title: m.applicationCompleteTitle,
        }),
      ],
    }),
  ],
})
