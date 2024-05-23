import {
  YES,
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
  getValueViaPath,
} from '@island.is/application/core'
import { Application } from '@island.is/application/types'
import { format as formatNationalId } from 'kennitala'
import { formatCurrency } from '@island.is/application/ui-components'
import { m } from '../../lib/messages'
import { ApplicationDebts, Debt } from '../../types'
import { getEstateDataFromApplication } from '../../lib/utils/helpers'
import { YES } from '../../lib/constants'

export const debtsAndFuneralCost = buildSection({
  id: 'debts',
  title: m.debtsAndFuneralCostTitle,
  children: [
    buildSubSection({
      id: 'domesticAndForeignDebts',
      title: m.debtsTitle,
      children: [
        buildMultiField({
          id: 'domesticAndForeignDebts',
          title: m.debtsAndFuneralCost,
          description: m.debtsAndFuneralCostDescription,
          children: [
            buildDescriptionField({
              id: 'domesticAndForeignDebtsHeader',
              title: m.domesticAndForeignDebts,
              description: m.domesticAndForeignDebtsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'debts.domesticAndForeignDebts.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'debts.domesticAndForeignDebts.data',
                component: 'ReportFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.debtsCreditorName,
                    id: 'description',
                  },
                  {
                    title: m.creditorsNationalId,
                    id: 'nationalId',
                    format: '######-####',
                  },
                  {
                    title: m.debtsLoanIdentity,
                    id: 'assetNumber',
                  },
                  {
                    title: m.debtsBalance,
                    id: 'propertyValuation',
                    required: true,
                    currency: true,
                  },
                ],
                hideDeceasedShare: true,
                repeaterButtonText: m.debtsRepeaterButton,
                fromExternalData: 'otherDebts',
                sumField: 'propertyValuation',
              },
            ),
            buildDescriptionField({
              id: 'publicChargesHeader',
              title: m.publicChargesTitle,
              description: m.publicChargesDescription,
              titleVariant: 'h3',
              space: 'containerGutter',
              marginBottom: 'gutter',
            }),
            buildDescriptionField({
              id: 'debts.publicCharges.total',
              title: '',
            }),
            buildTextField({
              title: m.amount.defaultMessage,
              id: 'debts.publicCharges',
              width: 'half',
              variant: 'currency',
              defaultValue: (application: Application) => {
                return (
                  getEstateDataFromApplication(application)
                    ?.inheritanceReportInfo?.officialFees?.[0]
                    ?.propertyValuation ?? '0'
                )
              },
            }),
          ],
        }),
      ],
    }),
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
                childInputIds: [
                  'funeralCost.other',
                  'funeralCost.otherDetails',
                ],
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
      id: 'debtsAndFuneralCostOverview',
      title: m.debtsAndFuneralCostOverview,
      children: [
        buildMultiField({
          id: 'debtsAndFuneralCostOverview',
          title: m.debtsAndFuneralCostOverview,
          description: m.overviewDescription,
          children: [
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewDomesticAndForeignDebts',
              title: m.debtsTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildCustomField(
              {
                title: '',
                id: 'estateDebtsCards',
                component: 'Cards',
                doesNotRequireAnswer: true,
              },
              {
                cards: ({ answers }: Application) => {
                  const allDebts = (
                    answers.debts as unknown as ApplicationDebts
                  ).domesticAndForeignDebts.data
                  return (
                    allDebts.map((debt: Debt) => ({
                      title: debt.description ?? '',
                      description: [
                        `${m.nationalId.defaultMessage}: ${formatNationalId(
                          debt.nationalId ?? '',
                        )}`,
                        `${m.debtsLoanIdentity.defaultMessage}: ${
                          debt.assetNumber ?? ''
                        }`,
                        `${m.debtsBalance.defaultMessage}: ${formatCurrency(
                          debt.propertyValuation ?? '0',
                        )}`,
                      ],
                    })) ?? []
                  )
                },
              },
            ),
            buildDividerField({}),
            buildKeyValueField({
              label: m.totalAmountDebts,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  String(
                    getValueViaPath(
                      answers,
                      'debts.domesticAndForeignDebts.total',
                    ),
                  ),
                ),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewPublicCharges',
              title: m.publicChargesTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildCustomField(
              {
                title: '',
                id: 'chargesCards',
                component: 'Cards',
                doesNotRequireAnswer: true,
              },
              {
                cards: ({ answers }: Application) => {
                  const publicCharges = (
                    answers.debts as unknown as ApplicationDebts
                  ).publicCharges
                  return publicCharges
                    ? [
                        {
                          title: m.publicChargesTitle.defaultMessage,
                          description: [`${formatCurrency(publicCharges)}`],
                        },
                      ]
                    : []
                },
              },
            ),
            buildDividerField({}),
            buildKeyValueField({
              label: m.totalAmountPublic,
              display: 'flex',
              value: ({ answers }) => {
                const value =
                  getValueViaPath<string>(answers, 'debts.publicCharges') || '0'
                return formatCurrency(value)
              },
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewFuneralCost',
              title: m.funeralCostTitle,
              titleVariant: 'h3',
              marginBottom: 'p3',
              space: 'containerGutter',
            }),
            buildKeyValueField({
              label: m.funeralBuildCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.build') || '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralCremationCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.cremation') ||
                    '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralPrintCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.print') || '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralFlowersCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.flowers') ||
                    '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralMusicCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.music') || '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralRentCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.rent') || '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralFoodAndDrinkCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.food') || '0',
                ),
            }),
            buildKeyValueField({
              label: m.funeralTombstoneCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.tombstone') ||
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
                  getValueViaPath<string>(answers, 'funeralCost.other') || '0',
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
                  ) || ''
                )
              },
            }),
            buildDividerField({}),
            buildKeyValueField({
              label: m.totalAmountFuneralCost,
              display: 'flex',
              value: ({ answers }) =>
                formatCurrency(
                  getValueViaPath<string>(answers, 'funeralCost.total') || '0',
                ),
            }),
            buildDividerField({}),
            buildCustomField({
              title: '',
              id: 'debts.debtsTotal',
              doesNotRequireAnswer: true,
              component: 'CalculateTotalDebts',
            }),
          ],
        }),
      ],
    }),
  ],
})
