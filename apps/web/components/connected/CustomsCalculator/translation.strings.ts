import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  startAmountLabel: {
    id: 'web.customsCalculator:startAmountLabel',
    defaultMessage: 'Verð með flutningi',
    description: 'Label for the start amount',
  },
  totalAmountBreakdownLabel: {
    id: 'web.customsCalculator:totalAmountBreakdownLabel',
    defaultMessage: 'Samtals',
    description: 'Label for the total amount breakdown',
  },
  amountLabel: {
    id: 'web.customsCalculator:amountLabel',
    defaultMessage: 'Upphæð',
    description: 'Label for the amount',
  },
  breakdownLabel: {
    id: 'web.customsCalculator:breakdownLabel',
    defaultMessage: 'Sundurliðun',
    description: 'Label for the breakdown',
  },
  totalAmountLabel: {
    id: 'web.customsCalculator:totalAmountLabel',
    defaultMessage: 'Áætlað heildarverð',
    description: 'Label for the total amount',
  },
  additionalAmountLabel: {
    id: 'web.customsCalculator:additionalAmountLabel',
    defaultMessage: 'Þar af innflutningsgjöld',
    description: 'Label for the additional amount',
  },
  nedcDescription: {
    id: 'web.customsCalculator:nedcDescription',
    defaultMessage: ' ',
    description: 'Description for the nedc input',
  },
  nedcWeightedEmissionDescription: {
    id: 'web.customsCalculator:nedcWeightedEmissionDescription',
    defaultMessage: ' ',
    description: 'Description for the nedc weighted emission input',
  },
  wltpEmissionDescription: {
    id: 'web.customsCalculator:wltpEmissionDescription',
    defaultMessage: ' ',
    description: 'Description for the wltp emission input',
  },
  wltpWeightedEmissionDescription: {
    id: 'web.customsCalculator:wltpWeightedEmissionDescription',
    defaultMessage: ' ',
    description: 'Description for the wltp weighted emission input',
  },
  unitCountDescription: {
    id: 'web.customsCalculator:unitCountDescription',
    defaultMessage: ' ',
    description: 'Description for the unit count input',
  },
  percentageDescription: {
    id: 'web.customsCalculator:percentageDescription',
    defaultMessage: 'Skráið áfengisprósentu',
    description: 'Description for the percentage input',
  },
  netWeightDescription: {
    id: 'web.customsCalculator:netWeightDescription',
    defaultMessage: ' ',
    description: 'Description for the net weight input',
  },
  litersDescription: {
    id: 'web.customsCalculator:litersDescription',
    defaultMessage: 'Skráið heildarmagn í lítrum',
    description: 'Description for the liters input',
  },
  productSearchInputPlaceholder: {
    id: 'web.customsCalculator:productSearchInputPlaceholder',
    defaultMessage: 'Leitaðu eftir vöruheiti',
    description: 'Placeholder for the product search input',
  },
  productSearchInputLabel: {
    id: 'web.customsCalculator:productSearchInputLabel',
    defaultMessage: 'Vöruleit',
    description: 'Label for the product search input',
  },
  priceWithShippingDescription: {
    id: 'web.customsCalculator:priceWithShippingDescription',
    defaultMessage: 'Verð vöru komin til Íslands',
    description: 'Description for the price with shipping input',
  },
  searchForCategory: {
    id: 'web.customsCalculator:searchForCategory',
    defaultMessage: 'Leita eftir vöruflokki',
    description: 'Button label for searching for a category',
  },
  shortcutsTitle: {
    id: 'web.customsCalculator:shortcutsTitle',
    defaultMessage: 'Algengar vörur',
    description: 'Title for the shortcuts section',
  },
  tariffNumberLabel: {
    id: 'web.customsCalculator:tariffNumberLabel',
    defaultMessage: 'Tollnúmer',
    description: 'Tariff number input label',
  },
  runCalculation: {
    id: 'web.customsCalculator:runCalculation',
    defaultMessage: 'Reikna',
    description: 'Button label for running customs calculation',
  },
  priceWithShippingLabel: {
    id: 'web.customsCalculator:priceWithShippingLabel',
    defaultMessage: 'Verð með flutningi (tollverð)',
    description: 'Label for price with shipping input',
  },
  currencyLabel: {
    id: 'web.customsCalculator:currencyLabel',
    defaultMessage: 'Gjaldmiðill',
    description: 'Label for currency input',
  },
  netWeightLabel: {
    id: 'web.customsCalculator:netWeightLabel',
    defaultMessage: 'Nettóþyngd (kg)',
    description: 'Label for net weight input',
  },
  unitCountLabel: {
    id: 'web.customsCalculator:stkWeightLabel',
    defaultMessage: 'Fjöldi (stykkjatala)',
    description: 'Label for unit count input',
  },
  litersLabel: {
    id: 'web.customsCalculator:litersLabel',
    defaultMessage: 'Litrar',
    description: 'Label for liters input',
  },
  percentageLabel: {
    id: 'web.customsCalculator:percentageLabel',
    defaultMessage: 'Styrkleiki (%)',
    description: 'Label for percentage input',
  },
  nedcEmissionLabel: {
    id: 'web.customsCalculator:nedcEmissionLabel',
    defaultMessage: 'CO2-gildi (NEDC)',
    description: 'Label for nedc emission input',
  },
  nedcWeightedEmissionLabel: {
    id: 'web.customsCalculator:nedcWeightedEmissionLabel',
    defaultMessage: 'Vegið CO2-gildi (NEDC)',
    description: 'Label for nedc weighted emission input',
  },
  wltpEmissionLabel: {
    id: 'web.customsCalculator:wltpEmissionLabel',
    defaultMessage: 'CO2-gildi (WLTP)',
    description: 'Label for wltp emission input',
  },
  wltpWeightedEmissionLabel: {
    id: 'web.customsCalculator:wltpWeightedEmissionLabel',
    defaultMessage: 'Vegið CO2-gildi (WLTP)',
    description: 'Label for wltp weighted emission input',
  },
  closeModal: {
    id: 'web.customsCalculator:closeModal',
    defaultMessage: 'Loka glugga',
    description: 'Aria-label for the close button in the category modal',
  },
  categoriesErrorTitle: {
    id: 'web.customsCalculator:categoriesErrorTitle',
    defaultMessage: 'Ekki tókst að sækja vöruflokka',
    description: 'Error title shown when the product categories query fails',
  },
  categoriesErrorMessage: {
    id: 'web.customsCalculator:categoriesErrorMessage',
    defaultMessage: 'Eitthvað fór úrskeiðis. Reyndu aftur síðar.',
    description: 'Error message shown when the product categories query fails',
  },
  calculationErrorTitle: {
    id: 'web.customsCalculator:calculationErrorTitle',
    defaultMessage: 'Útreikningur mistókst',
    description: 'Error title shown when the customs calculation query fails',
  },
  calculationErrorMessage: {
    id: 'web.customsCalculator:calculationErrorMessage',
    defaultMessage: 'Ekki tókst að reikna tollverð. Reyndu aftur síðar.',
    description: 'Error message shown when the customs calculation query fails',
  },
  incompleteResultTitle: {
    id: 'web.customsCalculator:incompleteResultTitle',
    defaultMessage: 'Niðurstaðan gæti verið ófullkomin',
    description:
      'Warning title shown when one or more charge lines could not be computed',
  },
  incompleteResultMessage: {
    id: 'web.customsCalculator:incompleteResultMessage',
    defaultMessage:
      'Ekki tókst að reikna öll gjöld, svo heildarupphæðin gæti verið of lág.',
    description:
      'Warning message shown when one or more charge lines could not be computed',
  },
})
