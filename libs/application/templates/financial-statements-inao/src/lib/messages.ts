import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationTitle: {
    id: 'fsn.application:applicationTitle',
    defaultMessage: 'Stafræn skil ársreikninga',
    description: 'Application for Digital',
  },
  institutionName: {
    id: 'fsn.application.institution',
    defaultMessage: 'Ríkisendurskoðun',
    description: `Institution's name`,
  },
  powerOfAttorneyNationalId: {
    id: 'fsn.application.powerOfAttorneyNationalId',
    defaultMessage: 'Kennitala umboðsmanns',
    description: `national id for power of attorney`,
  },
  powerOfAttorneyName: {
    id: 'fsn.application.powerOfAttorneyName',
    defaultMessage: 'Nafn umboðsmanns',
    description: `name for power of attorney`,
  },
  name: {
    id: 'fsn.application:name',
    defaultMessage: 'Umsókn',
    description: `Application's name`,
  },
  dataCollectionTitle: {
    id: 'fsn.application:applicationDataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Title for data collection section',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'fsn.application:dataCollectionNationalRegistryTitle',
    defaultMessage: 'Persónuupplýsingar',
    description: 'National registry title',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'fsn.application:dataCollectionNationalRegistrySubtitle',
    defaultMessage: 'Fullt nafn, kennitala, heimilisfang.',
    description: 'National registry subtitle',
  },
  dataCollectionUserProfileTitle: {
    id: 'fsn.application:dataCollectionUserProfileTitle',
    defaultMessage: 'Mínar síður á Ísland.is/stillingar',
    description: 'Your user profile information',
  },
  dataCollectionUserProfileSubtitle: {
    id: 'fsn.application:dataCollectionUserProfileSubtitle',
    defaultMessage:
      'Ef þú ert með skráðar upplýsingar um síma og netfang inni á Mínar síður á Ísland.is þá verða þær sjálfkrafa settar inn í umsóknina.',
    description:
      'In order to apply for this application we need your email and phone number',
  },
  infoSection: {
    id: 'fsn.application:intro.section',
    defaultMessage: 'Viðskiptavinur',
    description: 'Info',
  },
  fundInfo: {
    id: 'fsn.application:fund',
    defaultMessage: 'Upplýsingar um sjóð og vörsluaðila',
    description: 'fund info',
  },
  generalInfo: {
    id: 'fsn.application:generalInfo',
    defaultMessage: 'Upplýsingar',
    description: `General info`,
  },
  about: {
    id: 'fsn.application:about',
    defaultMessage: 'Viðskiptavinur',
    description: 'about',
  },
  status: {
    id: 'fsn.application:status',
    defaultMessage: 'Staða',
    description: 'elctionStatus',
  },
  fullName: {
    id: 'fsn.application:fullName',
    defaultMessage: 'Fullt nafn',
    description: 'Full name',
  },
  electionId: {
    id: 'fsn.application:electionId',
    defaultMessage: 'Kosningarnúmer',
    description: 'election id',
  },
  electionCampaign: {
    id: 'fsn.application:electionCampaign',
    defaultMessage: 'Kosningabarátta',
    description: 'Election Campaign',
  },
  electionType: {
    id: 'fsn.application:electionType',
    defaultMessage: 'Tegund Kosninga',
    description: 'Election Campaign',
  },
  selectElectionType: {
    id: 'fsn.application:selectElectionType',
    defaultMessage: 'Vinsamlegast veldu þá tegund kosningar sem við á',
    description: 'Select election type',
  },
  election: {
    id: 'fsn.application:election',
    defaultMessage: 'Kosningar',
    description: 'Election',
  },
  pickElectionType: {
    id: 'fsn.application:election',
    defaultMessage: 'Veldu Tegund',
    description: 'Select election type',
  },
  clientType: {
    id: 'fsn.application:clientType',
    defaultMessage: 'Tegund viðskiptavinar',
    description: 'Type of client',
  },
  buisnessYear: {
    id: 'fsn.application:buisnessYear',
    defaultMessage: 'Rekstrarár',
    description: 'Buisness year',
  },
  statementStatus: {
    id: 'fsn.application:statementStatus',
    defaultMessage: 'Staða',
    description: 'Type of client',
  },
  statement: {
    id: 'fsn.application:statement',
    defaultMessage: 'Yfirlýsing',
    description: 'statement',
  },
  electionStatement: {
    id: 'fsn.application:electionStatement',
    defaultMessage: 'Yfirlýsing frambjóðanda í heiti kosninga',
    description: 'statement',
  },
  elctionStatementLaw: {
    id: 'fsn.application:elctionStatementLaw',
    defaultMessage:
      'Með vísan í 3. mgr. 10. gr. laga nr. 162/2006, um starfsemi stjórnmálasamtaka, á því undanþága á uppgjörsskyldu vegna prófkjörs við.',
    description: 'statement',
  },
  date: {
    id: 'fsn.application:date',
    defaultMessage: 'Dagsetning',
    description: 'date',
  },
  dateTime: {
    id: 'fsn.application:dateTime',
    defaultMessage: 'Dagsetning og tími skila',
    description: 'date and time',
  },
  nationalId: {
    id: 'fsn.application:nationalId',
    defaultMessage: 'Kennitala',
    description: 'National id',
  },
  email: {
    id: 'fsn.application:person.email',
    defaultMessage: 'Netfang',
    description: 'email',
  },
  phoneNumber: {
    id: 'fsn.application:about.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'phone number',
  },
  keyNumbers: {
    id: 'fsn.application:keyNumbers',
    defaultMessage: 'Lykiltölur',
    description: 'Statement key numbers',
  },
  keyNumbersProperty: {
    id: 'fsn.application:keyNumbers.property',
    defaultMessage: 'Lykiltölur - Eignir',
    description: 'Statement property numbers',
  },
  debts: {
    id: 'fsn.application:keyNumbers.debts',
    defaultMessage: 'Skuldir',
    description: 'Keynumbers debt',
  },
  debtsLong: {
    id: 'fsn.application:keyNumbers.debtsLong',
    defaultMessage: 'Skammtíma',
    description: 'Keynumbers short term debt',
  },
  debtsShort: {
    id: 'fsn.application:keyNumbers.debtsShort',
    defaultMessage: 'Langtíma',
    description: 'Keynumbers long term debt',
  },
  keyNumbersDebt: {
    id: 'fsn.application:keyNumbers.debt',
    defaultMessage: 'Lykiltölur - Skuldir, eignir og eigið fé',
    description: 'Statement debts',
  },
  keyNumbersPersonal: {
    id: 'fsn.application:keyNumbers.personal',
    defaultMessage: 'Eigið fé',
    description: 'personal cash',
  },
  keyNumbersTotalDebt: {
    id: 'fsn.application:keyNumbers.totalDebt',
    defaultMessage: 'Skuldir samtals',
    description: 'Total debts',
  },
  keyNumbersExpenses: {
    id: 'fsn.application:keyNumbers.expenses',
    defaultMessage: 'Lykiltölur - Gjöld',
    description: 'expenses',
  },
  expenses: {
    id: 'fsn.application:keyNumbers.expenses',
    defaultMessage: 'Gjöld',
    description: 'expenses',
  },
  keyNumbersParty: {
    id: 'fsn.application:keyNumbers.party',
    defaultMessage: 'Rekstur flokksins',
    description: 'Party running cost',
  },
  financeCost: {
    id: 'fsn.application:keyNumbers.financeCost',
    defaultMessage: 'Fjármagnsgjöld',
    description: 'finance Cost',
  },
  fillOutAppopriate: {
    id: 'fsn.application:fillOutAppopriate',
    defaultMessage: 'Vinsamlegast fylltu út þá reiti sem eiga við',
    description: 'Fill out fields',
  },
  properties: {
    id: 'fsn.application:properties',
    defaultMessage: 'Eignir',
    description: 'List of applicants properties',
  },
  keyNumbersPropertiesAndDebts: {
    id: 'fsn.application:keyNumbersPropertiesAndDebts',
    defaultMessage: 'Lykiltölur - Tekjur og gjöld',
    description: 'properties and debts og key numbers',
  },
  propertiesShort: {
    id: 'fsn.application:properties.short',
    defaultMessage: 'Skammtímakröfur',
    description: 'Short term',
  },
  propertiesCash: {
    id: 'fsn.application:properties.cash',
    defaultMessage: 'Bankainnistæður og sjóðir',
    description: 'Cash is king',
  },
  keyNumbersIncomeAndExpenses: {
    id: 'fsn.application:keyNumbersIncomeAndExpenses',
    defaultMessage: 'Lykiltölur - Tekjur og gjöld',
    description: 'income and expenses of keynumbers',
  },
  income: {
    id: 'fsn.application:income',
    defaultMessage: 'Tekjur',
    description: 'Applicants income',
  },
  donations: {
    id: 'fsn.application:income.donations',
    defaultMessage: 'Framlög lögaðila',
    description: 'Donations',
  },
  personalIncome: {
    id: 'fsn.application:income.personal',
    defaultMessage: 'Eigin tekjur',
    description: 'personal income',
  },
  capitalIncome: {
    id: 'fsn.application:income.capital',
    defaultMessage: 'Fjármagnstekjur',
    description: 'capital income',
  },
  financialStatement: {
    id: 'fsn.application:financial.statment',
    defaultMessage: 'Ársreikningur',
    description: 'financial statements',
  },
  upload: {
    id: 'fsn.application:upload',
    defaultMessage: 'Hlaða upp ársreikningi',
    description: 'Upload financial statements',
  },
  uploadIntro: {
    id: 'fsn.application:upload.intro',
    defaultMessage: 'Vinsamlegast hlaðið upp ársreikning hér að neðan.',
    description: 'Upload financial statements intro',
  },
  uploadDescription: {
    id: 'fsn.application:upload.description',
    defaultMessage: 'Vinsamlegast hlaðið upp ársreikning hér að neðan.',
    description: 'Upload financial statements intro',
  },
  confirm: {
    id: 'fsn.application:confirmation',
    defaultMessage: 'Staðfesta',
    description: 'confirm application',
  },
  send: {
    id: 'fsn.application:send',
    defaultMessage: 'Senda umsókn',
    description: 'Send application',
  },
  lessOverviewSectionTitle: {
    id: 'fsn.application:overviewTitle',
    defaultMessage: 'Yfirlit',
    description: 'Title for overview section',
  },
  lessOverviewSectionDescription: {
    id: 'fsn.application:lessOverviewSectionDescription',
    defaultMessage:
      'Vinsamlegast lestu yfir umsóknina og vertu viss um að allar upplýsingar séu rétt uppgefnar. Að loknum yfirlestri getur þú sent inn umsóknina.',
    description: 'Description for overview section',
  },
  overviewSectionTitle: {
    id: 'fsn.application:overview.general.sectionTitle',
    defaultMessage: 'Yfirlit',
    description: 'Overview section title',
  },
  overviewCorrect: {
    id: 'fsn.application:overview.overViewCorrect',
    defaultMessage: 'Ég samþykki að ofangreindar upplýsingar séu réttar',
    description: 'Overview correct',
  },
  overviewTitle: {
    id: 'fsn.application:overview.general.name',
    defaultMessage: 'Yfirlit og staðfesting umsóknar',
    description: 'Overview title',
  },
  overviewDescription: {
    id: 'gfl.application:overview.general.description',
    defaultMessage: 'Farðu vel yfir efnið áður en þú sendir inn umsóknina.',
    description: 'Overview description',
  },
  success: {
    id: 'fsn.application:success',
    defaultMessage: 'Skil á árskýrslu mótteking',
    description: 'financial statement success',
  },
  dataCollectionCheckboxLabel: {
    id: 'fsn.application:dataCollectionCheckboxLabel',
    defaultMessage: 'Ég samþykki að láta sækja gögn',
    description: 'Checkbox label for data collection section',
  },
  thankYou: {
    id: 'fsn.application:final',
    defaultMessage: 'Takk fyrir',
    description: 'Upload financial statements intro',
  },
  outroMessage: {
    id: 'fsn.application:upload.description',
    defaultMessage: 'Takk fyrir',
    description: 'Upload financial statements intro',
  },
  dataSchemePhoneNumber: {
    id: 'fsn.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
  lessThanLimit: {
    id: 'fsn.application:lessThanLimit',
    defaultMessage:
      'Heildartekjur eða heildarkostnað við kosningabaráttuna var minni en 550 þúsund krónum.',
    description: 'Spending was less than a specific limit',
  },
  moreThanLimit: {
    id: 'fsn.application:moreThanLimit',
    defaultMessage:
      'Heildartekjur eða heildarkostnað við kosningabaráttuna var meira en 550 þúsund krónum.',
    description: 'Spending was more than a specific limit',
  },
  campaignCost: {
    id: 'fsn.application:campaignCost',
    defaultMessage: 'Heildartekjur við kosningabaráttu',
    description: 'Election campaign cost',
  },
  files: {
    id: 'fsn.application:files',
    defaultMessage: 'Skjöl',
    description: 'files',
  },
  pleaseSelect: {
    id: 'fsn.application:pleaseSelect',
    defaultMessage: 'Vinsamlegast veldu það sem við á',
    description: 'Please select',
  },
  applicationAccept: {
    id: 'fsn.application:applicationAccept',
    defaultMessage: 'Umsókn móttekin',
    description: 'applicaiton accept',
  },
})

export default m
