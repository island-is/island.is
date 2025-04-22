import {
  buildDisplayField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import { CAPITALNUMBERS } from '../../../utils/constants'
import { sumCapitalNumbers } from '../../../utils/sumUtils'

export const capitalNumberSection = buildSubSection({
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
          value: sumCapitalNumbers,
          title: m.totalCapital,
          variant: 'currency',
          rightAlign: true,
        }),
      ],
    }),
  ],
})
