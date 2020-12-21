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

export const pending: Form = buildForm({
  id: 'pending',
  title: 'Í vinnslu',
  mode: FormModes.PENDING,
  children: [
    buildDescriptionField({
      id: 'inReview',
      title: 'Í vinnslu',
      description: 'Umsókn þín um ökuskilríki er nú í vinnslu.',
    }),
  ],
})
