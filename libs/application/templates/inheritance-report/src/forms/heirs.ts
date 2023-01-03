import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { m } from '../lib/messages'

export const heirs = buildSection({
  id: 'heirs',
  title: 'Eign til skipta',
  children: [
    buildSubSection({
      id: 'heirsAmount',
      title: 'Eign til skipta og erfingjar',
      children: [
        buildMultiField({
          id: 'heirsAmount',
          title: 'Eign til skipta',
          description:
            'Frá dregst búshluti eftirlifandi maka skv. reglum hjúskaparlaga nr. 31/1993 (50% eigna).',
          children: [
            buildKeyValueField({
              label: 'Hrein eign',
              value: '1.200.000 kr.',
            }),
            buildDescriptionField({
              id: 'space',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: 'Samtals frádráttur',
              value: '200.000 kr.',
            }),
            buildDescriptionField({
              id: 'space1',
              title: '',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: 'Hrein eign til skiptis',
              value: '1.000.000 kr.',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'heirs',
      title: 'Erfingjar og skipting',
      children: [
        buildMultiField({
          id: 'heirs',
          title: 'Erfingjar og skipting',
          description:
            'Skrá skal netfang erfingja vegna tilkynninga skattstjóra skv. 9. og 10. gr. laga nr. 14/2004',
          children: [
            buildCustomField(
              {
                title: '',
                id: 'inventory',
                doesNotRequireAnswer: true,
                component: 'TextFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.debtsSsn.defaultMessage,
                    id: 'ssn',
                    format: '######-####',
                  },
                  {
                    title: 'Nafn',
                    id: 'creditorName',
                  },
                  {
                    title: 'Netfang',
                    id: 'email',
                  },
                  {
                    title: 'Símanúmer',
                    id: 'phone',
                  },
                  {
                    title: 'Tengsl við arfláta',
                    id: 'relation',
                  },
                  {
                    title: 'Arfshlutfall',
                    id: 'percentage',
                  },
                  {
                    title: 'Óskattskyldur arfur',
                    id: 'arfur',
                    readOnly: true,
                  },
                  {
                    title: 'Fjárhæð arfshluta',
                    id: 'amount',
                    readOnly: true,
                  },
                  {
                    title: 'Skattskyldur arfur',
                    id: 'skattskyldur',
                    readOnly: true,
                  },
                  {
                    title: 'Erfðafjárskattur',
                    id: 'Erfðafjárskattur',
                    readOnly: true,
                  },
                ],
                repeaterButtonText: 'Bæta við erfingja',
                repeaterHeaderText: 'Erfingi',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'heirsAddintionalInfo',
      title: 'Athugasemdir erfingja',
      children: [
        buildMultiField({
          id: 'heirsAdditionalInfo',
          title: 'Athugasemdir erfingja',
          description:
            'Skýringar og athugasemdir erfingja og/eða þeirra sem afhenda fyrirframgreiddan arf',
          children: [
            buildTextField({
              id: 'heirsAdditionalInfo',
              title: 'Athugasemdir',
              placeholder: 'Skráðu inn athugasemdir hér',
              variant: 'textarea',
              rows: 7,
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'heirsOverview',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'heirsOverview',
          title: m.overview,
          description:
            'Vinsamlegast tilgreindu allar eignir arfleifanda utan atvinnurekstrar. Ef ekkert á við vinsamlegast haltu áfram í ferlinu.',
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'temp1',
              title: '',
              space: 'gutter',
            }),
          ],
        }),
      ],
    }),
  ],
})
