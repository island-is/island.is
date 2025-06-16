import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationTitle: {
    id: 'fsie.application:applicationTitle',
    defaultMessage: 'Skil á ársreikningi - einstaklingsframboð',
    description: 'Application for Digital',
  },
  applicationTitleAlt: {
    id: 'fsie.application:applicationTitleAlt',
    defaultMessage: 'Skil á ársreikningi fyrir einstaklingsframboð',
    description: 'Application for Individual elections',
  },
  aboutOverviewTitle: {
    id: 'fsie.application:aboutOverviewTitle',
    defaultMessage: 'Um umsækjanda',
    description: 'About applicant',
  },
  institutionName: {
    id: 'fsie.application:institution',
    defaultMessage: 'Ríkisendurskoðun',
    description: `Institution's name`,
  },
  required: {
    id: 'fsie.application:error.required',
    defaultMessage: 'Reitur má ekki vera tómur',
    description: 'Error message when a required field has not been filled',
  },
  nationalIdError: {
    id: 'fsie.application:error.nationalIdError',
    defaultMessage: 'Kennitala er ekki á réttu formi',
    description: 'Error message when nationalid is wrong',
  },
  dataSchemePhoneNumber: {
    id: 'fsie.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
  negativeNumberError: {
    id: 'fsie.application:error.negativeNumberError',
    defaultMessage: 'Ekki er leyfilegt að setja inn neikvæðar tölur',
    description: 'Error message when a required field has not been filled',
  },
  serviceProvider: {
    id: 'fsie.application:serviceProvider',
    defaultMessage: 'Þjónustuaðili',
    description: 'service provider',
  },
  inao: {
    id: 'fsie.application:inao',
    defaultMessage: 'Ríkisendurskoðun',
    description: 'icelandic national audit',
  },
  dataCollectionTitle: {
    id: 'fsie.application:applicationDataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Title for data collection section',
  },
  dataCollectionTitleUserIndividual: {
    id: 'fsie.application:applicationDataCollectionTitleUserIndividual',
    defaultMessage: 'Gagnaöflun vegna einstaklingsframboðs',
    description: 'Title for data collection section',
  },
  dataCollectionCheckboxLabel: {
    id: 'fsie.application:dataCollectionCheckboxLabel',
    defaultMessage:
      'Ég skil að ofangreindra gagna verður aflað við vinnslu innsendingarinnar',
    description: 'Checkbox label for data collection section',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'fsie.application:dataCollectionNationalRegistryTitle',
    defaultMessage: 'Persónuupplýsingar',
    description: 'National registry title',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'fsie.application:dataCollectionNationalRegistrySubtitle',
    defaultMessage: 'Fullt nafn, kennitala, heimilisfang.',
    description: 'National registry subtitle',
  },
  dataCollectionUserProfileTitle: {
    id: 'fsie.application:dataCollectionUserProfileTitle',
    defaultMessage: 'Mínar síður á Ísland.is/stillingar',
    description: 'Your user profile information',
  },
  dataCollectionUserProfileSubtitle: {
    id: 'fsie.application:dataCollectionUserProfileSubtitle',
    defaultMessage:
      'Ef þú ert með skráðar upplýsingar um síma og netfang inni á Mínar síður á Ísland.is þá verða þær sjálfkrafa settar inn í umsóknina.',
    description:
      'In order to apply for this application we need your email and phone number',
  },
  dataCollectionUserFinancialInfoTitle: {
    id: 'fsie.application:dataCollectionUserFinancialInfoTitle',
    defaultMessage: 'Fjárhagsupplýsingar',
    description: 'Financial info',
  },
  dataCollectionUserFinancialInfo: {
    id: 'fsie.application:dataCollectionUserFinancialInfo',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við fjárhagsupplýsingar til Ríkisendurskoðunar, sem embættið aflar frá viðeigandi aðilum á grundvelli aðgangs- og skoðunarheimilda sem það hefur, og forskráum þær.',
    description: 'Financial info',
  },
  info: {
    id: 'fsie.application:info',
    defaultMessage: 'Upplýsingar',
    description: 'info',
  },
  reviewInfo: {
    id: 'fsie.application:reviewInfo',
    defaultMessage: 'Vinsamlega yfirfarið upplýsingarnar hér að neðan',
    description: 'Review info',
  },
  candidateNationalId: {
    id: 'fsie.application:candidateId',
    defaultMessage: 'Kennitala frambjóðanda',
    description: 'Nationalid of candiate',
  },
  candidatesOwnContributions: {
    id: 'fsie.application:income.candidatesOwnContributions',
    defaultMessage: 'Eigin framlög frambjóðenda',
    description: 'Candiates own donation',
  },
  candidateFullName: {
    id: 'fsie.application:candidateFullName',
    defaultMessage: 'Nafn frambjóðanda',
    description: 'Full name o candiate',
  },
  email: {
    id: 'fsie.application:person.email',
    defaultMessage: 'Netfang',
    description: 'email',
  },
  phoneNumber: {
    id: 'fsie.application:about.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'phone number',
  },
  election: {
    id: 'fsie.application:election',
    defaultMessage: 'Kosningar',
    description: 'Election',
  },
  fillOutElectionInfo: {
    id: 'fsie.application:fillOutElectionInfo',
    defaultMessage: 'Vinsamlegast veldu þær kosningar sem við eiga',
    description: 'Fill out fields',
  },
  expensesIncome: {
    id: 'fsie.application:keyNumbers.expensesIncome',
    defaultMessage: 'Tekjur og gjöld',
    description: 'Expenses and income',
  },
  expenses: {
    id: 'fsie.application:keyNumbers.expenses',
    defaultMessage: 'Gjöld',
    description: 'expenses',
  },
  keyNumbersIncomeAndExpenses: {
    id: 'fsie.application:keyNumbersIncomeAndExpenses',
    defaultMessage: 'Lykiltölur - Tekjur og gjöld',
    description: 'income and expenses of keynumbers',
  },
  fillOutAppopriate: {
    id: 'fsie.application:fillOutAppopriate',
    defaultMessage: 'Vinsamlegast fylltu út þá reiti sem eiga við',
    description: 'Fill out fields',
  },
  propertiesAndDebts: {
    id: 'fsie.application:keyNumbers.properties',
    defaultMessage: 'Eignir, skuldir og eigið fé',
    description: 'Statement property numbers',
  },
  keyNumbersDebt: {
    id: 'fsie.application:keyNumbers.debt',
    defaultMessage: 'Lykiltölur - Eignir, Skuldir og eigið fé',
    description: 'Statement debts',
  },
  keyNumbers: {
    id: 'fsie.application:keyNumbers',
    defaultMessage: 'Lykiltölur',
    description: 'Statement key numbers',
  },
  capitalNumbers: {
    id: 'fsie.application:income.capitalNumbers',
    defaultMessage: 'Fjármagnsliðir',
    description: 'capital numbers',
  },
  capitalNumbersSectionTitle: {
    id: 'fsie.application:income.capitalNumbersSectionTitle',
    defaultMessage: 'Lykiltölur Fjármagnsliðir',
    description: 'capital numbers',
  },
  financialStatement: {
    id: 'fsie.application:financial.statment',
    defaultMessage: 'Ársreikningur',
    description: 'financial statements',
  },
  upload: {
    id: 'fsie.application:upload',
    defaultMessage: 'Hlaða upp ársreikningi',
    description: 'Upload financial statements',
  },
  uploadHeader: {
    id: 'fsie.application:uploadHeader',
    defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
    description: 'Upload here',
  },
  uploadIntro: {
    id: 'fsie.application:upload.intro',
    defaultMessage: 'Vinsamlegast hlaðið upp ársreikning hér að neðan.',
    description: 'Upload financial statements intro',
  },
  uploadDescription: {
    id: 'fsie.application:upload.description',
    defaultMessage: 'Vinsamlegast hlaðið upp ársreikning hér að neðan.',
    description: 'Upload financial statements intro',
  },
  uploadAccept: {
    id: 'fsie.application:upload.accept',
    defaultMessage: 'Eingöngu er tekið við skjölum á PDF formi',
    description: 'Upload financial statements intro',
  },
  uploadButtonLabel: {
    id: 'fsie.application:upload.buttonlabel',
    defaultMessage: 'Velja skjöl til að hlaða upp',
    description: 'Upload button label',
  },
  statement: {
    id: 'fsie.application:statement',
    defaultMessage: 'Yfirlýsing',
    description: 'statement',
  },
  overviewSectionTitle: {
    id: 'fsie.application:overview.general.sectionTitle',
    defaultMessage: 'Yfirlit',
    description: 'Overview section title',
  },
  overviewReview: {
    id: 'fsie.application:overview.general.review',
    defaultMessage: 'Yfitlit uppgjörs',
    description: 'Overview review',
  },
  yearlyOverview: {
    id: 'fsie.application:overview.general.yearly',
    defaultMessage: 'Yfirlit ársreiknings',
    description: 'Yearly overview',
  },
  overviewDescription: {
    id: 'fsie.application:overview.general.description',
    defaultMessage: 'Farðu vel yfir efnið áður en þú sendir inn umsóknina.',
    description: 'Overview description',
  },
  electionStatement: {
    id: 'fsie.application:electionStatement',
    defaultMessage: 'Yfirlýsing frambjóðanda vegna',
    description: 'statement',
  },
  electionStatementDescription: {
    id: 'fsie.application:electionStatementDescription',
    defaultMessage: 'Yfirlýsing frambjóðanda vegna {election}',
    description:
      'Description at the top og the overview screen if income is less than limit',
  },
  review: {
    id: 'fsie.application:review',
    defaultMessage:
      'Endilega lestu yfir til að vera viss um að allar upplýsingar hafi verið gefnar',
    description: 'financial statements',
  },
  powerOfAttorneyNationalId: {
    id: 'fsie.application:powerOfAttorneyNationalId',
    defaultMessage: 'Kennitala umboðsmanns',
    description: `national id for power of attorney`,
  },
  powerOfAttorneyName: {
    id: 'fsie.application:powerOfAttorneyName',
    defaultMessage: 'Nafn umboðsmanns',
    description: `name for power of attorney`,
  },
  errorFetchingName: {
    id: 'fsie.application:error.errorFetchingName',
    defaultMessage: 'Tókst ekki að sækja nafn umboðsmanns',
    description: 'Could not fetch powerofattorney name',
  },
  wrongDelegation: {
    id: 'fsie.application:wrongDelegation',
    defaultMessage:
      'Eingöngu er hægt að skila fyrir hönd Kirkjugarða eða Stjórnmálasamtaka',
    description: 'Logged in user with incorrect delegation type',
  },
  genericError: {
    id: 'fsie.application:error.genericError',
    defaultMessage: 'Eitthvað fór úrskeiðis',
    description: 'Generic error message',
  },
  campaignCost: {
    id: 'fsie.application:campaignCost',
    defaultMessage: 'Heildartekjur við kosningabaráttu',
    description: 'Election campaign cost',
  },
  pleaseSelect: {
    id: 'fsie.application:pleaseSelect',
    defaultMessage: 'Vinsamlegast veldu það sem við á',
    description: 'Please select',
  },
  fetchErrorTitle: {
    id: 'fsie.application:fetchErrorMsg',
    defaultMessage: 'Eitthvað fór úrskeiðiðs',
    description: 'Error msg title when fetching data fails',
  },
  fetchErrorMsg: {
    id: 'fsie.application:fetchError',
    defaultMessage: 'Ekki tókst að sækja gögn, reyndur aftur seinna',
    description: 'Error msg when fetching data fails',
  },
  pickElectionType: {
    id: 'fsie.application:SelectElectionType',
    defaultMessage: 'Veldu kosningar',
    description: 'Select election type',
  },
  financialLimitErrorMessage: {
    id: 'fsie.application:financialLimitErrorMessage',
    defaultMessage:
      'Fjárhæðarmörk fyrir rekstrarár hafa ekki verið skilgreind. Vinsamlegast hafðu samband við Ríkisendurskoðun.',
    description: 'Happens when financial limit has not been set in Dataverse',
  },
  lessThanLimit: {
    id: 'fsie.application:lessThanLimit',
    defaultMessage:
      'Heildartekjur og heildarkostnaður við kosningabaráttuna var minni en {limit}',
    description: 'Spending was less than a specific limit',
  },
  moreThanLimit: {
    id: 'fsie.application:moreThanLimit',
    defaultMessage:
      'Heildartekjur og heildarkostnaður við kosningabaráttuna var meira en {limit}',
    description: 'Spending was more than a specific limit',
  },
  crowns: {
    id: 'fsie.application:crowns',
    defaultMessage: 'krónum',
    description: 'crowns',
  },
  income: {
    id: 'fsie.application:income',
    defaultMessage: 'Tekjur',
    description: 'Applicants income',
  },
  totalIncome: {
    id: 'fsie.application:income.totalIncome',
    defaultMessage: 'Tekjur samtals:',
    description: 'Total income',
  },
  totalExpenses: {
    id: 'fsie.application:income.totalExpenses',
    defaultMessage: 'Gjöld samtals:',
    description: 'Total expenses',
  },
  operatingCost: {
    id: 'fsie.application:keyNumbers.operatingCost',
    defaultMessage: 'Rekstrarniðurstaða alls',
    description: 'Operating Cost',
  },
  operatingCostBefore: {
    id: 'fsie.application:keyNumbers.operatingCostBeforeCapital',
    defaultMessage: 'Rekstrarniðurstaða fyrir fjármagnsliði',
    description: 'Operating Cost Capital',
  },
  contributionsFromLegalEntities: {
    id: 'fsie.application:income.contributionsFromLegalEntities',
    defaultMessage: 'Framlög lögaðila',
    description: 'Contributions From Legal Entities',
  },
  contributionsFromIndividuals: {
    id: 'fsie.application:income.contributionsFromIndividuals',
    defaultMessage: 'Framlög einstaklinga',
    description: 'Contributions From Individuals',
  },
  otherIncome: {
    id: 'fsie.application:income.other',
    defaultMessage: 'Aðrar tekjur',
    description: 'Other income',
  },
  electionOffice: {
    id: 'fsie.application:income.electionOffice',
    defaultMessage: 'Kosningaskrifstofa',
    description: 'electionOffice',
  },
  advertisements: {
    id: 'fsie.application:income.advertisements',
    defaultMessage: 'Auglýsingar og kynningar',
    description: 'Advertisements costs',
  },
  travelCost: {
    id: 'fsie.application:income.travelCost',
    defaultMessage: 'Fundir ferðakostnaður',
    description: 'Meeting and travel cost',
  },
  otherCost: {
    id: 'fsie.application:income.otherCost',
    defaultMessage: 'Annar kostnaður',
    description: 'Other costs',
  },
  totalCapital: {
    id: 'fsie.application:totalCapital',
    defaultMessage: 'Fjármagnsliðir samtals',
    description: 'Total capital',
  },
  capitalCost: {
    id: 'fsie.application:income.capitalCost',
    defaultMessage: 'Fjármagnsgjöld',
    description: 'capital costs',
  },
  capitalIncome: {
    id: 'fsie.application:income.capital',
    defaultMessage: 'Fjármagnstekjur',
    description: 'capital income',
  },
  equityDebtsAssetsValidatorError: {
    id: 'fsie.application:equityValidatorError',
    defaultMessage: 'Skuldir og eigið fé þarf að vera jafnt og eignir samtals',
    description: 'Equity + debts shout equal assets',
  },
  properties: {
    id: 'fsie.application:properties',
    defaultMessage: 'Eignir',
    description: 'List of applicants properties',
  },
  debts: {
    id: 'fsie.application:debts',
    defaultMessage: 'Skuldir',
    description: 'Applicants debts',
  },
  fixedAssetsTotal: {
    id: 'fsie.application:keyNumbers.fixedAssetsTotal',
    defaultMessage: 'Fastafjármunir samtals',
    description: 'Fixed assets',
  },
  currentAssets: {
    id: 'fsie.application:keyNumbers.currentAssets',
    defaultMessage: 'Veltufjármunir samtals',
    description: 'Current assets',
  },
  totalAssets: {
    id: 'fsie.application:totalAssets',
    defaultMessage: 'Eignir samtals',
    description: 'Total assets',
  },
  debtsAndEquity: {
    id: 'fsie.application:keyNumbers.debtsAndEquity',
    defaultMessage: 'Skuldir og eigið fé',
    description: 'debts and equity',
  },
  longTerm: {
    id: 'fsie.application:keyNumbers.longTermdebt',
    defaultMessage: 'Langtímaskuldir samtals',
    description: 'Long term debt',
  },
  shortTerm: {
    id: 'fsie.application:keyNumbers.shortTermDebt',
    defaultMessage: 'Skammtímaskuldir samtals',
    description: 'Short term debt',
  },
  totalDebts: {
    id: 'fsie.application:income.totalDebts',
    defaultMessage: 'Skuldir samtals:',
    description: 'Total debts',
  },
  equity: {
    id: 'fsie.application:keyNumbers.equity',
    defaultMessage: 'Eigið fé',
    description: 'total equity',
  },
  debtsAndCash: {
    id: 'fsie.application:keyNumbers.debtsAndCash',
    defaultMessage: 'Skuldir og eigið fé samtals',
    description: 'Debts and cash',
  },
  equityErrorTitle: {
    id: 'fsie.application:equityErrorTitle',
    defaultMessage: 'Ósamræmi í tölum',
    description: 'Error msg title when E = S+E.fé is incorrect',
  },
  fullName: {
    id: 'fsie.application:fullName',
    defaultMessage: 'Fullt nafn',
    description: 'Full name',
  },
  nationalId: {
    id: 'fsie.application:nationalId',
    defaultMessage: 'Kennitala',
    description: 'National id',
  },
  totalLiabilities: {
    id: 'fsie.application:keyNumbers.totalLiabilities',
    defaultMessage: 'Skuldir samtals',
    description: 'total liabilities',
  },
  overview: {
    id: 'fsie.application:overview.general.overview',
    defaultMessage: 'Yfirferð',
    description: 'Overview section title',
  },
  overviewCorrect: {
    id: 'fsie.application:overview.overViewCorrect',
    defaultMessage: 'Ég samþykki að ofangreindar upplýsingar séu réttar',
    description: 'Overview correct',
  },
  files: {
    id: 'fsie.application:files',
    defaultMessage: 'Skjöl',
    description: 'files',
  },
  attachments: {
    id: 'fsie.application:attachments',
    defaultMessage: 'Fylgiskjöl',
    description: 'attachments',
  },
  errorApproval: {
    id: 'fsie.application:error.errorApproval',
    defaultMessage: 'Samþykkja þarf yfirlit',
    description: 'Approval missing',
  },
  submitErrorTitle: {
    id: 'fsie.application:submitErrorTitle',
    defaultMessage: 'Móttaka ársreiknings tókst ekki',
    description:
      'Title that shows up when an error occurs while submitting the application',
  },
  submitErrorMessage: {
    id: 'fsie.application:submitErrorMessage',
    defaultMessage:
      'Eitthvað fór úrskeiðis við að senda inn ársreikning. Reyndu aftur síðar.',
    description:
      'Text that shows up when an error occurs while submitting the application',
  },
  goBack: {
    id: 'fsie.application:overview.goBack',
    defaultMessage: 'Til Baka',
    description: 'Go back btn text',
  },
  send: {
    id: 'fsie.application:send',
    defaultMessage: 'Senda umsókn',
    description: 'Send application',
  },
  participated: {
    id: 'fsie.application:overview.participated',
    defaultMessage: 'tók þátt í kjöri til',
    description: 'Participated in election',
  },
  participatedIn: {
    id: 'fsie.application:participatedIn',
    defaultMessage:
      '{fullName}, kennitala: {nationalId}, tók þátt í kjöri til {election}',
    description: 'Participated in election',
  },
  electionDeclare: {
    id: 'fsie.application:electionStatementDeclare',
    defaultMessage:
      'Ég lýsi því hér með yfir að viðlögðum drengskap að hvorki heildartekjur né heildarkostnaður vegna framboðs míns í kjörinu voru hærri en {incomeLimit}',
    description: 'statement',
  },
  electionStatementLaw: {
    id: 'fsie.application:electionStatementLaw',
    defaultMessage:
      'Það staðfestist hér með að heildartekjur eða -kostnaður vegna framboðsins voru ekki umfram þau fjárhæðarmörk sem tilgreind eru í 3. mgr. 10. gr. laga nr. 162/2006, um starfsemi stjórnmálasamtaka, og er framboðið því undanþegið uppgjörsskyldu.',
    description: 'statement',
  },
  signatureTitle: {
    id: 'fsie.application:SignatureTitle',
    defaultMessage: 'Rafræn undirritun',
    description: 'Signature alert title',
  },
  signatureMessage: {
    id: 'fsie.application:SignatureMessage',
    defaultMessage:
      'Eftir að þú hefur sent inn umsókn mun rafræn undirritun verða send á netfangið {email} svo hægt sé að undirrita hana með rafrænum skilríkjum.',
    description: 'Signature message',
  },
  signaturePossible: {
    id: 'fsie.application:SignaturePossible',
    defaultMessage: 'svo hægt sé að undirrita hana með rafrænum skilríkjum.',
    description: 'Signature possible message',
  },
  sendStatement: {
    id: 'fsie.application:sendStatement',
    defaultMessage: 'Senda yfirlýsingu',
    description: 'Send statement',
  },
  infoReceived: {
    id: 'fsie.application:infoReceived',
    defaultMessage: 'Uppgjör móttekið',
    description: 'election info received',
  },
  individualReceivedMsgFirst: {
    id: 'fsie.application:individualReceivedMsgFirst',
    defaultMessage: 'Uppgjör fyrir persónukjör vegna',
    description: 'First part of audit received message',
  },
  individualReceivedMsgSecond: {
    id: 'fsie.application:individualReceivedMsgSecond',
    defaultMessage: 'hefur verið skilað þann',
    description: 'Second part of audit received message',
  },
  digitalSignatureTitle: {
    id: 'fsie.application:digitalSignatureTitle',
    defaultMessage: 'Rafræn undirritun',
    description:
      'Reminder of digital signature after the application is returned',
  },
  digitalSignatureMessage: {
    id: 'fsie.application:digitalSignatureMessage',
    defaultMessage:
      'Það bíður þín skjal sem á eftir að undirrita með rafrænum skilríkjum. Hlekkur á skjalið hefur verið sendur í tölvupósti á netfangið þitt: {email}',
    description:
      'Reminder of digital signature after the application is returned',
  },
  myPagesLinkText: {
    id: 'fsie.application:myPagesLinkText',
    defaultMessage:
      'Á Mínum síðum Ísland.is hefur þú aðgang að marvíslegum upplýsingum s.s stafrænt pósthólf, þínar upplýsingar, fjármál, umsóknir, menntun, fasteignir, ökutæki, skírteini, starfsleyfi ofl. ',
    description: 'island.is my pages info',
  },
  continue: {
    id: 'fsie.application:continue',
    defaultMessage: 'Áfram',
    description: 'continue',
  },
  conclusionAlertTitle: {
    id: 'fsie.application:conclusionAlertTitle',
    defaultMessage: 'Uppgjöri hefur verið skilað',
    description: 'conclusion alert title',
  },
  conclusionAlertMessage: {
    id: 'fsie.application:conclusionTitle',
    defaultMessage: 'Uppgjör vegna {election} hefur verið skilað',
    description: 'conclusion title',
  },
  conclusionDescription: {
    id: 'fsie.application:conclusionDescription',
    defaultMessage: 'Uppgjör fyrir persónukjör vegna',
    description: 'conclusion description',
  },
  conclusionBulletList: {
    id: 'fsie.application:conclusionBulletList',
    defaultMessage: 'Uppgjör fyrir persónukjör vegna',
    description: 'conclusion bullet list',
  },
  conclusionTabTitle: {
    id: 'fsie.application:conclusionTabTitle',
    defaultMessage: 'Uppgjör móttekið',
    description: 'conclusion tab title',
  },
  financialLimit: {
    id: 'fsie.application:financialLimit',
    defaultMessage: 'Heildartekjur eða kostnaður vegna framboðsins',
    description: 'financial limit',
  },
})
