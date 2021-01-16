import {
  buildForm,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildExternalDataProvider,
  buildKeyValueField,
  buildDataProviderItem,
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
import { NationalRegistryUser } from '@island.is/api/schema'
import { m } from '../lib/messages'

export const application: Form = buildForm({
  id: 'DrivingLicenseApplicationDraftForm',
  title: 'Ökuskilríki',
  mode: FormModes.APPLYING,
  children: [
    buildSection({
      id: 'externalData',
      title: 'Sækja gögn',
      children: [
        buildExternalDataProvider({
          title: 'Sækja gögn',
          id: 'approveExternalData',
          dataProviders: [
            buildDataProviderItem({
              id: 'nationalRegistry',
              type: 'NationalRegistryProvider',
              title: 'Persónuuplýsingar úr Þjóðskrá',
              subTitle:
                'Til þess að auðvelda fyrir sækjum við persónuuplýsingar úr Þjóðskrá til þess að fylla út í umsóknina',
            }),
            buildDataProviderItem({
              id: 'userProfile',
              type: 'UserProfileProvider',
              title: 'Netfang og símanúmer úr þínum stillingum',
              subTitle:
                'Til þess að auðvelda umsóknarferlið er gott að hafa stillt netfang og símanúmer á mínum síðum',
            }),
            buildDataProviderItem({
              id: 'penaltyPoints',
              type: 'PenaltyPointsProvider',
              title: 'Punktastaða úr Ökuskírteinaskrá',
              subTitle:
                'Til þess að tryggja að notandi hafi heimild til þess að sækja um ökuskírteini út frá punktastöðu',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'type',
      title: 'Ökuréttindi',
      children: [
        buildMultiField({
          id: 'user',
          title: 'Ég er að sækja um:',
          children: [
            buildCheckboxField({
              id: 'type',
              title: 'Tegund ökutækja',
              options: [
                { value: 'general', label: 'Almenn ökuréttindi' },
                { value: 'bike', label: 'Bifhjólaréttindi' },
                { value: 'trailer', label: 'Kerrur og eftirvagnar' },
              ],
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'subType',
      title: 'Tegund',
      children: [
        buildMultiField({
          id: 'subType',
          title: 'Ég er að sækja um:',
          space: 6,
          children: [
            buildCheckboxField({
              id: 'general',
              title: 'Fólksbílaflokkar',
              condition: ({ type }) =>
                (type as string[])?.includes('general') ||
                (type as string[])?.includes('trailer'),
              options: (app) => {
                if ((app.answers.type as string[])?.includes('trailer')) {
                  return [
                    {
                      value: 'BE',
                      label:
                        '<span><b>BE</b> Fólksbifreið með eftirvagn</span>',
                    },
                  ]
                }

                return [
                  { value: 'B', label: '<span><b>B</b> Fólksbifreið</span>' },
                ]
              },
            }),
            buildCheckboxField({
              id: 'subType',
              title: 'Bifhjólaflokkar',
              condition: ({ type }) => (type as string[])?.includes('bike'),
              options: [
                { value: 'A', label: '<span><b>A</b> Bifhjól</span>' },
                { value: 'A1', label: '<span><b>A1</b> Bifhjól</span>' },
                {
                  value: 'A2',
                  label: m.testing,
                  tooltip: `<h2>A2 flokkur</h2>
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
                { value: 'AM', label: '<span><b>AM</b> Létt bifhjól</span>' },
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
            buildKeyValueField({
              label: 'Umsækjandi',
              value: ({ externalData: { nationalRegistry } }) =>
                (nationalRegistry.data as NationalRegistryUser).fullName,
            }),
            buildDividerField({
              title: 'Ökukennari',
              color: 'dark400',
            }),
            buildTextField({
              id: 'teacher',
              title: 'Ökukennari',
              width: 'half',
              backgroundColor: 'blue',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'healthDeclaration',
      title: 'Heilbrigðisyfirlýsing',
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
