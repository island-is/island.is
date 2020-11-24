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

export const rejectedDrivingLicenseApplication: Form = buildForm({
  id: 'rejectedDrivingLicenseApplication',
  name: 'Í vinnslu',
  mode: FormModes.REJECTED,
  children: [
    buildIntroductionField({
      id: 'rejected',
      name: 'Höfnuð',
      introduction: 'Umsókn þín um ökuskilríki hefur verið höfnuð.',
    }),
  ],
})
