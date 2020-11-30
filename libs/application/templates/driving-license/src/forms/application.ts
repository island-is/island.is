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
import { nativeCountries } from '@island.is/shared/data'

export const application: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  name: 'Ökuskilríki',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'type',
      name: 'Ökuréttindi',
      children: [
        buildMultiField({
          id: 'user',
          name: 'Ég er að sækja um:',
          children: [
            buildRadioField({
              id: 'type',
              name: 'Tegund ökutækja',
              largeButtons: true,
              width: 'half',
              options: [
                { value: 'general', label: 'Almenn ökuréttindi' },
                { value: 'truck', label: 'Vöru- eða hópbifreiðaréttindi' },
                { value: 'bike', label: 'Bifhjólaréttindi' },
                { value: 'taxi', label: 'Leigubílaréttindi' },
                { value: 'tractor', label: 'Dráttarvélaréttindi' },
                { value: 'trailer', label: 'Kerrur og eftirvagnar' },
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
              placeholder: 'Veldu land',
              defaultValue: nativeCountries.find(
                (c: typeof nativeCountries) => c.value === 'IS',
              ),
              options: nativeCountries,
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
      id: 'healthDeclaration',
      name: 'Heilbrigðisyfirlýsing',
      children: [
        buildMultiField({
          id: 'healthDeclaration',
          name: 'Heilbrigðisyfirlýsing',
          children: [
            buildIntroductionField({
              id: 'intro',
              name: '',
              introduction:
                'Ef sótt er um réttindi í flokkum <b>AM</b>, <b>A1</b>, <b>A2</b>, <b>A</b>, <b>B</b>, <b>BE</b> eða <b>T</b> nægir heilbrigðisyfirlýsing ein og sér, nema sýslumaður telji þörf á læknisvottorði eða ef umsækjandi hefur náð 65 ára aldri eða hann vilji heldur skila læknisvottorði. Með umsókn um aðra flokka ökuréttinda (aukin ökuréttindi) er krafist læknisvottorðs á sérstöku eyðublaði.',
            }),
            buildCheckboxField({
              id: 'useMedicalCertification',
              name: '',
              options: [
                {
                  value: 'useMedicalCertification',
                  label:
                    'Umsækjandi óskar eftir að skila inn læknisvottorði í stað heilbrigðisyfirlýsingu',
                },
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
