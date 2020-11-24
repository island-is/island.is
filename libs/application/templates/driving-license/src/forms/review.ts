import {
  buildForm,
  buildIntroductionField,
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

export const review: Form = buildForm({
  id: 'Review',
  name: 'Úrvinnsla umsóknar um ökuskilríki',
  mode: FormModes.REVIEW,
  children: [],
})
