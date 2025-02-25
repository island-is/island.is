import {
  buildCheckboxField,
  buildCustomField,
  buildDescriptionField,
  buildMultiField,
  buildSection,
  buildSubSection,
  YES,
} from '@island.is/application/core'
import { m } from '../../lib/messages'
import { DebtTypes } from '../../types'

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
                    title: m.debtType,
                    id: 'debtType',
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
                sumField: 'propertyValuation',
                selections: [
                  {
                    label: DebtTypes.PublicCharges,
                  },
                  {
                    label: DebtTypes.Loan,
                  },
                  {
                    label: DebtTypes.CreditCard,
                  },
                  {
                    label: DebtTypes.Overdraft,
                  },
                  {
                    label: DebtTypes.PropertyFees,
                  },
                  {
                    label: DebtTypes.OtherDebts,
                  },
                  {
                    label: DebtTypes.InsuranceInstitute,
                  },
                ],
              },
            ),
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
                  {
                    id: 'service',
                    title: m.funeralServiceCost,
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
      title: m.overview,
      children: [
        buildMultiField({
          id: 'debtsAndFuneralCostOverview',
          title: m.debtsAndFuneralCostOverview,
          description: m.overviewDescription,
          children: [
            buildCustomField({
              description: '',
              id: 'overviewDebts',
              component: 'OverviewDebts',
            }),
            buildCustomField({
              id: 'debts.debtsTotal',
              doesNotRequireAnswer: true,
              component: 'CalculateTotalDebts',
            }),
            buildDescriptionField({
              id: 'space',
              marginBottom: 'containerGutter',
            }),
            buildCheckboxField({
              id: 'debtsConfirmation',
              large: false,
              backgroundColor: 'white',
              options: [{ value: YES, label: m.debtsOverviewConfirmation }],
            }),
            buildCustomField({
              id: 'overviewPrint',
              doesNotRequireAnswer: true,
              component: 'PrintScreen',
            }),
          ],
        }),
      ],
    }),
  ],
})
