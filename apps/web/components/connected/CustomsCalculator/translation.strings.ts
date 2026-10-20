import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  startAmountLabel: {
    id: 'web.customsCalculator:startAmountLabel',
    defaultMessage: 'Verð með flutningi',
    description: 'Label for the start amount',
  },
  amountLabel: {
    id: 'web.customsCalculator:amountLabel',
    defaultMessage: 'Upphæð (kr.)',
    description: 'Label for the amount',
  },
  explanationLabel: {
    id: 'web.customsCalculator:explanationLabel',
    defaultMessage: 'Skýring',
    description: 'Column title for the explanation in the breakdown',
  },
  importFeesLabel: {
    id: 'web.customsCalculator:importFeesLabel',
    defaultMessage: 'Innflutningsgjöld',
    description: 'Label for the total import fees',
  },
  disclaimer: {
    id: 'web.customsCalculator:disclaimer',
    defaultMessage:
      'Útreikningur miðast við þær forsendur sem þú gafst upp hér að ofan. Við komu til landsins er varan flokkuð í réttan tollflokk af sérfræðingum.',
    description: 'Disclaimer shown below the calculation results',
  },
  exchangeRateDisclaimer: {
    id: 'web.customsCalculator:exchangeRateDisclaimer',
    defaultMessage:
      'Gjöld sem lögð eru á vöru miðast við <link>tollafgreiðslugengi</link> eins og það er á þeim degi sem hún er tollafgreidd. Nákvæmt og endanlegt verð liggur því aldrei fyrir fyrr en við tollafgreiðslu vöru.',
    description:
      'Exchange rate disclaimer shown below the calculation results, the text inside <link></link> links to the exchange rates',
  },
  exchangeRateDisclaimerLinkUrl: {
    id: 'web.customsCalculator:exchangeRateDisclaimerLinkUrl',
    defaultMessage:
      'https://www.skatturinn.is/atvinnurekstur/tollamal/tollafgreidslugengi/gengi-gjaldmidla/',
    description: 'Link to the exchange rates in the exchange rate disclaimer',
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
  keywordsLabel: {
    id: 'web.customsCalculator:keywordsLabel',
    defaultMessage: 'Lykilorð',
    description:
      'Label for the keywords shown under a product category in search results',
  },
  clearProductSearchInputLabel: {
    id: 'web.customsCalculator:clearProductSearchInputLabel',
    defaultMessage: 'Hreinsa leit',
    description: 'Aria label for the product search input clear button',
  },
  priceWithShippingDescription: {
    id: 'web.customsCalculator:priceWithShippingDescription',
    defaultMessage:
      'Verð vöru komin til Íslands. Reiknivélin notar tollafgreiðslugengi dagsins við útreikninga.',
    description: 'Description for the price with shipping input',
  },
  searchForCategory: {
    id: 'web.customsCalculator:searchForCategory',
    defaultMessage: 'Leita eftir vöruflokki',
    description: 'Button label for searching for a category',
  },
  descriptionConjunction: {
    id: 'web.customsCalculator:descriptionConjunction',
    defaultMessage: 'og',
    description:
      'Word joining the last two input descriptions, e.g. "Skráið áfengisprósentu og heildarmagn í lítrum"',
  },
  priceSectionTitle: {
    id: 'web.customsCalculator:priceSectionTitle',
    defaultMessage: 'Verð',
    description: 'Title for the price section',
  },
  productInfoSectionTitle: {
    id: 'web.customsCalculator:productInfoSectionTitle',
    defaultMessage: 'Upplýsingar um vöru',
    description: 'Title for the product information section',
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
