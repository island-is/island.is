import { defineMessages } from 'react-intl'

export const m = defineMessages({
  applicationTitle: {
    id: 'fspp.application:title',
    defaultMessage: 'Skil ársreikninga fyrir stjórnmálaflokka',
    description: 'Application title',
  },
  institutionName: {
    id: 'fspp.application:institution',
    defaultMessage: 'Ríkisendurskoðun',
    description: `Institution's name`,
  },
  inao: {
    id: 'fspp.application:inao',
    defaultMessage: 'Ríkisendurskoðun',
    description: 'icelandic national audit',
  },
  serviceProvider: {
    id: 'fspp.application:serviceProvider',
    defaultMessage: 'Þjónustuaðili',
    description: 'service provider',
  },
  dataCollectionTitleUserParty: {
    id: 'fspp.application:applicationDataCollectionTitleUserParty',
    defaultMessage: 'Gagnaöflun vegna skila ársreiknings stjórnmálaflokks',
    description: 'Title for data collection section',
  },
  dataCollectionCheckboxLabel: {
    id: 'fspp.application:dataCollectionCheckboxLabel',
    defaultMessage:
      'Ég skil að ofangreindra gagna verður aflað við vinnslu innsendingarinnar',
    description: 'Checkbox label for data collection section',
  },
  dataCollectionNationalRegistryTitle: {
    id: 'fspp.application:dataCollectionNationalRegistryTitle',
    defaultMessage: 'Persónuupplýsingar',
    description: 'National registry title',
  },
  dataCollectionNationalRegistrySubtitle: {
    id: 'fspp.application:dataCollectionNationalRegistrySubtitle',
    defaultMessage: 'Fullt nafn, kennitala, heimilisfang.',
    description: 'National registry subtitle',
  },
  dataCollectionUserProfileTitle: {
    id: 'fspp.application:dataCollectionUserProfileTitle',
    defaultMessage: 'Mínar síður á Ísland.is/stillingar',
    description: 'Your user profile information',
  },
  dataCollectionUserProfileSubtitle: {
    id: 'fspp.application:dataCollectionUserProfileSubtitle',
    defaultMessage:
      'Ef þú ert með skráðar upplýsingar um síma og netfang inni á Mínar síður á Ísland.is þá verða þær sjálfkrafa settar inn í umsóknina.',
    description:
      'In order to apply for this application we need your email and phone number',
  },
  dataCollectionUserFinancialInfoTitle: {
    id: 'fspp.application:dataCollectionUserFinancialInfoTitle',
    defaultMessage: 'Fjárhagsupplýsingar',
    description: 'Financial info',
  },
  dataCollectionUserFinancialInfo: {
    id: 'fspp.application:dataCollectionUserFinancialInfo',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við fjárhagsupplýsingar til Ríkisendurskoðunar, sem embættið aflar frá viðeigandi aðilum á grundvelli aðgangs- og skoðunarheimilda sem það hefur, og forskráum þær.',
    description: 'Financial info',
  },
  info: {
    id: 'fspp.application:info',
    defaultMessage: 'Upplýsingar',
    description: 'info',
  },
  reviewContact: {
    id: 'fspp.application:reviewContact',
    defaultMessage: 'Vinsamlega yfirfarið upplýsingar um tengilið hér að neðan',
    description: 'Review contact info',
  },
  operatingYear: {
    id: 'fspp.application:keyNumbers.operatingYear',
    defaultMessage: 'Rekstrarár',
    description: 'Operating year',
  },
  selectOperatingYear: {
    id: 'fspp.application:keyNumbers.selectOperatingYear',
    defaultMessage: 'Veldu rekstrarár',
    description: 'Select operating year',
  },
  fetchErrorTitle: {
    id: 'fspp.application:fetchErrorMsg',
    defaultMessage: 'Eitthvað fór úrskeiðiðs',
    description: 'Error msg title when fetching data fails',
  },
  fetchErrorMsg: {
    id: 'fspp.application:fetchError',
    defaultMessage: 'Ekki tókst að sækja gögn, reyndur aftur seinna',
    description: 'Error msg when fetching data fails',
  },
  clientNationalId: {
    id: 'fspp.application:clientNationalId',
    defaultMessage: 'Kennitala viðskiptavinar',
    description: 'client national id',
  },
  clientName: {
    id: 'fspp.application:clientName',
    defaultMessage: 'Nafn viðskiptavinar',
    description: 'client name',
  },
  email: {
    id: 'fspp.application:person.email',
    defaultMessage: 'Netfang',
    description: 'email',
  },
  phoneNumber: {
    id: 'fspp.application:about.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'phone number',
  },
  keyNumbers: {
    id: 'fspp.application:keyNumbers',
    defaultMessage: 'Lykiltölur',
    description: 'Statement key numbers',
  },
  powerOfAttorneyNationalId: {
    id: 'fspp.application:powerOfAttorneyNationalId',
    defaultMessage: 'Kennitala umboðsmanns',
    description: `national id for power of attorney`,
  },
  powerOfAttorneyName: {
    id: 'fspp.application:powerOfAttorneyName',
    defaultMessage: 'Nafn umboðsmanns',
    description: `name for power of attorney`,
  },
  errorFetchingName: {
    id: 'fspp.application:error.errorFetchingName',
    defaultMessage: 'Tókst ekki að sækja nafn umboðsmanns',
    description: 'Could not fetch powerofattorney name',
  },
  wrongDelegation: {
    id: 'fspp.application:wrongDelegation',
    defaultMessage: 'Eingöngu er hægt að skila fyrir hönd Stjórnmálasamtaka',
    description: 'Logged in user with incorrect delegation type',
  },
  genericError: {
    id: 'fspp.application:error.genericError',
    defaultMessage: 'Eitthvað fór úrskeiðis',
    description: 'Generic error message',
  },
  expensesIncome: {
    id: 'fspp.application:keyNumbers.expensesIncome',
    defaultMessage: 'Tekjur og gjöld',
    description: 'Expenses and income',
  },
  keyNumbersIncomeAndExpenses: {
    id: 'fspp.application:keyNumbersIncomeAndExpenses',
    defaultMessage: 'Lykiltölur - Tekjur og gjöld',
    description: 'income and expenses of keynumbers',
  },
  fillOutAppopriate: {
    id: 'fspp.application:fillOutAppopriate',
    defaultMessage: 'Vinsamlegast fylltu út þá reiti sem eiga við',
    description: 'Fill out fields',
  },
  contributionsFromTheTreasury: {
    id: 'fspp.application:income.contributionsFromTheTreasury',
    defaultMessage: 'Framlög úr ríkissjóði',
    description: 'public donations',
  },
  parliamentaryPartySupport: {
    id: 'fspp.application:income.parliamentaryPartySupport',
    defaultMessage: 'Þingflokksstyrkur',
    description: 'Party donations',
  },
  municipalContributions: {
    id: 'fspp.application:income.municipalContributions',
    defaultMessage: 'Framlög sveitarfélaga',
    description: 'Municipality Donations',
  },
  contributionsFromLegalEntities: {
    id: 'fspp.application:income.contributionsFromLegalEntities',
    defaultMessage: 'Framlög lögaðila',
    description: 'Contributions From Legal Entities',
  },
  contributionsFromIndividuals: {
    id: 'fspp.application:income.contributionsFromIndividuals',
    defaultMessage: 'Framlög einstaklinga',
    description: 'Contributions From Individuals',
  },
  generalMembershipFees: {
    id: 'fspp.application:income.generalMembershipFees',
    defaultMessage: 'Almenn félagsgjöld',
    description: 'General membership fees',
  },
  otherIncome: {
    id: 'fspp.application:income.other',
    defaultMessage: 'Aðrar tekjur',
    description: 'Other income',
  },
  electionOffice: {
    id: 'fspp.application:income.electionOffice',
    defaultMessage: 'Kosningaskrifstofa',
    description: 'electionOffice',
  },
  otherOperationalCost: {
    id: 'fspp.application:income.otherOperationalCost',
    defaultMessage: 'Annar rekstrarkostnaður',
    description: 'Other costs',
  },
  income: {
    id: 'fspp.application:income',
    defaultMessage: 'Tekjur',
    description: 'Applicants income',
  },
  totalIncome: {
    id: 'fspp.application:income.totalIncome',
    defaultMessage: 'Tekjur samtals:',
    description: 'Total income',
  },
  totalExpenses: {
    id: 'fspp.application:income.totalExpenses',
    defaultMessage: 'Gjöld samtals:',
    description: 'Total expenses',
  },
  expenses: {
    id: 'fspp.application:keyNumbers.expenses',
    defaultMessage: 'Gjöld',
    description: 'expenses',
  },
  operatingCost: {
    id: 'fspp.application:keyNumbers.operatingCost',
    defaultMessage: 'Rekstrarniðurstaða alls',
    description: 'Operating Cost',
  },
  operatingCostBefore: {
    id: 'fspp.application:keyNumbers.operatingCostBeforeCapital',
    defaultMessage: 'Rekstrarniðurstaða fyrir fjármagnsliði',
    description: 'Operating Cost Capital',
  },
  capitalNumbers: {
    id: 'fspp.application:income.capitalNumbers',
    defaultMessage: 'Fjármagnsliðir',
    description: 'capital numbers',
  },
  capitalNumbersSectionTitle: {
    id: 'fspp.application:income.capitalNumbersSectionTitle',
    defaultMessage: 'Lykiltölur - Fjármagnsliðir',
    description: 'capital numbers',
  },
  capitalIncome: {
    id: 'fspp.application:income.capital',
    defaultMessage: 'Fjármagnstekjur',
    description: 'capital income',
  },
  capitalCost: {
    id: 'fspp.application:income.capitalCost',
    defaultMessage: 'Fjármagnsgjöld',
    description: 'capital costs',
  },
  totalCapital: {
    id: 'fspp.application:totalCapital',
    defaultMessage: 'Fjármagnsliðir samtals',
    description: 'Total capital',
  },
  propertiesAndDebts: {
    id: 'fspp.application:keyNumbers.properties',
    defaultMessage: 'Eignir, skuldir og eigið fé',
    description: 'Statement property numbers',
  },
  keyNumbersDebt: {
    id: 'fspp.application:keyNumbers.debt',
    defaultMessage: 'Lykiltölur - Eignir, skuldir og eigið fé',
    description: 'Statement debts',
  },
  equityDebtsAssetsValidatorError: {
    id: 'fspp.application:equityValidatorError',
    defaultMessage: 'Skuldir og eigið fé þurfa að vera jöfn og eignum samtals',
    description: 'Equity + debts shout equal assets',
  },
  properties: {
    id: 'fspp.application:properties',
    defaultMessage: 'Eignir',
    description: 'List of applicants properties',
  },
  fixedAssetsTotal: {
    id: 'fspp.application:keyNumbers.fixedAssetsTotal',
    defaultMessage: 'Fastafjármunir samtals',
    description: 'Fixed assets',
  },
  currentAssets: {
    id: 'fspp.application:keyNumbers.currentAssets',
    defaultMessage: 'Veltufjármunir samtals',
    description: 'Current assets',
  },
  longTerm: {
    id: 'fspp.application:keyNumbers.longTermdebt',
    defaultMessage: 'Langtímaskuldir samtals',
    description: 'Long term debt',
  },
  shortTerm: {
    id: 'fspp.application:keyNumbers.shortTermDebt',
    defaultMessage: 'Skammtímaskuldir samtals',
    description: 'Short term debt',
  },
  totalAssets: {
    id: 'fspp.application:totalAssets',
    defaultMessage: 'Eignir samtals',
    description: 'Total assets',
  },
  debts: {
    id: 'fspp.application:keyNumbers.debts',
    defaultMessage: 'Skuldir',
    description: 'debts',
  },
  debtsAndEquity: {
    id: 'fspp.application:keyNumbers.debtsAndEquity',
    defaultMessage: 'Skuldir og eigið fé',
    description: 'debts and equity',
  },
  totalDebts: {
    id: 'fspp.application:income.totalDebts',
    defaultMessage: 'Skuldir samtals:',
    description: 'Total debts',
  },
  equity: {
    id: 'fspp.application:keyNumbers.equity',
    defaultMessage: 'Eigið fé',
    description: 'total equity',
  },
  debtsAndCash: {
    id: 'fspp.application:keyNumbers.debtsAndCash',
    defaultMessage: 'Skuldir og eigið fé samtals',
    description: 'Debts and cash',
  },
  equityErrorTitle: {
    id: 'fspp.application:equityErrorTitle',
    defaultMessage: 'Ósamræmi í tölum',
    description: 'Error msg title when E = S+E.fé is incorrect',
  },
  financialStatement: {
    id: 'fspp.application:financial.statment',
    defaultMessage: 'Ársreikningur',
    description: 'financial statements',
  },
  upload: {
    id: 'fspp.application:upload',
    defaultMessage: 'Hlaða upp ársreikningi',
    description: 'Upload financial statements',
  },
  uploadHeader: {
    id: 'fspp.application:uploadHeader',
    defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
    description: 'Upload here',
  },
  uploadIntro: {
    id: 'fspp.application:upload.intro',
    defaultMessage: 'Vinsamlegast hlaðið upp ársreikning hér að neðan.',
    description: 'Upload financial statements intro',
  },
  uploadDescription: {
    id: 'fspp.application:upload.description',
    defaultMessage: 'Vinsamlegast hlaðið upp ársreikning hér að neðan.',
    description: 'Upload financial statements intro',
  },
  uploadAccept: {
    id: 'fspp.application:upload.accept',
    defaultMessage: 'Eingöngu er tekið við skjölum á PDF formi',
    description: 'Upload financial statements intro',
  },
  uploadButtonLabel: {
    id: 'fspp.application:upload.buttonlabel',
    defaultMessage: 'Velja skjöl til að hlaða upp',
    description: 'Upload button label',
  },
  overviewSectionTitle: {
    id: 'fspp.application:overview.general.sectionTitle',
    defaultMessage: 'Yfirlit',
    description: 'Overview section title',
  },
  yearlyOverview: {
    id: 'fspp.application:overview.general.yearly',
    defaultMessage: 'Yfirlit ársreiknings',
    description: 'Yearly overview',
  },
  review: {
    id: 'fspp.application:review',
    defaultMessage:
      'Endilega lestu yfir til að vera viss um að allar upplýsingar hafi verið gefnar',
    description: 'financial statements',
  },
  submitErrorMessage: {
    id: 'fspp.application:submitErrorMessage',
    defaultMessage:
      'Eitthvað fór úrskeiðis við að senda inn ársreikning. Reyndu aftur síðar.',
    description:
      'Text that shows up when an error occurs while submitting the application',
  },
  submitErrorTitle: {
    id: 'fspp.application:submitErrorTitle',
    defaultMessage: 'Móttaka ársreiknings tókst ekki',
    description:
      'Title that shows up when an error occurs while submitting the application',
  },
  errorApproval: {
    id: 'fspp.application:error.errorApproval',
    defaultMessage: 'Samþykkja þarf yfirlit',
    description: 'Approval missing',
  },
  overviewCorrect: {
    id: 'fspp.application:overview.overViewCorrect',
    defaultMessage: 'Ég samþykki að ofangreindar upplýsingar séu réttar',
    description: 'Overview correct',
  },
  overview: {
    id: 'fspp.application:overview.general.overview',
    defaultMessage: 'Yfirferð',
    description: 'Overview section title',
  },
  otherCost: {
    id: 'fspp.application:income.otherCost',
    defaultMessage: 'Annar kostnaður',
    description: 'Other costs',
  },
  files: {
    id: 'fspp.application:files',
    defaultMessage: 'Skjöl',
    description: 'files',
  },
  totalLiabilities: {
    id: 'fspp.application:keyNumbers.totalLiabilities',
    defaultMessage: 'Skuldir samtals',
    description: 'total liabilities',
  },
  nationalId: {
    id: 'fspp.application:nationalId',
    defaultMessage: 'Kennitala',
    description: 'National id',
  },
  fullName: {
    id: 'fspp.application:fullName',
    defaultMessage: 'Fullt nafn',
    description: 'Full name',
  },
  goBack: {
    id: 'fspp.application:overview.goBack',
    defaultMessage: 'Til Baka',
    description: 'Go back btn text',
  },
  send: {
    id: 'fspp.application:send',
    defaultMessage: 'Senda umsókn',
    description: 'Send application',
  },
  travelCost: {
    id: 'fspp.application:income.travelCost',
    defaultMessage: 'Fundir ferðakostnaður',
    description: 'Meeting and travel cost',
  },
  advertisements: {
    id: 'fspp.application:income.advertisements',
    defaultMessage: 'Auglýsingar og kynningar',
    description: 'Advertisements costs',
  },
  candidatesOwnContributions: {
    id: 'fspp.application:income.candidatesOwnContributions',
    defaultMessage: 'Eigin framlög frambjóðenda',
    description: 'Candiates own donation',
  },
  participated: {
    id: 'fspp.application:overview.participated',
    defaultMessage: 'tók þátt í kjöri til',
    description: 'Participated in election',
  },
  electionDeclare: {
    id: 'fspp.application:electionStatementDeclare',
    defaultMessage:
      'Ég lýsi því hér með yfir að viðlögðum drengskap að hvorki heildartekjur né heildarkostnaður vegna framboðs míns í kjörinu voru hærri en kr.',
    description: 'statement',
  },
  electionStatementLaw: {
    id: 'fspp.application:electionStatementLaw',
    defaultMessage:
      'Það staðfestist hér með að heildartekjur eða -kostnaður vegna framboðsins voru ekki umfram þau fjárhæðarmörk sem tilgreind eru í 3. mgr. 10. gr. laga nr. 162/2006, um starfsemi stjórnmálasamtaka, og er framboðið því undanþegið uppgjörsskyldu.',
    description: 'statement',
  },
  signatureTitle: {
    id: 'fspp.application:SignatureTitle',
    defaultMessage: 'Rafræn undirritun',
    description: 'Signature alert title',
  },
  signatureMessage: {
    id: 'fspp.application:SignatureMessage',
    defaultMessage:
      'Eftir að þú hefur sent inn umsókn mun rafræn undirritun verða send á netfangið',
    description: 'Signature message',
  },
  signaturePossible: {
    id: 'fspp.application:SignaturePossible',
    defaultMessage: 'svo hægt sé að undirrita hana með rafrænum skilríkjum.',
    description: 'Signature possible message',
  },
  sendStatement: {
    id: 'fspp.application:sendStatement',
    defaultMessage: 'Senda yfirlýsingu',
    description: 'Send statement',
  },
  received: {
    id: 'fspp.application:received',
    defaultMessage: 'Ársreikningur mótekinn',
    description: 'financial statement received',
  },
  applicationAccept: {
    id: 'fspp.application:applicationAccept',
    defaultMessage: 'Umsókn móttekin',
    description: 'application accept',
  },
  operatingYearMsgFirst: {
    id: 'fspp.application:operatingYearMsgFirst',
    defaultMessage: 'Ársreikningi fyrir rekstrarárið',
    description: 'First part of audit received message',
  },
  auditReceivedMsgSecond: {
    id: 'fspp.application:individualReceivedMsgSecond',
    defaultMessage: 'hefur verið skilað þann',
    description: 'Second part of audit received message',
  },
  individualReceivedMsgSecond: {
    id: 'fspp.application:individualReceivedMsgSecond',
    defaultMessage: 'hefur verið skilað þann',
    description: 'Second part of audit received message',
  },
  returned: {
    id: 'fspp.application:returned',
    defaultMessage: 'Skilað',
    description: 'Returned',
  },
  myPagesLinkText: {
    id: 'fspp.application:myPagesLinkText',
    defaultMessage:
      'Á Mínum síðum Ísland.is hefur þú aðgang að marvíslegum upplýsingum s.s stafrænt pósthólf, þínar upplýsingar, fjármál, umsóknir, menntun, fasteignir, ökutæki, skírteini, starfsleyfi ofl. ',
    description: 'island.is my pages info',
  },
  continue: {
    id: 'fspp.application:continue',
    defaultMessage: 'Áfram',
    description: 'continue',
  },
  required: {
    id: 'fspp.application:error.required',
    defaultMessage: 'Reitur má ekki vera tómur',
    description: 'Error message when a required field has not been filled',
  },
  nationalIdError: {
    id: 'fspp.application:error.nationalIdError',
    defaultMessage: 'Kennitala er ekki á réttu formi',
    description: 'Error message when nationalid is wrong',
  },
  dataSchemePhoneNumber: {
    id: 'fspp.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
  negativeNumberError: {
    id: 'fspp.application:error.negativeNumberError',
    defaultMessage: 'Ekki er leyfilegt að setja inn neikvæðar tölur',
    description: 'Error message when a required field has not been filled',
  },
  notAllowedTitle: {
    id: 'fspp.application:notAllowedTitle',
    defaultMessage:
      'Þessi kennitala er ekki skráð sem stjórnmálasamtök hjá Ríkisendurskoðun',
    description: 'Title when user is not allowed to apply',
  },
  notAllowedDescription: {
    id: 'fspp.application:notAllowedDescription',
    defaultMessage:
      'Ef þú telur að þessi kennitala ætti að vera skráð sem stjórnmálasamtök þá bendum við þér á að hafa samband við Ríkisendurskoðun í síma 448 8800',
    description: 'Descriptionwhen user is not allowed to apply',
  },
  conclusionAlertMessage: {
    id: 'fspp.application:conclusionAlertMessage',
    defaultMessage:
      'Ársreikning fyrir rekstrarárið {value1} hefur verið skilað',
    description: 'Conclusion alert message',
  },
  aboutOverview: {
    id: 'fspp.application:aboutOverview',
    defaultMessage: 'Um stjórnmálasamtökin',
    description: 'About party overview',
  },
})
