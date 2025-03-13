import {
  buildCheckboxField,
  buildMultiField,
  buildSection,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { PrePaidInheritanceOptions } from '../../../lib/constants'

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
          id: 'prepaidInheritance',
          large: true,
          defaultValue: [],
          options: [
            {
              value: PrePaidInheritanceOptions.REAL_ESTATE,
              label: m.realEstateRepeaterHeader,
            },
            {
              value: PrePaidInheritanceOptions.STOCKS,
              label: m.stocksTitle,
            },
            {
              value: PrePaidInheritanceOptions.MONEY,
              label: m.moneyTitlePrePaid,
            },
            {
              value: PrePaidInheritanceOptions.OTHER_ASSETS,
              label: m.otherAssetsTitle,
            },
          ],
        }),
      ],
    }),
  ],
})
