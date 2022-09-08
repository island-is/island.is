import {
  buildDataProviderItem,
  buildExternalDataProvider,
  buildForm,
  buildMultiField,
  buildSection,
  buildTextField,
} from '@island.is/application/core'
import { Form, FormModes } from '@island.is/application/types'

export const officialExchange: Form = buildForm({
  id: 'officialExchange',
  title: '',
  mode: FormModes.APPLYING,
  renderLastScreenButton: true,
  renderLastScreenBackButton: true,
  children: [
    buildSection({
      id: 'externalData',
      title: 'Gagnaöflun',
      children: [
        buildExternalDataProvider({
          id: 'approveExternalData',
          title: 'Gagnaöflun',
          subTitle: 'Eftirfarandi gögn verða sótt rafrænt',
          checkboxLabel: '',
          dataProviders: [
            buildDataProviderItem({
              id: '',
              type: '',
              title: 'Upplýsingar um hinn látna',
              subTitle:
                'Upplýsingar frá sýslumanni um fæðingar- og dánardag, lögheimili, erfðir, eignir og hvort arfleifandi hafi skilað inn erfðaskrá eða gert kaupmála.',
            }),
            buildDataProviderItem({
              id: '',
              type: '',
              title: 'Persónuupplýsingar um þig',
              subTitle: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
            }),
            buildDataProviderItem({
              id: '',
              type: '',
              title: 'Stillingar frá Ísland.is',
              subTitle: 'Persónustillingar þínar frá Ísland.is.',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'information',
      title: 'Tilkynnandi',
      children: [
        buildMultiField({
          id: 'applicant',
          title: 'Tilkynnandi',
          description:
            'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
          children: [
            buildTextField({
              id: 'applicant.name',
              title: 'Nafn',
              readOnly: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.nationalId',
              title: 'Kennitala',
              readOnly: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.address',
              title: 'Lögheimili',
              readOnly: true,
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.phone',
              title: 'Símanúmer',
              width: 'half',
            }),
            buildTextField({
              id: 'applicant.email',
              title: 'Netfang',
              width: 'half',
            }),
          ],
        }),
      ],
    }),
    buildSection({
      id: 'estateMembers',
      title: 'Erfingjar og erfðaskrá',
      children: [
        buildMultiField({
          id: 'info',
          title: 'Erfingjar og erfðaskrá',
          description:
            'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
          children: [
            buildTextField({
              id: 'name',
              title: 'Nafn',
              readOnly: true,
              width: 'half',
            }),
          ],
        }),
      ],
    }),
  ],
})
