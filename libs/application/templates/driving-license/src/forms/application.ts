import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubmitField,
  buildCheckboxField,
  buildTextField,
  buildCustomField,
  buildRadioField,
  buildSelectField,
  buildDividerField,
  Form,
  FormModes,
} from '@island.is/application/core'
import { m } from '../lib/messages'

export const application: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  title: 'Ökuskilríki',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'type',
      title: 'Tegund ökuréttinda',
      children: [
        buildMultiField({
          id: 'user',
          title: 'Ég er að sækja um:',
          children: [
            buildRadioField({
              id: 'type',
              title: 'Tegund ökutækja',
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
        buildMultiField({
          id: 'bikeType',
          title: 'Tegund bifhjólaréttinda sem sótt er um',
          condition: ({ type }) => type === 'bike',
          children: [
            buildRadioField({
              id: 'bikeType',
              title: 'Ég sæki um nýjan flokk ökuréttinda',
              options: [
                { value: 'A', label: '<b>A</b> - Bifhjól' },
                { value: 'A1', label: '<b>A1</b> - Bifhjól' },
                {
                  value: 'A2',
                  label: m.testing,
                  tooltip: `<h2>A2- flokkur</h2>
<br />
Veitir ökuréttindi til að stjórna bifhjóli:
<br /><br />
1. á tveimur hjólum með eða án hliðarvagns, með afl sem er ekki yfir 35 kw, með afl/þyngdarhlutfall sem er ekki yfir 0,2 kw/kg, svo og   bifhjóli sem hefur ekki verið breytt frá því að hafa áður meira en tvöfalt afl.
<br /><br />
2. bifhjóli í flokki A1.
<br /><br />
3. léttu bifhjóli í flokki AM.
<br /><br />
Ökuskírteini fyrir A2 flokk fyrir bifhjólaréttindi geta þeir fengið sem náð hafa 19 ára aldri. Taka þarf bóklegt námskeið fyrir A réttindi og 11 stundir í verklegri kennslu, ath að 5 stundir fást metnar ef viðkomandi aðili hefur fyrir A1 réttindi`,
                },
                { value: 'AM', label: '<b>AM</b> - Létt bifhjól' },
              ],
            }),
          ],
        }),
        buildMultiField({
          id: 'truckType',
          title: 'Tegund vöru- eða hópbifreiðaréttinda sem sótt er um',
          condition: ({ type }) => type === 'truck',
          children: [
            buildRadioField({
              id: 'truckType',
              title: 'Ég sæki um nýjan flokk ökuréttinda',
              options: [
                { value: 'C', label: '<b>C</b> - Vörubifreið' },
                { value: 'CE', label: '<b>CE</b> - Vörubifreið með eftirvagn' },
                { value: 'C1', label: '<b>C1</b> - Lítil vörubifreið' },
                {
                  value: 'C1E',
                  label: '<b>C1E</b> - Lítil vörubifreið með eftirvagn',
                },
                { value: 'D', label: '<b>D</b> - Hópbifreið' },
                { value: 'DE', label: '<b>DE</b> - Hópbifreið með eftirvagn' },
                { value: 'D1', label: '<b>D1</b> - Lítil hópbifreið' },
                {
                  value: 'D1E',
                  label: '<b>D1E</b> - Lítil hópbifreið með eftirvagn',
                },
              ],
            }),
            buildDividerField({}),
            buildCheckboxField({
              id: 'isBusiness',
              title: '',
              options: [
                {
                  value: 'isBusiness',
                  label: 'Ég sæki um réttindi til flutninga í atvinnuskyni',
                },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'user',
      title: 'Upplýsingar',
      children: [
        buildMultiField({
          id: 'info',
          title: 'Upplýsingar',
          children: [
            buildTextField({
              id: 'user.name',
              title: 'Nafn',
              width: 'half',
            }),
            buildTextField({
              id: 'address.home',
              title: 'Heimili',
              width: 'half',
            }),
            buildTextField({
              id: 'address.postcode',
              title: 'Póstnúmer',
              width: 'half',
            }),
            buildTextField({
              id: 'address.city',
              title: 'Staður',
              width: 'half',
            }),
            buildTextField({
              id: 'user.phoneNumber',
              title: 'Sími',
              width: 'half',
            }),
            buildTextField({
              id: 'user.nationalId',
              title: 'Kennitala',
              width: 'half',
            }),
            buildTextField({
              id: 'user.email',
              title: 'Netfang',
              width: 'half',
            }),
            buildSelectField({
              id: 'user.country',
              title: 'Fæðingarland',
              width: 'half',
              options: [
                { label: 'Ísland', value: 'IS' },
                { label: 'Pólland', value: 'PL' },
              ],
            }),
            buildDividerField({
              title: 'Ökukennari',
              color: 'dark400',
            }),
            buildTextField({
              id: 'teacher',
              title: 'Ökukennari',
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'healthDeclaration',
      title: '',
      children: [
        buildCustomField({
          id: 'healthDeclaration',
          title: 'Heilbrigðisyfirlýsing',
          component: 'HealthDeclaration',
        }),
      ],
    }),
    buildSection({
      id: 'confirmation',
      title: 'Staðfesta',
      children: [
        buildMultiField({
          id: 'submit',
          title: 'Takk fyrir að sækja um',
          children: [
            buildSubmitField({
              id: 'submit',
              placement: 'footer',
              title: 'sick',
              actions: [
                {
                  event: 'SUBMIT',
                  name: 'Smelltu hér til að senda inn umsókn',
                  type: 'primary',
                },
              ],
            }),
            buildDescriptionField({
              id: 'overview',
              title: '',
              description:
                'Með því að smella á "Senda" hér að neðan, þá sendist umsóknin inn til úrvinnslu. Við látum þig vita þegar hún er samþykkt eða henni er hafnað.',
            }),
          ],
        }),
        buildDescriptionField({
          id: 'final',
          title: 'Takk',
          description: 'Umsókn þín er komin í vinnslu',
        }),
      ],
    }),
  ],
})
