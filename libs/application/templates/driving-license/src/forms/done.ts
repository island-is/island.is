import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildCheckboxField,
  buildTextField,
  buildDividerField,
  buildRadioField,
  buildSelectField,
  buildCustomField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { NationalRegistryUser } from '../types/schema'
import { m } from '../lib/messages'

export const done: Form = buildForm({
  id: 'done',
  title: 'Í vinnslu',
  mode: FormModes.APPROVED,
  children: [
    buildCustomField({
      id: 'overview',
      component: 'Congratulations',
      title: m.overviewDone,
    }),
  ],
})
