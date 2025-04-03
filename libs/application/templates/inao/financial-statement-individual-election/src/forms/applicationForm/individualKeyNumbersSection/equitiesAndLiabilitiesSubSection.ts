import {
  buildAlertMessageField,
  buildDescriptionField,
  buildDisplayField,
  buildMultiField,
  buildSubSection,
  buildTextField,
} from '@island.is/application/core'
import { EQUITIESANDLIABILITIESIDS } from '../../../utils/constants'
import { m } from '../../../lib/messages'
import {
  showEquitiesAndLiabilitiesAlert,
  sumAssets,
  sumDebts,
  sumEquityAndLiabilities,
} from '../../../utils/sumUtils'

export const equityAndLiabilitiesSubSection = buildSubSection({
  id: 'keyNumbers.equitiesAndLiabilities',
  title: m.propertiesAndDebts,
  children: [
    buildMultiField({
      id: 'operations.equitiesAndLiabilities',
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
          id: EQUITIESANDLIABILITIESIDS.fixedAssetsTotal,
          title: m.fixedAssetsTotal,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: EQUITIESANDLIABILITIESIDS.currentAssets,
          title: m.currentAssets,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildDisplayField({
          id: EQUITIESANDLIABILITIESIDS.assetTotal,
          label: m.totalAssets,
          value: sumAssets,
          variant: 'currency',
          rightAlign: true,
        }),

        // Debts
        buildDescriptionField({
          id: 'debtsDescription',
          title: m.debts,
          titleVariant: 'h3',
        }),
        buildTextField({
          id: EQUITIESANDLIABILITIESIDS.longTerm,
          title: m.longTerm,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildTextField({
          id: EQUITIESANDLIABILITIESIDS.shortTerm,
          title: m.shortTerm,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),
        buildDisplayField({
          id: EQUITIESANDLIABILITIESIDS.totalLiability,
          label: m.totalDebts,
          value: sumDebts,
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
          id: EQUITIESANDLIABILITIESIDS.totalEquity,
          title: m.equity,
          width: 'half',
          variant: 'currency',
          rightAlign: true,
        }),

        // Equity and Liabilities
        buildDescriptionField({
          id: 'equityAndLiabilitiesDescription',
          title: m.debtsAndEquity,
          titleVariant: 'h3',
        }),
        buildDisplayField({
          id: EQUITIESANDLIABILITIESIDS.totalEquityAndLiabilities,
          label: m.debtsAndCash,
          value: sumEquityAndLiabilities,
          variant: 'currency',
          rightAlign: true,
        }),

        buildAlertMessageField({
          condition: showEquitiesAndLiabilitiesAlert,
          id: 'equitiesAndLiabilitiesAlert',
          title: m.equityErrorTitle,
          message: m.equityDebtsAssetsValidatorError,
          alertType: 'error',
        }),
      ],
    }),
  ],
})
