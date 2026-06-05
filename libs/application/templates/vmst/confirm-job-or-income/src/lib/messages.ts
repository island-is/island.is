import { defineMessages } from 'react-intl'

export const application = defineMessages({
  institutionName: {
    id: 'vmst.cjoi.application:institutionName',
    defaultMessage: 'Vinnumálastofnun',
    description: `Institution's name`,
  },
  name: {
    id: 'vmst.cjoi.application:name',
    defaultMessage: 'Tilkynna um vinnu eða tekjur',
    description: `Application's name`,
  },
  pageTitle: {
    id: 'vmst.cjoi.application:pageTitle',
    defaultMessage: 'Tilkynna um vinnu eða tekjur',
    description: `Page title`,
  },
  pageDescription: {
    id: 'vmst.cjoi.application:pageDescription',
    defaultMessage:
      'Ef þú vinnur eða færð tekjur samhliða atvinnuleysisbótum þarftu að tilkynna það til Vinnumálastofnunar. Þetta á við um alla launaða vinnu. Hvort sem er fast starf, hlutastarf eða tilfallandi vinnu.',
    description: `Page description`,
  },
  pageInfo: {
    id: 'vmst.cjoi.application:pageInfo',
    defaultMessage:
      'Mikilvægt: Tilkynna þarf vinnu í síðasta lagi daginn áður en hún hefst',
    description: `Page info`,
  },
  applicationName: {
    id: 'vmst.cjoi.application:applicationName',
    defaultMessage: 'Tilkynna um vinnu eða tekjur',
    description: `Application's name`,
  },
  incomeSectionTitle: {
    id: 'vmst.cjoi.application:incomeSectionTitle',
    defaultMessage: 'Skrá tekjur',
    description: 'Title for the income section',
  },
  incomeTypeTitle: {
    id: 'vmst.cjoi.application:incomeTypeTitle',
    defaultMessage: 'Tegund tekna',
    description: `Title for select field for type of income`,
  },
  incomeTypeCasualWork: {
    id: 'vmst.cjoi.application:incomeTypeCasualWork',
    defaultMessage: 'Tilkynna um tilfallandi vinnu (launþegavinnu)',
    description: 'Income type option: casual work',
  },
  incomeTypePartTime: {
    id: 'vmst.cjoi.application:incomeTypePartTime',
    defaultMessage: 'Tilkynna um hlutastarf',
    description: 'Income type option: part-time work',
  },
  incomeTypeContractWork: {
    id: 'vmst.cjoi.application:incomeTypeContractWork',
    defaultMessage: 'Tilkynna um verktakavinnu',
    description: 'Income type option: contract work',
  },
  incomeTypePension: {
    id: 'vmst.cjoi.application:incomeTypePension',
    defaultMessage: 'Tilkynna um greiðslur úr lífeyrissjóði',
    description: 'Income type option: pension payments',
  },
  incomeTypeCapitalIncome: {
    id: 'vmst.cjoi.application:incomeTypeCapitalIncome',
    defaultMessage: 'Tilkynna um fjármagnstekjur',
    description: 'Income type option: capital income',
  },
  incomeTypeSocialInsurance: {
    id: 'vmst.cjoi.application:incomeTypeSocialInsurance',
    defaultMessage: 'Tilkynna um tekjur frá Tryggingastofnun',
    description: 'Income type option: social insurance income',
  },

  // Casual work descriptions
  casualWorkDescription: {
    id: 'vmst.cjoi.application:casualWorkDescription',
    defaultMessage:
      'Tilfallandi vinna er vinna sem er óregluleg eða í stuttan tíma. Til dæmis einstaka vaktir eða skammtímaverkefni.',
    description: 'Description for casual work type',
  },
  casualWorkInfoTitle: {
    id: 'vmst.cjoi.application:casualWorkInfoTitle',
    defaultMessage: 'Þetta þarftu að vita:',
    description: 'Casual work info section title',
  },
  casualWorkInfoBullets: {
    id: 'vmst.cjoi.application:casualWorkInfoBullets#markdown',
    defaultMessage:
      '* Tilkynna þarf allar tilfallandi vinnu í hverjum mánuði\n* Þetta gildir jafnvel þótt þú hafir unnið hjá sama atvinnurekanda áður\n* Vinna er skráð mánaðarlega. Ekki þarf að tilkynna hvern dag fyrir sig\n* Ekki þarf að skila launaseðli',
    description: 'Casual work info bullets',
  },

  // Part-time descriptions
  partTimeDescription: {
    id: 'vmst.cjoi.application:partTimeDescription',
    defaultMessage:
      'Hlutastarf er starf í minna en 100% starfshlutfalli sem varir lengur en einn mánuð. Þú getur verið áfram skráður í atvinnuleit samhliða hlutastarfi og átt rétt á atvinnuleysisbótum. En það fer eftir einstaklingsbunum bótarétti. Ekki þarf að skila launaseðli vegna hlutastarfa.',
    description: 'Description for part-time work type',
  },
  partTimeAlert: {
    id: 'vmst.cjoi.application:partTimeAlert',
    defaultMessage:
      'Ef eitthvað breytist varðandi hlutastarf þitt, hvort sem er tekjur, starfshlutfall eða lok starfs, þarftu að tilkynna það aftur með sama hætti.',
    description: 'Alert for part-time work',
  },
  partTimeAlertTitle: {
    id: 'vmst.cjoi.application:partTimeAlertTitle',
    defaultMessage: 'Þarftu að gera breytingar?',
    description: 'Alert title for part-time work',
  },

  // Contract work descriptions
  contractWorkDescription: {
    id: 'vmst.cjoi.application:contractWorkDescription',
    defaultMessage:
      'Verktakar eru sjálfstætt starfandi einstaklingar á eigin kennitölu sem bera sjálfir ábyrgð á greiðslu lífeyrissjóðs, trygginga, skatta og annarra opinberra gjalda.',
    description: 'Description for contract work type',
  },
  contractWorkAlert: {
    id: 'vmst.cjoi.application:contractWorkAlert#markdown',
    defaultMessage:
      'Verktakar eiga ekki rétt á atvinnuleysisbótum þá daga sem þeir skrá verktakavinnu. Skráðu eingöngu það tímabil sem vinnan er innt af hendi:\n* **Ósamfelld vinna:** Ef þú vinnur til dæmis á mánudegi og fimmtudegi, skráir þú tvö aðskilin tímabil.\n* **Samfelld vinna:** Ef þú vinnur frá mánudegi til föstudags, skráir þú eitt tímabil með upphafs- og lokadegi',
    description: 'Alert for contract work',
  },
  contractWorkAlertTitle: {
    id: 'vmst.cjoi.application:contractWorkAlertTitle',
    defaultMessage: 'Athugið',
    description: 'Alert title for contract work',
  },

  // Capital income descriptions
  capitalIncomeDescription: {
    id: 'vmst.cjoi.application:capitalIncomeDescription',
    defaultMessage:
      'Ef þú færð fjármagnstekjur þarftu að tilkynna tegund teknanna og upphæð fyrir skatt. Fjármagnstekjur eru til dæmis: arðgreiðslur, leigutekjur eða vaxtatekjur.',
    description: 'Description for capital income type',
  },

  // Social insurance descriptions
  socialInsuranceDescription: {
    id: 'vmst.cjoi.application:socialInsuranceDescription',
    defaultMessage:
      'Ef þú færð greiðslur frá Tryggingastofnun þarftu að tilkynna tegund greiðslunnar og mánaðarlega upphæð fyrir skatt.',
    description: 'Description for social insurance type',
  },

  // Pension descriptions
  pensionDescription: {
    id: 'vmst.cjoi.application:pensionDescription',
    defaultMessage:
      'Ef þú færð greiðslur frá lífeyrissjóði þarftu að tilkynna tegund greiðslunnar og mánaðarlega upphæð fyrir skatt. Þú getur skráð fleiri en eina greiðslu ef þú færð greiðslur frá fleiri en einum aðila.',
    description: 'Description for pension type',
  },
  pensionFund: {
    id: 'vmst.cjoi.application:pensionFund',
    defaultMessage: 'Lífeyrissjóður',
    description: 'Pension fund label',
  },
  pensionAmountPerMonth: {
    id: 'vmst.cjoi.application:pensionAmountPerMonth',
    defaultMessage: 'Upphæð á mánuði',
    description: 'Pension amount per month label',
  },

  // Field labels
  companyNationalId: {
    id: 'vmst.cjoi.application:companyNationalId',
    defaultMessage: 'Kennitala fyrirtækis',
    description: 'Company national ID label',
  },
  addLine: {
    id: 'vmst.cjoi.application:addLine',
    defaultMessage: 'Bæta við línu',
    description: 'Add line button text for repeater',
  },
  entryTitle: {
    id: 'vmst.cjoi.application:entryTitle',
    defaultMessage: 'Lína',
    description: 'Title for each repeater entry, shown with index number',
  },
  companyName: {
    id: 'vmst.cjoi.application:companyName',
    defaultMessage: 'Nafn fyrirtækis',
    description: 'Company name label',
  },
  monthFrom: {
    id: 'vmst.cjoi.application:monthFrom',
    defaultMessage: 'Mánuður frá',
    description: 'Month from label',
  },
  monthTo: {
    id: 'vmst.cjoi.application:monthTo',
    defaultMessage: 'Mánuður til',
    description: 'Month to label',
  },
  jobStart: {
    id: 'vmst.cjoi.application:jobStart',
    defaultMessage: 'Upphaf starfs',
    description: 'Job start date label',
  },
  workEnds: {
    id: 'vmst.cjoi.application:workEnds',
    defaultMessage: 'Vinnu lýkur',
    description: 'Work ends date label',
  },
  workPercentage: {
    id: 'vmst.cjoi.application:workPercentage',
    defaultMessage: 'Starfshlutfall',
    description: 'Work percentage label',
  },
  estimatedMonthlyIncome: {
    id: 'vmst.cjoi.application:estimatedMonthlyIncome',
    defaultMessage: 'Áætlaðar tekjur á mánuði fyrir skatt',
    description: 'Estimated monthly income before tax label',
  },
  paymentType: {
    id: 'vmst.cjoi.application:paymentType',
    defaultMessage: 'Tegund greiðslu',
    description: 'Payment type label',
  },
  amountPerMonth: {
    id: 'vmst.cjoi.application:amountPerMonth',
    defaultMessage: 'Upphæð á mánuði fyrir skatt',
    description: 'Amount per month before tax',
  },
  oneTimePayment: {
    id: 'vmst.cjoi.application:oneTimePayment',
    defaultMessage: 'Eingreiðsla',
    description: 'One-time payment option',
  },
  monthlyPayment: {
    id: 'vmst.cjoi.application:monthlyPayment',
    defaultMessage: 'Mánaðarleg greiðsla',
    description: 'Monthly payment option',
  },

  // Payment type options - capital income
  capitalIncomeRent: {
    id: 'vmst.cjoi.application:capitalIncomeRent',
    defaultMessage: 'Leigutekjur',
    description: 'Rental income option',
  },
  capitalIncomeDividend: {
    id: 'vmst.cjoi.application:capitalIncomeDividend',
    defaultMessage: 'Arðgreiðslur',
    description: 'Dividend income option',
  },
  capitalIncomeInterest: {
    id: 'vmst.cjoi.application:capitalIncomeInterest',
    defaultMessage: 'Vaxtatekjur',
    description: 'Interest income option',
  },

  // Payment type options - social insurance
  socialInsuranceDisability: {
    id: 'vmst.cjoi.application:socialInsuranceDisability',
    defaultMessage: 'Örorkulífeyrir',
    description: 'Disability pension option',
  },
  socialInsuranceRehabilitation: {
    id: 'vmst.cjoi.application:socialInsuranceRehabilitation',
    defaultMessage: 'Endurhæfingarlífeyrir',
    description: 'Rehabilitation pension option',
  },

  /* Prerequisites */
  dataProviderVmstTitle: {
    id: 'vmst.cjoi.application:dataProviderVmstTitle',
    defaultMessage: 'Vinnumálastofnun',
    description: 'Name of the data provider for vmst',
  },
  dataProviderVmstDescription: {
    id: 'vmst.cjoi.application:dataProviderVmstDescription',
    defaultMessage: 'Gögn sótt til Vinnumálastofnunar',
    description: 'Description of the data provider for vmst',
  },
  externalDataPageTitle: {
    id: 'vmst.cjoi.application:externalDataPageTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'external data provider page title',
  },
  externalDataCheckboxLabel: {
    id: 'vmst.cjoi.application:externalDataCheckboxLabel',
    defaultMessage: 'Ég hef kynnt mér ofangreint varðandi gagnaöflun',
    description: 'I understand',
  },
  externalDataSubmitButton: {
    id: 'vmst.cjoi.application:externalDataSubmitButton',
    defaultMessage: 'Staðfesta og halda áfram',
    description: 'Confirm and continue button label on prerequisites page',
  },
  /* --- */
  submitButton: {
    id: 'vmst.cjoi.application:submitButton',
    defaultMessage: 'Tilkynna tekjur',
    description: 'Submit button label',
  },
  /* Action card */
  actionCardDraft: {
    id: 'vmst.cjoi.application:actionCardDraft',
    defaultMessage: 'Í vinnslu',
    description: 'Action card tag for draft application',
  },
  actionCardCompleted: {
    id: 'vmst.cjoi.application:actionCardCompleted',
    defaultMessage: 'Afgreidd',
    description: 'Action card tag for completed application',
  },
  historyLogSubmitted: {
    id: 'vmst.cjoi.application:historyLogSubmitted',
    defaultMessage: 'Tilkynning móttekin',
    description: 'History log message when application is submitted',
  },
  historyLogReceivedForPeriod: {
    id: 'vmst.cjoi.application:historyLogReceivedForPeriod',
    defaultMessage: 'Tilkynning móttekin fyrir tímabil: {dateFrom} - {dateTo}',
    description:
      'History log message with period dates when application is submitted',
  },
  /* Completed form */
  completedFormAlertTitle: {
    id: 'vmst.cjoi.application:completedFormAlertTitle',
    defaultMessage: 'Tilkynning um tekjur hefur verið móttekin',
    description: 'Title for alert when form is completed',
  },
})

export const errorMessages = defineMessages({
  cannotApplyErrorTitle: {
    id: 'vmst.cjoi.application:errorMessages.cannotApplyErrorTitle',
    defaultMessage: 'Vinsamlegast athugið',
    description: `Error title when user can not apply`,
  },
  cannotApplyErrorSummary: {
    id: 'vmst.cjoi.application:errorMessages.cannotApplyErrorSummary',
    defaultMessage:
      'Samkvæmt sóttum gögnum getur viðkomandi ekki tilkynnt um vinnu eða tekjur. Ef þú telur að mistök séu að ræða vinsamlegast hafðu samband við Vinnumálastofnun.',
    description: `Error summary when user can not apply`,
  },
  submitError: {
    id: 'vmst.cjoi.application:errorMessages.submitError',
    defaultMessage:
      'Villa við að skila inn umsókn. Reyndu aftur eða hafðu samband við Ísland.is',
    description: 'Error message when submit fails',
  },
})
