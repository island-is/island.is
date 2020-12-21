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

export const rejected: Form = buildForm({
  id: 'rejected',
  title: 'Í vinnslu',
  mode: FormModes.REJECTED,
  children: [
    buildDescriptionField({
      id: 'rejected',
      title: 'Höfnuð',
      description: 'Umsókn þín um ökuskilríki hefur verið höfnuð.',
    }),
  ],
})
