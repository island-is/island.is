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

export const drivingLicenseApplicationPendingReview: Form = buildForm({
  id: 'drivingLicenseApplicationPendingReview',
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
