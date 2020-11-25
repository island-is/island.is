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

export const drivingLicenseApplication: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  name: 'Ökuskilríki',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'type',
      name: 'Tegund umsóknar',
      children: [
        buildMultiField({
          id: 'user',
          name: 'Ég er að sækja um:',
          children: [
            buildRadioField({
              id: 'type',
              name: 'Tegund ökutækja',
              emphasize: true,
              options: [
                { value: 'car', label: 'Bifreiða- eða bifhjólaréttindi' },
                { value: 'truck', label: 'Vöru- eða hópbifreiðaréttindi' },
                { value: 'tractor', label: 'Dráttarvélaréttindi' },
                { value: 'taxi', label: 'Leigubílaréttindi' },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'user',
      name: 'Upplýsingar',
      children: [
        buildMultiField({
          id: 'info',
          name: 'Upplýsingar',
          children: [
            buildTextField({
              id: 'user.name',
              name: 'Nafn',
              width: 'half',
            }),
            buildTextField({
              id: 'address.home',
              name: 'Heimili',
              width: 'half',
            }),
            buildTextField({
              id: 'address.postcode',
              name: 'Póstnúmer',
              width: 'half',
            }),
            buildTextField({
              id: 'address.city',
              name: 'Staður',
              width: 'half',
            }),
            buildTextField({
              id: 'user.phoneNumber',
              name: 'Sími',
              width: 'half',
            }),
            buildTextField({
              id: 'user.nationalId',
              name: 'Kennitala',
              width: 'half',
            }),
            buildTextField({
              id: 'user.email',
              name: 'Netfang',
              width: 'half',
            }),
            buildSelectField({
              id: 'user.country',
              name: 'Fæðingarland',
              width: 'half',
              options: [
                { label: 'Ísland', value: 'Iceland' },
                { label: 'Pólland', value: 'Polland' },
              ],
            }),
            buildDividerField({
              name: 'Ökukennari',
              color: 'dark400',
            }),
            buildTextField({
              id: 'teacher',
              name: 'Ökukennari',
              width: 'half',
            }),
          ],
        }),
        buildMultiField({
          id: 'info2',
          name: 'Tegund ökuréttinda sem sótt er um',
          children: [
            buildRadioField({
              id: 'category',
              name: 'Ég sæki um nýjan flokk ökuréttinda',
              emphasize: true,
              options: [
                { value: 'B', label: 'Fólksbifreið' },
                { value: 'BE', label: 'Fólksbifreið með eftirvagn' },
                { value: 'AM', label: 'Létt bifhjól' },
                { value: 'A1', label: 'Bifhjól' },
                { value: 'A2', label: 'Bifhjól' },
                { value: 'A', label: 'Bifhjól' },
              ],
            }),
            buildCheckboxField({
              id: 'isBusiness',
              name: '',
              options: [
                { value: 'isBusiness', label: 'Ég sæki um í atvinnuskyni' },
              ],
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
