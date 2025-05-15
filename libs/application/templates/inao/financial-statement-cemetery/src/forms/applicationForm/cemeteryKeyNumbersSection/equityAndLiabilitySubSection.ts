import {
  buildAlertMessageField,
  buildDescriptionField,
  buildDisplayField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { m } from '../../../lib/messages'
import {
  CEMETERYEQUITIESANDLIABILITIESIDS,
  EQUITYANDLIABILITIESTOTALS,
} from '../../../utils/constants'
import {
  operationResult,
  sumLiabilities,
  sumTotalEquityAndLiabilities,
  sumTotalEquity,
  showEquitiesAndLiabilitiesAlert,
  sumAssets,
} from '../../../utils/sums'

export const equityAndLiabilitiesSubSection = buildSubSection({
  id: 'keyNumbers.cemetryEquitiesAndLiabilities',
  title: m.propertiesAndDebts,
  children: [
    buildMultiField({
      id: 'cemetryEquitiesAndLiabilities',
      title: m.keyNumbersDebt,
      description: m.fillOutAppopriate,
      children: [
        // Assets
        buildDescriptionField({
          id: 'assetsDescription',
          title: m.properties,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: CEMETERYEQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
          title: m.fixedAssetsTotal,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYEQUITIESANDLIABILITIESIDS.currentAssets,
          title: m.currentAssets,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildDisplayField({
          id: EQUITYANDLIABILITIESTOTALS.assetsTotal,
          label: m.totalAssets,
          value: sumAssets,
          variant: 'currency',
          rightAlign: true,
        }),

        // Debt
        buildDescriptionField({
          id: 'debtsDescription',
          title: m.debts,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: CEMETERYEQUITIESANDLIABILITIESIDS.longTerm,
          title: m.longTerm,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYEQUITIESANDLIABILITIESIDS.shortTerm,
          title: m.shortTerm,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildDisplayField({
          id: EQUITYANDLIABILITIESTOTALS.liabilitiesTotal,
          label: m.totalLiabilities,
          value: sumLiabilities,
          variant: 'currency',
          rightAlign: true,
        }),

        // Equity
        buildDescriptionField({
          id: 'equityDescription',
          title: m.equity,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: CEMETERYEQUITIESANDLIABILITIESIDS.equityAtTheBeginningOfTheYear,
          title: m.equityAtTheBeginningOfTheYear,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYEQUITIESANDLIABILITIESIDS.revaluationDueToPriceChanges,
          title: m.revaluationDueToPriceChanges,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: CEMETERYEQUITIESANDLIABILITIESIDS.reevaluateOther,
          title: m.reevaluateOther,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildDisplayField({
          id: CEMETERYEQUITIESANDLIABILITIESIDS.operationResult,
          label: m.operationResult,
          value: operationResult,
          variant: 'currency',
          rightAlign: true,
          width: 'half',
        }),
        buildDisplayField({
          id: CEMETERYEQUITIESANDLIABILITIESIDS.equityTotal,
          label: m.totalEquity,
          value: sumTotalEquity,
          variant: 'currency',
          rightAlign: true,
        }),

        // Debts and Equity
        buildDescriptionField({
          id: 'debtsAndEquityDescription',
          title: m.debtsAndCash,
          titleVariant: 'h3',
        }),
        buildDisplayField({
          id: EQUITYANDLIABILITIESTOTALS.equityAndLiabilitiesTotal,
          value: sumTotalEquityAndLiabilities,
          variant: 'currency',
          rightAlign: true,
        }),

        buildAlertMessageField({
          condition: showEquitiesAndLiabilitiesAlert,
          id: 'equityAndLiabilityError',
          title: m.equityErrorTitle,
          message: m.equityDebtsAssetsValidatorError,
          alertType: 'error',
        }),
      ],
    }),
  ],
})
