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

export const approvedDrivingLicenseApplication: Form = buildForm({
  id: 'approvedDrivingLicenseApplication',
  name: 'Samþykkt',
  mode: FormModes.APPROVED,
  children: [
    buildIntroductionField({
      id: 'approved',
      name: 'Samþykkt',
      introduction: 'Umsókn þín um ökuskilríki hefur verið samþykkt.',
    }),
  ],
})
