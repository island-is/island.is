import {
  YES,
  buildCheckboxField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const inheritance = buildSection({
  id: 'inheritance',
  title: 'Arfur',
  children: [
    buildMultiField({
      id: 'inheritance',
      title: 'Hvað á að greiða í arf?',
      description: 'Lorem ipsum foo bar beep boop meep morp.',
      children: [
        buildCheckboxField({
          id: 'prepaidInheritance.realEstate',
          title: '',
          large: true,
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.realEstate,
              subLabel: m.realEstateDescription,
            },
          ],
        }),
        buildCheckboxField({
          id: 'prepaidInheritance.stocks',
          title: '',
          large: true,
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.stocksTitle,
            },
          ],
        }),
        buildCheckboxField({
          id: 'prepaidInheritance.money',
          title: '',
          large: true,
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.moneyTitlePrePaid,
            },
          ],
        }),
        buildCheckboxField({
          id: 'prepaidInheritance.other',
          title: '',
          large: true,
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.otherAssetsTitle,
            },
          ],
        }),
      ],
    }),
  ],
})
