import {
  buildCustomField,
  buildDescriptionField,
  buildDividerField,
  buildKeyValueField,
  buildMultiField,
  buildSection,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { formatCurrency } from '@island.is/application/ui-components'
import { m } from '../lib/messages'
import { Application } from '@island.is/api/schema'

export const debts = buildSection({
  id: 'debts',
  title: m.debtsTitle,
  children: [
    buildSubSection({
      id: 'funeralCost',
      title: m.funeralCostTitle,
      children: [
        buildMultiField({
          id: 'funeralCost',
          title: m.debtsTitle,
          description: '',
          children: [
            buildDescriptionField({
              id: 'funeralCostHeader',
              title: m.funeralCostTitle,
              titleVariant: 'h3',
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
      id: 'domesticAndForeignDebts',
      title: m.debtsTitle,
      children: [
        buildMultiField({
          id: 'domesticAndForeignDebts',
          title: m.debtsAndFuneralCost,
          description: '',
          children: [
            buildDescriptionField({
              id: 'domesticAndForeignDebtsHeader',
              title: m.domesticAndForeignDebts,
              description: m.domesticAndForeignDebtsDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'domesticAndForeignDebts.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'domesticAndForeignDebts.data',
                component: 'TextFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.debtsCreditorName.defaultMessage,
                    id: 'creditorName',
                  },
                  {
                    title: m.debtsSsn.defaultMessage,
                    id: 'ssn',
                    format: '######-####',
                  },
                  {
                    title: m.debtsBalance.defaultMessage,
                    id: 'balance',
                    currency: true,
                  },
                ],
                repeaterButtonText: m.debtsRepeaterButton.defaultMessage,
                repeaterHeaderText: m.debtsCreditorHeader.defaultMessage,
                sumField: 'balance',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'publicCharges',
      title: m.publicChargesTitle,
      children: [
        buildMultiField({
          id: 'publicCharges',
          title: m.publicChargesTitle,
          description: '',
          children: [
            buildDescriptionField({
              id: 'publicChargesHeader',
              title: m.publicChargesTitle,
              description: m.publicChargesDescription,
              titleVariant: 'h3',
            }),
            buildDescriptionField({
              id: 'publicCharges.total',
              title: '',
            }),
            buildCustomField(
              {
                title: '',
                id: 'publicCharges.data',
                component: 'TextFieldsRepeater',
              },
              {
                fields: [
                  {
                    title: m.amount.defaultMessage,
                    id: 'publicChargesAmount',
                    width: 'full',
                  },
                ],
                repeaterButtonText:
                  m.publicChargesRepeaterButton.defaultMessage,
                repeaterHeaderText: m.publicChargeHeader.defaultMessage,
                sumField: 'publicChargesAmount',
              },
            ),
          ],
        }),
      ],
    }),
    buildSubSection({
      id: 'debtsOverview',
      title: m.overview,
      children: [
        buildMultiField({
          id: 'debtsOverview',
          title: m.overview,
          description: '',
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
              value: ({ answers }) =>
                formatCurrency(String(answers.funeralCostAmount)),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewDomesticAndForeignDebts',
              title: m.debtsTitle,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildKeyValueField({
              label: m.totalAmount,
              value: ({ answers }) =>
                formatCurrency(
                  String((answers.domesticAndForeignDebts as any)?.total),
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
            buildKeyValueField({
              label: m.totalAmount,
              value: ({ answers }) =>
                formatCurrency(String((answers.publicCharges as any)?.total)),
            }),
            buildDividerField({}),
            buildDescriptionField({
              id: 'overviewAllDebtsWorth',
              title: m.totalValueOfDebts,
              titleVariant: 'h3',
              marginBottom: 'gutter',
              space: 'gutter',
            }),
            buildTextField({
              id: 'debtsTotal',
              title: 'Samtals alls',
              readOnly: true,
              width: 'half',
              variant: 'currency',
              rightAlign: true,
              backgroundColor: 'white',
              defaultValue: ({ answers }: Application) => {
                const total =
                  Number(answers.funeralCostAmount) +
                  (answers.domesticAndForeignDebts as any)?.total +
                  (answers.publicCharges as any)?.total

                return total
              },
            }),
          ],
        }),
      ],
    }),
  ],
})
