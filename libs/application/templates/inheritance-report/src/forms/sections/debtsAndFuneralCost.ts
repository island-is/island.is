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
import { FuneralAssetItem } from '@island.is/clients/syslumenn'

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
                    type: FuneralAssetItem.Casket,
                  },
                  {
                    id: 'cremation',
                    title: m.funeralCremationCost,
                    type: FuneralAssetItem.Cremation,
                  },
                  {
                    id: 'print',
                    title: m.funeralPrintCost,
                    type: FuneralAssetItem.Printing,
                  },
                  {
                    id: 'flowers',
                    title: m.funeralFlowersCost,
                    type: FuneralAssetItem.Flowers,
                  },
                  {
                    id: 'music',
                    title: m.funeralMusicCost,
                    type: FuneralAssetItem.Music,
                  },
                  {
                    id: 'rent',
                    title: m.funeralRentCost,
                    type: FuneralAssetItem.Venue,
                  },
                  {
                    id: 'food',
                    title: m.funeralFoodAndDrinkCost,
                    type: FuneralAssetItem.Wake,
                  },
                  {
                    id: 'tombstone',
                    title: m.funeralTombstoneCost,
                    type: FuneralAssetItem.Tombstone,
                  },
                  {
                    id: 'service',
                    title: m.funeralServiceCost,
                    type: FuneralAssetItem.FuneralServices,
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
