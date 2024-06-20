import {
  YES,
  buildCheckboxField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'

export const inheritance = buildSection({
  id: 'inheritance',
  title: m.inheritance,
  children: [
    buildMultiField({
      id: 'inheritance',
      title: m.inheritanceSelectionPrePaid,
      description: m.inheritanceSelectionDescriptionPrePaid,
      children: [
        buildCheckboxField({
          id: 'prepaidInheritance.realEstate',
          title: '',
          large: true,
          defaultValue: [],
          options: [
            {
              value: YES,
              label: m.realEstateRepeaterHeader,
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
