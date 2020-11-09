import {
  buildDataProviderItem,
  buildDateField,
  buildExternalDataProvider,
  buildForm,
  buildIntroductionField,
  buildMultiField,
  buildRadioField,
  buildSection,
  buildSelectField,
  buildSubmitField,
  buildSubSection,
  buildTextField,
  DataProviderTypes,
  Form,
  FormModes,
} from '@island.is/application/core'

export const drivingLicenseApplication: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  name: 'Ökuskilríki',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'user',
      name: 'Notandi',
      children: [
        buildMultiField({
          id: 'user',
          name: 'Upplýsingar um notanda',
          children: [
            buildTextField({
              id: 'user.name',
              name: 'Nafn',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      name: 'Staðfesta',
      children: [
        buildMultiField({
          id: 'submit',
          name: 'Takk fyrir að sækja um',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              name: 'sick',
              actions: [
                {
                  event: 'SUBMIT',
                  name: 'Smelltu hér til að senda inn umsókn',
                  type: 'primary',
                },
              ],
            }),
            buildIntroductionField({
              id: 'overview',
              name: '',
              introduction:
                'Með því að smella á "Senda" hér að neðan, þá sendist umsóknin inn til úrvinnslu. Við látum þig vita þegar hún er samþykkt eða henni er hafnað.',
            }),
          ],
        }),
        buildIntroductionField({
          id: 'final',
          name: 'Takk',
          introduction: 'Umsókn þín er komin í vinnslu',
        }),
      ],
    }),
  ],
})
