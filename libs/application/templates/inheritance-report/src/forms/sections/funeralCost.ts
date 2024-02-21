import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  getValueViaPath,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { formatCurrency } from '@island.is/application/ui-components'
import { YES } from '../../lib/constants'

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
            buildCustomField(
              {
                title: '',
                id: 'funeralCost',
                doesNotRequireAnswer: false,
                component: 'FuneralCost',
              },
              {
                fields: [
                  {
                    id: 'build',
                    title: m.funeralBuildCost,
                  },
                  {
                    id: 'cremation',
                    title: m.funeralCremationCost,
                  },
                  {
                    id: 'print',
                    title: m.funeralPrintCost,
                  },
                  {
                    id: 'flowers',
                    title: m.funeralFlowersCost,
                  },
                  {
                    id: 'music',
                    title: m.funeralMusicCost,
                  },
                  {
                    id: 'rent',
                    title: m.funeralRentCost,
                  },
                  {
                    id: 'food',
                    title: m.funeralFoodAndDrinkCost,
                  },
                  {
                    id: 'tombstone',
                    title: m.funeralTombstoneCost,
                  },
                ],
              },
            ),
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
            buildDescriptionField({
              id: 'overviewFuneralCost',
              title: m.funeralCostTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.funeralBuildCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.build') ?? '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralCremationCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.cremation') ??
                    '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralPrintCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.print') ?? '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralFlowersCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.flowers') ??
                    '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralMusicCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.music') ?? '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralRentCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.rent') ?? '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralFoodAndDrinkCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.food') ?? '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralTombstoneCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.tombstone') ??
                    '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralOtherCostQuestion,
              display: 'flex',
              condition: (answers) =>
                !getValueViaPath<string[]>(
                  answers,
                  'funeralCost.hasOther',
                )?.includes(YES),
              value: ({ answers }) =>
                getValueViaPath<string[]>(
                  answers,
                  'funeralCost.hasOther',
                )?.includes(YES)
                  ? m.yes
                  : m.no,
            }),
            buildKeyValueField({
              label: m.funeralOtherCost,
              display: 'flex',
              condition: (answers) =>
                !!getValueViaPath<string[]>(
                  answers,
                  'funeralCost.hasOther',
                )?.includes(YES),
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.other') ?? '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralOtherCostDetailsOverview,
              display: 'block',
              condition: (answers) =>
                !!getValueViaPath<string[]>(
                  answers,
                  'funeralCost.hasOther',
                )?.includes(YES),
              value: ({ answers }) => {
                return (
                  getValueViaPath<string>(
                    answers,
                    'funeralCost.otherDetails',
                  ) ?? ''
                )
              },
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: m.totalAmount,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.total') ?? '0',
                ),
            }),
          ],
        }),
      ],
    }),
  ],
})
