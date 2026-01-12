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
  EQUITIESANDLIABILITIESIDS,
  EQUITYANDLIABILITIESTOTALS,
} from '../../../utils/constants'
import {
  showEquitiesAndLiabilitiesAlert,
  sumDebts,
  sumEquityAndDebts,
  sumProperties,
} from '../../../utils/helpers'

export const equitiesAndLiabilitiesSubsection = buildSubSection({
  id: 'keyNumbers.equitiesAndLiabilities',
  title: m.propertiesAndDebts,
  children: [
    buildMultiField({
      id: 'equitiesAndLiabilitiesMultiField',
      title: m.keyNumbersDebt,
      children: [
        // Assets
        buildDescriptionField({
          id: 'propertiesDescription',
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
          id: EQUITYANDLIABILITIESTOTALS.assetsTotal,
          label: m.totalAssets,
          value: sumProperties,
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
          id: EQUITYANDLIABILITIESTOTALS.liabilitiesTotal,
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

        // Total Equity and Liabilities
        buildDisplayField({
          id: EQUITYANDLIABILITIESTOTALS.equityAndLiabilitiesTotal,
          title: m.debtsAndCash,
          titleVariant: 'h3',
          value: sumEquityAndDebts,
          variant: 'currency',
          rightAlign: true,
        }),

        // Alert if total equity and liabilities do not match total assets
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
