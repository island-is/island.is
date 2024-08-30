import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  mainHeading: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:mainHeading',
    defaultMessage: 'Bráðabirgðaútreikningur',
    description: 'Titill á útreikning vegna uppkaupa fasteigna í Grindavík',
  },
  currencySuffix: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:currencySuffix',
    defaultMessage: ' kr.',
    description: 'Gjaldeyrisviðskeyti',
  },
  thorkatlaPaymentDisclaimer: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:thorkatlaPaymentDisclaimer',
    defaultMessage:
      'Seljandi getur valið afhendingardagsetningu á bilinu 1-3 mánuðum eftir kaupsamning. Afsal fer fram einum mánuði frá afhendingu.',
    description: 'Texti fyrir greiðslufyrirvara skilaboð',
  },
  purchaseAgreementPaymentDisclaimer: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:purchaseAgreementPaymentDisclaimer',
    defaultMessage:
      'Samhliða afsalsgreiðslu fer fram lögskilauppgjör sem kemur til hækkunar eða lækkunar á afsalsgreiðslu.',
    description: 'Texti fyrir greiðslufyrirvara kaupsamnings',
  },
  fireInsuranceValueHeading: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:fireInsuranceValueHeading',
    defaultMessage: 'Brunabótamat eignar',
    description: 'Titill fyrir brunabótamat eignar',
  },
  fireInsuranceValueLabel: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:fireInsuranceValueLabel',
    defaultMessage: 'Brunabótamat',
    description: 'Label fyrir brunabótamat input',
  },
  currencyInputPlaceholder: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:currencyInputPlaceholder',
    defaultMessage: 'kr.',
    description: 'Gjaldmiðill sem birtist í input reitum',
  },
  thorkatlaPurchasePriceLabel: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:thorkatlaPurchasePriceLabel',
    defaultMessage: 'Kaupverð Þórkötlu (95% af brunabótamati)',
    description: 'Label fyrir kaupverð Þórkötlu (95% af brunabótamati)',
  },
  loanHeading: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:loanHeading',
    defaultMessage: 'Áhvílandi lán',
    description: 'Áhvílandi lán',
  },
  loanLabel: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:loanLabel',
    defaultMessage: 'Lán',
    description: 'Label fyrir lán input',
  },
  removeLoan: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:removeLoan',
    defaultMessage: 'Eyða láni',
    description: 'Eyða láni',
  },
  appendLoan: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:appendLoan',
    defaultMessage: 'Bæta við láni',
    description: 'Bæta við láni',
  },
  calculate: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:calculate',
    defaultMessage: 'Reikna',
    description: 'Reikna',
  },
  resultsHeading: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:resultsHeading',
    defaultMessage: 'Niðurstöður',
    description: 'Niðurstöður',
  },
  thorkatlaPaymentLabel: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:thorkatlaPaymentLabel',
    defaultMessage: 'Greitt til seljenda',
    description: 'Label fyrir greiðslu til seljanda',
  },
  breakdown: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:breakdown',
    defaultMessage: 'Sundurliðun',
    description: 'Sundurliðun',
  },
  purchaseAgreementPaymentLabel: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:purchaseAgreementPaymentLabel',
    defaultMessage: 'Greitt við kaupsamning',
    description: 'Label fyrir greitt við kaupsamning',
  },
  closingPaymentLabel: {
    id: 'web.GrindavikResidentialPropertyPurchaseCalculator:closingPaymentLabel',
    defaultMessage: 'Greitt við afsal (5% af kaupvirði)',
    description: 'Label fyrir greiðslu við afsal',
  },
})
