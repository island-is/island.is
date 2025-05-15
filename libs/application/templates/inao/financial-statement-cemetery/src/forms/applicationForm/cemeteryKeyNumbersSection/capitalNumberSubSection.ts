import {
  buildDisplayField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { CAPITALNUMBERS } from '../../../utils/constants'
import { sumCapitalNumbers } from '../../../utils/sums'

export const capitalNumberSubSection = buildSubSection({
  id: 'keynumbers.capitalNumbers',
  title: m.capitalNumbers,
  children: [
    buildMultiField({
      id: 'capitalNumber',
      title: m.capitalNumbersSectionTitle,
      description: m.fillOutAppopriate,
      children: [
        buildTextField({
          id: CAPITALNUMBERS.capitalIncome,
          title: m.capitalIncome,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CAPITALNUMBERS.capitalCost,
          title: m.capitalCost,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildDisplayField({
          id: CAPITALNUMBERS.total,
          label: m.totalCapital,
          value: sumCapitalNumbers,
          variant: 'currency',
          rightAlign: true,
        }),
      ],
    }),
  ],
})
