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
          id: 'prepaidInheritance.bankMoney',
          title: '',
          large: true,
          backgroundColor: 'blue',
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.estateBankInfo,
              subLabel: m.estateBankInfoDescription,
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
              label: m.moneyTitle,
              subLabel: m.moneyDescription,
            },
          ],
        }),
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
          id: 'prepaidInheritance.vehicles',
          title: '',
          large: true,
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.vehicles,
              subLabel: m.vehiclesDescription,
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
              label: 'Annað',
              subLabel: 'Til dæmis bla bla bla',
            },
          ],
        }),
      ],
    }),
  ],
})
