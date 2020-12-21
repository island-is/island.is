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
  Form,
  FormModes,
} from '@island.is/application/core'

export const approved: Form = buildForm({
  id: 'approved',
  name: 'Samþykkt',
  mode: FormModes.APPROVED,
  children: [
    buildDescriptionField({
      id: 'approved',
      name: 'Samþykkt',
      description: 'Umsókn þín um ökuskilríki hefur verið samþykkt.',
    }),
  ],
})
