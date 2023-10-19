import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../lib/messages'
import { formatCurrency } from '@island.is/application/ui-components'

export const funeralCost = buildSection({
  id: 'funeralCost',
  title: m.funeralCostTitle,
  children: [
    buildSubSection({
      id: 'funeralCost',
      title: m.funeralCostTitle,
      children: [
        buildMultiField({
          id: 'funeralCost',
          title: m.funeralCostTitle,
          description: m.funeralCostDescription,
          children: [
            buildTextField({
              id: 'funeralCostAmount',
              title: m.amount,
              width: 'half',
              variant: 'currency',
            }),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'funeralCostOverview',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'funeralCostOverview',
          title: m.overview,
          description: m.overviewDescription,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewFuneralCost',
              title: m.funeralCostTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.totalAmount,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(String(answers.funeralCostAmount)),
            }),
          ],
        }),
      ],
    }),
  ],
})
