import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationTitle: {
    id: 'fsc.application:title',
    defaultMessage: 'Skil ársreikninga kirkjugarða',
    description: 'Title of the application',
  },
  institutionName: {
    id: 'fsc.application:institution',
    defaultMessage: 'Ríkisendurskoðun',
    description: `Institution's name`,
  },
  keynumbers: {
    id: 'fsc.application:keynumbers',
    defaultMessage: 'Lykiltölur',
    description: 'Key numbers',
  },
  cemeteryCaretakers: {
    id: 'fsc.application:cemeteryCaretakers',
    defaultMessage: 'Umsjónaraðilar',
    description: 'Cemetry caretakers',
  },
  cemeteryBoardmembers: {
    id: 'fsc.application:cemeteryBoardmembers',
    defaultMessage: 'Stjórnar- og skoðunarmenn',
    description: 'Cemetries board and caretakers',
  },
  cemeteryRegisterCaretakers: {
    id: 'fsc.application:cemeteryRegisterCaretakers',
    defaultMessage:
      'Vinsamlegast skráið inn stjórnar- og skoðunarmenn kirkjugarðsins',
    description: 'Cemetries board and caretakers',
  },
  expensesIncome: {
    id: 'fsc.application:keyNumbers.expensesIncome',
    defaultMessage: 'Tekjur og gjöld',
    description: 'Expenses and income',
  },
  keyNumbersIncomeAndExpenses: {
    id: 'fsc.application:keyNumbersIncomeAndExpenses',
    defaultMessage: 'Lykiltölur - Tekjur og gjöld',
    description: 'income and expenses of keynumbers',
  },
  fillOutAppopriate: {
    id: 'fsc.application:fillOutAppopriate',
    defaultMessage: 'Vinsamlegast fylltu út þá reiti sem eiga við',
    description: 'Fill out fields',
  },
  capitalNumbers: {
    id: 'fsc.application:income.capitalNumbers',
    defaultMessage: 'Fjármagnsliðir',
    description: 'capital numbers',
  },
  capitalNumbersSectionTitle: {
    id: 'fsc.application:income.capitalNumbersSectionTitle',
    defaultMessage: 'Lykiltölur Fjármagnsliðir',
    description: 'capital numbers',
  },
  propertiesAndDebts: {
    id: 'fsc.application:keyNumbers.properties',
    defaultMessage: 'Eignir, skuldir og eigið fé',
    description: 'Statement property numbers',
  },
  keyNumbersDebt: {
    id: 'fsc.application:keyNumbers.debt',
    defaultMessage: 'Lykiltölur - Eignir, Skuldir og eigið fé',
    description: 'Statement debts',
  },
  required: {
    id: 'fsc.application:error.required',
    defaultMessage: 'Reitur má ekki vera tómur',
    description: 'Error message when a required field has not been filled',
  },
  negativeNumberError: {
    id: 'fsc.application:error.negativeNumberError',
    defaultMessage: 'Ekki er leyfilegt að setja inn neikvæðar tölur',
    description: 'Error message when a required field has not been filled',
  },
  nationalId: {
    id: 'fsc.application:nationalId',
    defaultMessage: 'Kennitala',
    description: 'National id',
  },
  fullName: {
    id: 'fsc.application:fullName',
    defaultMessage: 'Fullt nafn',
    description: 'Full name',
  },
  errorNationalIdIncorrect: {
    id: 'fsc.application:error.nationalIdIncorrect',
    defaultMessage: 'Þessi kennitala virðist ekki vera rétt',
    description: 'National id is invalid',
  },
  role: {
    id: 'fsc.application:role',
    defaultMessage: 'Hlutverk',
    description: 'Role in board fx.',
  },
  selectRole: {
    id: 'fsc.application:selectRole',
    defaultMessage: 'Veldu hlutverk',
    description: 'role select',
  },
  cemeteryInspector: {
    id: 'fsc.application:cemeteryInspector',
    defaultMessage: 'Skoðunarmaður',
    description: 'inspector',
  },
  cemeteryBoardMember: {
    id: 'fsc.application:cemeteryBoardMember',
    defaultMessage: 'Stjórnarmaður',
    description: 'Boardmember',
  },
  errorCaretakerCanNotIncludeActor: {
    id: 'fsc.application:error.errorcaretakerCanNotIncludeActor',
    defaultMessage: 'Innskráður aðili má ekki vera skráður sem skoðunarmaður',
    description: 'error, applicant regsitered as caretaker',
  },
  errorMemberCanNotIncludeApplicant: {
    id: 'fsc.application:error.errormemberCanNotIncludeApplicant',
    defaultMessage:
      'Umsækjandi má ekki vera skráður sem stjórnarmaður eða skoðunarmaður',
    description: 'error, applicant regsitered as caretaker/boardmember',
  },
  errorBoardmembersCanNotJustIncludeActor: {
    id: 'fsc.application:error.errorBoardmembersCanNotJustIncludeActor',
    defaultMessage:
      'Innskráður aðili má ekki vera skráður einn sem stjórnarmaður',
    description: 'error, applicant regsitered as caretaker',
  },
  add: {
    id: 'fsc.application:add',
    defaultMessage: 'Bæta við línu',
    description: 'Cemetries board and caretakers',
  },
  payroll: {
    id: 'fsc.application:income.payroll',
    defaultMessage: 'Laun og launatengd gjöld',
    description: 'Payroll expense',
  },
  chapelExpense: {
    id: 'fsc.application:income.chapelExpense',
    defaultMessage: 'Rekstur útfararkapellu',
    description: 'chapel Operation expenses',
  },
  funeralCost: {
    id: 'fsc.application:income.funeralCost',
    defaultMessage: 'Útfarakostnaður',
    description: 'funerals expenses',
  },
  donationsToOther: {
    id: 'fsc.application:income.donationsToOther',
    defaultMessage: 'Framlög og styrkir til annarra',
    description: 'Donations made to others',
  },
  donationsToCemeteryFund: {
    id: 'fsc.application:income.donationsToCemeteryFund',
    defaultMessage: 'Framlög til kirkjugarðasjóðs',
    description: 'donations from cemetry fund',
  },
  otherOperationCost: {
    id: 'fsc.application:income.otherOperationCost',
    defaultMessage: 'Annar rekstrarkostnaður',
    description: 'other operations cost',
  },
  depreciation: {
    id: 'fsc.application:income.depreciation',
    defaultMessage: 'Afskriftir',
    description: 'Depreciation',
  },
  careIncome: {
    id: 'fsc.application:income.careIncome',
    defaultMessage: 'Umhirðutekjur',
    description: 'caretaking income',
  },
  burialRevenue: {
    id: 'fsc.application:income.burialRevenue',
    defaultMessage: 'Grafartekjur',
    description: 'burial revenue',
  },
  grantFromTheCemeteryFund: {
    id: 'fsc.application:income.grantFromTheCemeteryFund',
    defaultMessage: 'Styrkur frá kirkjugarðasjóði',
    description: 'Income from cemetry fund',
  },
  otherIncome: {
    id: 'fsc.application:income.other',
    defaultMessage: 'Aðrar tekjur',
    description: 'Other income',
  },
  income: {
    id: 'fsc.application:income',
    defaultMessage: 'Tekjur',
    description: 'Applicants income',
  },
  totalIncome: {
    id: 'fsc.application:income.totalIncome',
    defaultMessage: 'Tekjur samtals:',
    description: 'Total income',
  },
  expenses: {
    id: 'fsc.application:keyNumbers.expenses',
    defaultMessage: 'Gjöld',
    description: 'expenses',
  },
  totalExpenses: {
    id: 'fsc.application:income.totalExpenses',
    defaultMessage: 'Gjöld samtals:',
    description: 'Total expenses',
  },
  operatingCost: {
    id: 'fsc.application:keyNumbers.operatingCost',
    defaultMessage: 'Rekstrarniðurstaða alls',
    description: 'Operating Cost',
  },
  operatingCostBefore: {
    id: 'fsc.application:keyNumbers.operatingCostBeforeCapital',
    defaultMessage: 'Rekstrarniðurstaða fyrir fjármagnsliði',
    description: 'Operating Cost Capital',
  },
  fetchErrorTitle: {
    id: 'fsc.application:fetchErrorMsg',
    defaultMessage: 'Eitthvað fór úrskeiðiðs',
    description: 'Error msg title when fetching data fails',
  },
  fetchCemetryLimitErrorMsg: {
    id: 'fsc.application:fetchCemetryLimitErrorMsg',
    defaultMessage:
      'Ef skil falla undir lög um ársreikninga sem þarfnast ekki skila, reynið aftur síðar',
    description: 'Error msg when fetching data fails',
  },
  capitalIncome: {
    id: 'fsc.application:income.capital',
    defaultMessage: 'Fjármagnstekjur',
    description: 'capital income',
  },
  capitalCost: {
    id: 'fsc.application:income.capitalCost',
    defaultMessage: 'Fjármagnsgjöld',
    description: 'capital costs',
  },
  totalCapital: {
    id: 'fsc.application:totalCapital',
    defaultMessage: 'Fjármagnsliðir samtals',
    description: 'Total capital',
  },
  equityDebtsAssetsValidatorError: {
    id: 'fsc.application:equityValidatorError',
    defaultMessage: 'Skuldir og eigið fé þarf að vera jafnt og eignir samtals',
    description: 'Equity + debts shout equal assets',
  },
  properties: {
    id: 'fsc.application:properties',
    defaultMessage: 'Eignir',
    description: 'List of applicants properties',
  },
  fixedAssetsTotal: {
    id: 'fsc.application:keyNumbers.fixedAssetsTotal',
    defaultMessage: 'Fastafjármunir samtals',
    description: 'Fixed assets',
  },
  currentAssets: {
    id: 'fsc.application:keyNumbers.currentAssets',
    defaultMessage: 'Veltufjármunir samtals',
    description: 'Current assets',
  },
  totalAssets: {
    id: 'fsc.application:totalAssets',
    defaultMessage: 'Eignir samtals',
    description: 'Total assets',
  },
  debtsAndEquity: {
    id: 'fsc.application:keyNumbers.debtsAndEquity',
    defaultMessage: 'Skuldir og eigið fé',
    description: 'debts and equity',
  },
  longTerm: {
    id: 'fsc.application:keyNumbers.longTermdebt',
    defaultMessage: 'Langtímaskuldir samtals',
    description: 'Long term debt',
  },
  shortTerm: {
    id: 'fsc.application:keyNumbers.shortTermDebt',
    defaultMessage: 'Skammtímaskuldir samtals',
    description: 'Short term debt',
  },
  totalDebts: {
    id: 'fsc.application:income.totalDebts',
    defaultMessage: 'Skuldir samtals:',
    description: 'Total debts',
  },
  equityAtTheBeginningOfTheYear: {
    id: 'fsc.application:keyNumbers.equityAtTheBeginningOfTheYear',
    defaultMessage: 'Eigið fé 1. Janúar',
    description: 'equity january first',
  },
  revaluationDueToPriceChanges: {
    id: 'fsc.application:keyNumbers.reevaluatePrice',
    defaultMessage: 'Endurmat vegna verðbreytinga',
    description: 'Revaluation because of price change',
  },
  reevaluateOther: {
    id: 'fsc.application:keyNumbers.reevaluateOther',
    defaultMessage: 'Endurmat, annað',
    description: 'Revaluation other',
  },
  operationResult: {
    id: 'fsc.application:keyNumbers.operationResult',
    defaultMessage: 'Rekstrarafkoma',
    description: 'Result of operation',
  },
  totalEquity: {
    id: 'fsc.application:totalEquity',
    defaultMessage: 'Samtals eigið fé',
    description: 'Total equity',
  },
  debtsAndCash: {
    id: 'fsc.application:keyNumbers.debtsAndCash',
    defaultMessage: 'Skuldir og eigið fé samtals',
    description: 'Debts and cash',
  },
  equityErrorTitle: {
    id: 'fsc.application:equityErrorTitle',
    defaultMessage: 'Ósamræmi í tölum',
    description: 'Error msg title when E = S+E.fé is incorrect',
  },
  financialStatement: {
    id: 'fsc.application:financial.statment',
    defaultMessage: 'Ársreikningur',
    description: 'financial statements',
  },
  upload: {
    id: 'fsc.application:upload',
    defaultMessage: 'Hlaða upp ársreikningi',
    description: 'Upload financial statements',
  },
  uploadHeader: {
    id: 'fsc.application:uploadHeader',
    defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
    description: 'Upload here',
  },
  uploadIntro: {
    id: 'fsc.application:upload.intro',
    defaultMessage: 'Vinsamlegast hlaðið upp ársreikning hér að neðan.',
    description: 'Upload financial statements intro',
  },
  uploadDescription: {
    id: 'fsc.application:upload.description',
    defaultMessage: 'Vinsamlegast hlaðið upp ársreikning hér að neðan.',
    description: 'Upload financial statements intro',
  },
  uploadAccept: {
    id: 'fsc.application:upload.accept',
    defaultMessage: 'Eingöngu er tekið við skjölum á PDF formi',
    description: 'Upload financial statements intro',
  },
  uploadButtonLabel: {
    id: 'fsc.application:upload.buttonlabel',
    defaultMessage: 'Velja skjöl til að hlaða upp',
    description: 'Upload button label',
  },
  serviceProvider: {
    id: 'fsc.application:serviceProvider',
    defaultMessage: 'Þjónustuaðili',
    description: 'service provider',
  },
  inao: {
    id: 'fsc.application:inao',
    defaultMessage: 'Ríkisendurskoðun',
    description: 'icelandic national audit',
  },
  dataCollectionTitle: {
    id: 'fsc.application:applicationDataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Title for data collection section',
  },
  dataCollectionTitleUserCemetery: {
    id: 'fsc.application:applicationDataCollectionTitleUserCemetry',
    defaultMessage: 'Gagnaöflun vegna skila ársreiknings kirkjugarðs',
    description: 'Title for data collection section',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'fsc.application:dataCollectionNationalRegistryTitle',
    defaultMessage: 'Persónuupplýsingar',
    description: 'National registry title',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'fsc.application:dataCollectionNationalRegistrySubtitle',
    defaultMessage: 'Fullt nafn, kennitala, heimilisfang.',
    description: 'National registry subtitle',
  },
  dataCollectionUserProfileTitle: {
    id: 'fsc.application:dataCollectionUserProfileTitle',
    defaultMessage: 'Mínar síður á Ísland.is/stillingar',
    description: 'Your user profile information',
  },
  dataCollectionUserFinancialInfoTitle: {
    id: 'fsc.application:dataCollectionUserFinancialInfoTitle',
    defaultMessage: 'Fjárhagsupplýsingar',
    description: 'Financial info',
  },
  dataCollectionUserFinancialInfo: {
    id: 'fsc.application:dataCollectionUserFinancialInfo',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við fjárhagsupplýsingar til Ríkisendurskoðunar, sem embættið aflar frá viðeigandi aðilum á grundvelli aðgangs- og skoðunarheimilda sem það hefur, og forskráum þær.',
    description: 'Financial info',
  },
  dataCollectionUserProfileSubtitle: {
    id: 'fsc.application:dataCollectionUserProfileSubtitle',
    defaultMessage:
      'Ef þú ert með skráðar upplýsingar um síma og netfang inni á Mínar síður á Ísland.is þá verða þær sjálfkrafa settar inn í umsóknina.',
    description:
      'In order to apply for this application we need your email and phone number',
  },
  dataCollectionCheckboxLabel: {
    id: 'fsc.application:dataCollectionCheckboxLabel',
    defaultMessage:
      'Ég skil að ofangreindra gagna verður aflað við vinnslu innsendingarinnar',
    description: 'Checkbox label for data collection section',
  },
  received: {
    id: 'fsc.application:received',
    defaultMessage: 'Ársreikningur mótekinn',
    description: 'financial statement received',
  },
  applicationAccept: {
    id: 'fsc.application:applicationAccept',
    defaultMessage: 'Umsókn móttekin',
    description: 'application accept',
  },
  reviewContact: {
    id: 'fsc.application:reviewContact',
    defaultMessage: 'Vinsamlega yfirfarið upplýsingar um tengilið hér að neðan',
    description: 'Review contact info',
  },
  reviewInfo: {
    id: 'fsc.application:reviewInfo',
    defaultMessage: 'Vinsamlega yfirfarið upplýsingarnar hér að neðan',
    description: 'Review info',
  },
  info: {
    id: 'fsc.application:info',
    defaultMessage: 'Upplýsingar',
    description: 'info',
  },
  clientNationalId: {
    id: 'fsc.application:clientNationalId',
    defaultMessage: 'Kennitala viðskiptavinar',
    description: 'client national id',
  },
  clientName: {
    id: 'fsc.application:clientName',
    defaultMessage: 'Nafn viðskiptavinar',
    description: 'client name',
  },
  email: {
    id: 'fsc.application:person.email',
    defaultMessage: 'Netfang',
    description: 'email',
  },
  phoneNumber: {
    id: 'fsc.application:about.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'phone number',
  },
  fetchErrorMsg: {
    id: 'fsc.application:fetchError',
    defaultMessage: 'Ekki tókst að sækja gögn, reyndur aftur seinna',
    description: 'Error msg when fetching data fails',
  },
  operatingYear: {
    id: 'fsc.application:keyNumbers.operatingYear',
    defaultMessage: 'Rekstrarár',
    description: 'Operating year',
  },
  selectOperatingYear: {
    id: 'fsc.application:keyNumbers.selectOperatingYear',
    defaultMessage: 'Veldu rekstrarár',
    description: 'Select operating year',
  },
  powerOfAttorneyNationalId: {
    id: 'fsc.application:powerOfAttorneyNationalId',
    defaultMessage: 'Kennitala umboðsmanns',
    description: `national id for power of attorney`,
  },
  powerOfAttorneyName: {
    id: 'fsc.application:powerOfAttorneyName',
    defaultMessage: 'Nafn umboðsmanns',
    description: `name for power of attorney`,
  },
  errorFetchingName: {
    id: 'fsc.application:error.errorFetchingName',
    defaultMessage: 'Tókst ekki að sækja nafn umboðsmanns',
    description: 'Could not fetch powerofattorney name',
  },
  wrongDelegation: {
    id: 'fsc.application:wrongDelegation',
    defaultMessage: 'Eingöngu er hægt að skila fyrir hönd Kirkjugarða',
    description: 'Logged in user with incorrect delegation type',
  },
  genericError: {
    id: 'fsc.application:error.genericError',
    defaultMessage: 'Eitthvað fór úrskeiðis',
    description: 'Generic error message',
  },
  statement: {
    id: 'fsc.application:statement',
    defaultMessage: 'Yfirlýsing',
    description: 'statement',
  },
  overviewSectionTitle: {
    id: 'fsc.application:overview.general.sectionTitle',
    defaultMessage: 'Yfirlit',
    description: 'Overview section title',
  },
  overviewReview: {
    id: 'fsc.application:overview.general.review',
    defaultMessage: 'Yfitlit uppgjörs',
    description: 'Overview review',
  },
  yearlyOverview: {
    id: 'fsc.application:overview.general.yearly',
    defaultMessage: 'Yfirlit ársreiknings',
    description: 'Yearly overview',
  },
  aboutOverviewTitle: {
    id: 'fsc.application:aboutOverviewTitle',
    defaultMessage: 'Um kirkjugarð',
    description: 'About overview title',
  },
  overviewDescription: {
    id: 'fsc.application:overview.general.description',
    defaultMessage: 'Farðu vel yfir efnið áður en þú sendir inn umsóknina.',
    description: 'Overview description',
  },
  review: {
    id: 'fsc.application:review',
    defaultMessage:
      'Endilega lestu yfir til að vera viss um að allar upplýsingar hafi verið gefnar',
    description: 'financial statements',
  },
  files: {
    id: 'fsc.application:files',
    defaultMessage: 'Skjöl',
    description: 'files',
  },
  overview: {
    id: 'fsc.application:overview.general.overview',
    defaultMessage: 'Yfirferð',
    description: 'Overview section title',
  },
  overviewCorrect: {
    id: 'fsc.application:overview.overViewCorrect',
    defaultMessage: 'Ég samþykki að ofangreindar upplýsingar séu réttar',
    description: 'Overview correct',
  },
  errorApproval: {
    id: 'fsc.application:error.errorApproval',
    defaultMessage: 'Samþykkja þarf yfirlit',
    description: 'Approval missing',
  },
  submitErrorTitle: {
    id: 'fsc.application:submitErrorTitle',
    defaultMessage: 'Móttaka ársreiknings tókst ekki',
    description:
      'Title that shows up when an error occurs while submitting the application',
  },
  submitErrorMessage: {
    id: 'fsc.application:submitErrorMessage',
    defaultMessage:
      'Eitthvað fór úrskeiðis við að senda inn ársreikning. Reyndu aftur síðar.',
    description:
      'Text that shows up when an error occurs while submitting the application',
  },
  goBack: {
    id: 'fsc.application:overview.goBack',
    defaultMessage: 'Til Baka',
    description: 'Go back btn text',
  },
  send: {
    id: 'fsc.application:send',
    defaultMessage: 'Senda umsókn',
    description: 'Send application',
  },
  nationalIdError: {
    id: 'fsc.application:error.nationalIdError',
    defaultMessage: 'Kennitala er ekki á réttu formi',
    description: 'Error message when nationalid is wrong',
  },
  dataSchemePhoneNumber: {
    id: 'fsc.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
  totalLiabilities: {
    id: 'fsc.application:keyNumbers.totalLiabilities',
    defaultMessage: 'Skuldir samtals',
    description: 'total liabilities',
  },
  equity: {
    id: 'fsc.application:keyNumbers.equity',
    defaultMessage: 'Eigið fé',
    description: 'total equity',
  },
  nationalIdAgeError: {
    id: 'fsc.application:error.nationalIdAgeError',
    defaultMessage: 'Skoðunar- og Stjórnunarmenn þurfa að vera eldri en 18 ára',
    description:
      'Error message when attempting to register younger then 18 caretaker',
  },
  errorMembersMissing: {
    id: 'fsc.application:error.errorMembersMissing',
    defaultMessage: 'Skrá þarf bæði skoðunarmann og stjórnarmann',
    description: 'Members missing',
  },
  errormemberNotUnique: {
    id: 'fsc.application:error.errormemberNotUnique',
    defaultMessage:
      'Ekki er hægt að skrá sama aðila sem Stjórnarmann og Skoðunarmann',
    description: 'Members missing',
  },
  debts: {
    id: 'fsc.application:keyNumbers.debts',
    defaultMessage: 'Skuldir',
    description: 'debts',
  },
  SignatureMessage: {
    id: 'fsc.application:SignatureMessage',
    defaultMessage:
      'Eftir að þú hefur sent inn umsókn mun rafræn undirritun verða send á netfangið',
    description: 'Signature message',
  },
  SignaturePossible: {
    id: 'fsc.application:SignaturePossible',
    defaultMessage: 'svo hægt sé að undirrita hana með rafrænum skilríkjum.',
    description: 'Signature possible message',
  },
  overviewAlertMessage: {
    id: 'fsc.application:overviewAlertMessage',
    defaultMessage:
      'Eftir að þú hefur sent inn umsókn mun rafræn undirritun verða send á netfangið {email}, svo hægt sé að undirrita hana með rafrænum skilríkjum.',
    description:
      'Message in the info allert at the bottom of the overview screen',
  },
  operatingYearMsgFirst: {
    id: 'fsc.application:operatingYearMsgFirst',
    defaultMessage: 'Ársreikningi fyrir rekstrarárið',
    description: 'First part of audit received message',
  },
  individualReceivedMsgSecond: {
    id: 'fsc.application:individualReceivedMsgSecond',
    defaultMessage: 'hefur verið skilað þann',
    description: 'Second part of audit received message',
  },
  returned: {
    id: 'fsc.application:returned',
    defaultMessage: 'Skilað',
    description: 'Returned',
  },
  digitalSignatureTitle: {
    id: 'fsc.application:digitalSignatureTitle',
    defaultMessage: 'Rafræn undirritun',
    description:
      'Reminder of digital signature after the application is returned',
  },
  digitalSignatureMessage: {
    id: 'fsc.application:digitalSignatureMessage',
    defaultMessage:
      'Það bíður þín skjal sem á eftir að undirrita með rafrænum skilríkjum. Hlekkur á skjalið hefur verið sendur í tölvupósti á netfangið þitt: {email}',
    description:
      'Reminder of digital signature after the application is returned',
  },
  myPagesLinkText: {
    id: 'fsc.application:myPagesLinkText',
    defaultMessage:
      'Á Mínum síðum Ísland.is hefur þú aðgang að marvíslegum upplýsingum s.s stafrænt pósthólf, þínar upplýsingar, fjármál, umsóknir, menntun, fasteignir, ökutæki, skírteini, starfsleyfi ofl. ',
    description: 'island.is my pages info',
  },
  continue: {
    id: 'fsc.application:continue',
    defaultMessage: 'Áfram',
    description: 'continue',
  },
  notAllowedTitle: {
    id: 'fsc.application:notAllowedTitle',
    defaultMessage:
      'Þessi kennitala er ekki skráð sem kirkjugarður hjá Ríkisendurskoðun',
    description: 'Title when user is not allowed to apply',
  },
  notAllowedDescription: {
    id: 'fsc.application:notAllowedDescription',
    defaultMessage:
      'Ef þú telur að þessi kennitala ætti að vera skráð sem kirkjugarður þá bendum við þér á að hafa samband við Ríkisendurskoðun í síma 448 8800',
    description: 'Descriptionwhen user is not allowed to apply',
  },
  conclusionAlertMessage: {
    id: 'fsc.application:conclusionAlertMessage',
    defaultMessage:
      'Ársreikning fyrir rekstrarárið {value1} hefur verið skilað',
    description: 'Conclusion alert message',
  },
})
