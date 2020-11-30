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

export const pending: Form = buildForm({
  id: 'pending',
  name: 'Í vinnslu',
  mode: FormModes.PENDING,
  children: [
    buildIntroductionField({
      id: 'inReview',
      name: 'Í vinnslu',
      introduction: 'Umsókn þín um ökuskilríki er nú í vinnslu.',
    }),
  ],
})
