import {
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
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
            buildDescriptionField({
              id: 'overviewFuneralCost',
              title: m.funeralCostTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildTextField({
              id: 'buildCost',
              title: m.buildCost,
              width: 'half',
              variant: 'currency',
            }),
            buildTextField({
              id: 'cremationCost',
              title: m.cremationCost,
              width: 'half',
              variant: 'currency',
            }),
            buildTextField({
              id: 'printCost',
              title: m.printCost,
              width: 'half',
              variant: 'currency',
            }),
            buildTextField({
              id: 'flowerCost',
              title: m.flowerCost,
              width: 'half',
              variant: 'currency',
            }),
            buildTextField({
              id: 'musicCost',
              title: m.musicCost,
              width: 'half',
              variant: 'currency',
            }),
            buildTextField({
              id: 'rentCost',
              title: m.rentCost,
              width: 'half',
              variant: 'currency',
            }),
            buildTextField({
              id: 'foodAndDrinkCost',
              title: m.foodAndDrinkCost,
              width: 'half',
              variant: 'currency',
            }),
            buildTextField({
              id: 'tombstoneCost',
              title: m.tombstoneCost,
              width: 'half',
              variant: 'currency',
            }),
            buildTextField({
              id: 'otherCostQuestion',
              title: m.otherCostQuestion,
              width: 'half',
              variant: 'currency',
            }),
            buildTextField({
              id: 'otherCost',
              title: m.otherCost,
              width: 'half',
              variant: 'currency',
            }),
            buildTextField({
              id: 'otherCostDetails',
              title: m.otherCostDetails,
              width: 'half',
              variant: 'currency',
            }),
            buildTextField({
              id: 'totalAmount',
              title: m.totalAmount,
              width: 'half',
              variant: 'currency',
            }),
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
            buildDescriptionField({
              id: 'overviewFuneralCost',
              title: m.funeralCostTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.buildCost,
              display: 'flex',
              value: ({ answers }) => formatCurrency(String(answers.buildCost)),
            }),
            buildKeyValueField({
              label: m.cremationCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(String(answers.cremationCost)),
            }),
            buildKeyValueField({
              label: m.printCost,
              display: 'flex',
              value: ({ answers }) => formatCurrency(String(answers.printCost)),
            }),
            buildKeyValueField({
              label: m.flowerCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(String(answers.flowerCost)),
            }),
            buildKeyValueField({
              label: m.musicCost,
              display: 'flex',
              value: ({ answers }) => formatCurrency(String(answers.musicCost)),
            }),
            buildKeyValueField({
              label: m.rentCost,
              display: 'flex',
              value: ({ answers }) => formatCurrency(String(answers.rentCost)),
            }),
            buildKeyValueField({
              label: m.foodAndDrinkCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(String(answers.foodAndDrinkCost)),
            }),
            buildKeyValueField({
              label: m.tombstoneCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(String(answers.tombstoneCost)),
            }),
            buildKeyValueField({
              label: m.otherCostQuestion,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(String(answers.otherCostQuestion)),
            }),
            buildKeyValueField({
              label: m.otherCost,
              display: 'flex',
              value: ({ answers }) => formatCurrency(String(answers.otherCost)),
            }),
            buildKeyValueField({
              label: m.otherCostDetails,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(String(answers.otherCostDetails)),
            }),
            buildKeyValueField({
              label: m.totalAmount,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(String(answers.funeralCostAmount)),
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
