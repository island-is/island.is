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

export const reviewDrivingLicenseApplication: Form = buildForm({
  id: 'ReviewDrivingLicenseApplication',
  name: 'Úrvinnsla umsóknar um ökuskilríki',
  mode: FormModes.REVIEW,
  children: [],
})
