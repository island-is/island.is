import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // Application begin
  institutionName: {
    id: 'es.application:institution.name',
    defaultMessage: 'Sýslumenn',
    description: 'Institution name',
  },
  draftTitle: {
    id: 'es.application:draft.title',
    defaultMessage: 'Drög',
    description: 'Draft title',
  },
  draftDescription: {
    id: 'es.application:draft.description',
    defaultMessage: 'Drög að ólokinni umsókn',
    description: 'Draft description',
  },
  // Application end

  // Pre-data collection
  preDataCollectionHeading: {
    id: 'es.application:preDataCollectionHeading',
    defaultMessage: 'Foröflun gagna',
    description: 'Heading for pre-collection',
  },
  preDataCollectionInfo: {
    id: 'es.application:preDataCollectionInfo',
    defaultMessage:
      'Til þess að geta hafið umsókn þarf fyrst að sækja til sýslumanns hvort viðkomandi eigi einhver dánarbú á skrá.',
    description: 'Info for pre-collection',
  },
  preDataCollectionTitle: {
    id: 'es.application:preDataCollectionTitle',
    defaultMessage: 'Upplýsingar um dánarbú',
    description: 'Title of provider for pre-collection',
  },

  preDataCollectionDescription: {
    id: 'es.application:preDataCollectionDescription',
    defaultMessage: 'Sóttar verða upplýsingar frá sýslumanni um dánarbú',
    description: 'Description of provider for pre-collection',
  },

  // Prereqs title
  chooseEstate: {
    id: 'es.application:chooseEstate',
    defaultMessage: 'Valið dánarbú',
    description: '',
  },
  chooseEstateDescription: {
    id: 'es.application:chooseEstateDescription',
    defaultMessage:
      'Eftirfarandi dánarbú eru skráð fyrir þinni kennitölu hjá Sýslumanni. Vinsamlegast veldu það sem við á.',
    description: '',
  },
  chooseEstateSelectTitle: {
    id: 'es.application:chooseEstateSelectTitle',
    defaultMessage: 'Dánarbú',
    description: '',
  },
  prerequisitesTitle: {
    id: 'es.application:prerequisitesTitle',
    defaultMessage: 'Ákvörðun um skipti dánarbús',
    description: '',
  },
  prerequisitesSubtitle: {
    id: 'es.application:prerequisitesSubtitle#markdown',
    defaultMessage:
      'Við skipti á dánarbúi er hægt að fara fjórar leiðir. Velja þarf eina leið samanber eftirfarandi:',
    description: '',
  },
  institution: {
    id: 'es.application:institution',
    defaultMessage: 'Sýslumenn',
    description: '',
  },
  confirmButton: {
    id: 'es.application:confirmButton',
    defaultMessage: 'Staðfesta',
    description: '',
  },
  noContactInfo: {
    id: 'es.application:noContactInfo',
    defaultMessage: 'Án upplýsinga um samskipti',
    description: '',
  },

  // Data collection - external data providers
  dataCollectionTitle: {
    id: 'es.application:dataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: '',
  },
  dataCollectionSubtitle: {
    id: 'es.application:dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: '',
  },
  dataCollectionCheckbox: {
    id: 'es.application:dataCollectionCheckbox',
    defaultMessage: 'Ég skil að ofangreindra gagna verður aflað',
    description: '',
  },
  dataCollectionNoEstatesError: {
    id: 'es.application:dataCollectionNoEstatesError',
    defaultMessage:
      'Þú ert ekki skráð/ur fyrir dánarbúi hjá sýslumanni. Ef þú telur svo vera skaltu hafa samband við sýslumann.',
    description:
      'User not eligible for estate or no estates found bound to their national id',
  },

  applicationDescriptionSectionTitle: {
    id: 'es.application:applicationDescriptionSectionTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Titill fyrir hliðastiku',
  },

  applicationDescriptionTitleEstateWithoutAssets: {
    id: 'es.application:applicationDescriptionTitleEstateWithoutAssets',
    defaultMessage: 'Upplýsingar fyrir eingnalaust dánarbú',
    description: 'Upplýsingar skjár titill fyrir eignalaust dánarbú',
  },
  applicationDescriptionTitleOfficialDivision: {
    id: 'es.application:applicationDescriptionTitleOfficialDivision',
    defaultMessage: 'Upplýsingar fyrir opinber skipti',
    description: 'Upplýsingar skjár titill fyrir opinber skipti',
  },
  applicationDescriptionTitleUndividedEstate: {
    id: 'es.application:applicationDescriptionTitleUndividedEstate',
    defaultMessage: 'Upplýsingar',
    description: 'Upplýsingar skjár titill fyrir setu í óskiptu búi',
  },
  applicationDescriptionTitleDivisionOfEstateByHeirs: {
    id: 'es.application:applicationDescriptionTitleDivisionOfEstateByHeirs',
    defaultMessage: 'Upplýsingar',
    description: 'Upplýsinga skjár titill fyrir Einkaskipti',
  },

  applicationDescriptionTextEstateWithoutAssets: {
    id: 'es.application:applicationDescriptionTextEstateWithoutAssets#markdown',
    defaultMessage: 'Upplýsinga Texti fyrir eignalaust dánarbú',
    description: 'Upplýsingar skjár titill fyrir eignalust dánarbú',
  },
  applicationDescriptionTextOfficialDivision: {
    id: 'es.application:applicationDescriptionTextOfficialDivision#markdown',
    defaultMessage: 'Upplýsinga Texti fyrir opinber skipti',
    description: 'Upplýsingar skjár titill fyrir opinber skipti',
  },
  applicationDescriptionTextUndividedEstate: {
    id: 'es.application:applicationDescriptionTextUndividedEstate#markdown',
    defaultMessage: 'Upplýsinga Texti fyrir setu í óskiptu búi',
    description: 'Upplýsingar skjár titill fyrir setu í óskiptu búi',
  },
  applicationDescriptionTextDivisionOfEstateByHeirs: {
    id: 'es.application:applicationDescriptionTextDivisionOfEstateByHeirs#markdown',
    defaultMessage: 'Upplýsinga Texti fyrir einkaskipti',
    description: 'Upplýsingar skjár titill fyrir Einkaskipti',
  },

  deceasedInfoProviderTitle: {
    id: 'es.application:deceasedInfoProviderTitle',
    defaultMessage: 'Upplýsingar um hinn látna',
    description: '',
  },
  providerSubtitleDivisionOfEstateByHeirs: {
    id: 'es.application:providerSubtitleDivisionOfEstateByHeirs',
    defaultMessage:
      'Upplýsingar frá sýslumanni um kennitölu, dánardag, lögheimili, erfingja, eignir og hvort arfleifandi hafi skilað inn erfðaskrá eða gert kaupmála.',
    description: '',
  },
  providerSubtitleEstateWithoutAssets: {
    id: 'es.application:providerSubtitleEstateWithoutAssets',
    defaultMessage:
      'Upplýsingar frá sýslumanni um kennitölu, dánardag, lögheimili, erfingja, eignir og hvort arfleifandi hafi skilað inn erfðaskrá eða gert kaupmála.',
    description: '',
  },
  providerSubtitleOfficialDivision: {
    id: 'es.application:providerSubtitleOfficialDivision',
    defaultMessage:
      'Upplýsingar frá sýslumanni um kennitölu, dánardag, lögheimili, erfingja, eignir og hvort arfleifandi hafi skilað inn erfðaskrá eða gert kaupmála.',
    description: '',
  },
  providerSubtitleUndividedEstate: {
    id: 'es.application:providerSubtitleUndividedEstate',
    defaultMessage:
      'Upplýsingar frá sýslumanni um kennitölu, dánardag, lögheimili, erfingja, eignir og hvort arfleifandi hafi skilað inn erfðaskrá eða gert kaupmála.',
    description: '',
  },
  personalInfoProviderTitle: {
    id: 'es.application:personalInfoProviderTitle',
    defaultMessage: 'Persónuupplýsingar um þig',
    description: '',
  },
  personalInfoProviderSubtitle: {
    id: 'es.application:personalInfoProviderSubtitle',
    defaultMessage: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
    description: '',
  },
  personalInfoProviderSubtitleEstateWithoutAssets: {
    id: 'es.application:personalInfoProviderSubtitleEstateWithoutAssets',
    defaultMessage: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
    description: '',
  },
  personalInfoProviderSubtitleDivisionOfEstateByHeirs: {
    id: 'es.application:personalInfoProviderSubtitleDivisionOfEstateByHeirsProviderSubtitle',
    defaultMessage: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
    description: '',
  },
  personalInfoProviderSubtitleUndividedEstate: {
    id: 'es.application:personalInfoProviderSubtitleUndividedEstate',
    defaultMessage: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
    description: '',
  },
  personalInfoProviderSubtitleOfficialDivision: {
    id: 'es.application:personalInfoProviderSubtitleOfficialDivision',
    defaultMessage: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
    description: '',
  },
  settingsInfoProviderTitle: {
    id: 'es.application:settingsInfoProviderTitle',
    defaultMessage: 'Stillingar frá Ísland.is',
    description: '',
  },
  settingsInfoProviderSubtitle: {
    id: 'es.application:settingsInfoProviderSubtitle',
    defaultMessage: 'Persónustillingar þínar (sími og netfang) frá Ísland.is.',
    description: '',
  },
  settingsInfoProviderSubtitleDivisionOfEstateByHeirs: {
    id: 'es.application:settingsInfoProviderSubtitleDivisionOfEstateByHeirs',
    defaultMessage: 'Persónustillingar þínar (sími og netfang) frá Ísland.is.',
    description: '',
  },
  settingsInfoProviderSubtitleUndividedEstate: {
    id: 'es.application:settingsInfoProviderSubtitleUndividedEstate',
    defaultMessage: 'Persónustillingar þínar (sími og netfang) frá Ísland.is.',
    description: '',
  },
  settingsInfoProviderSubtitleOfficialDivision: {
    id: 'es.application:settingsInfoProviderSubtitleOfficialDivision',
    defaultMessage: 'Persónustillingar þínar (sími og netfang) frá Ísland.is.',
    description: '',
  },
  settingsInfoProviderSubtitleEstateWithoutAssets: {
    id: 'es.application:settingsInfoProviderSubtitleEstateWithoutAssets',
    defaultMessage: 'Persónustillingar þínar (sími og netfang) frá Ísland.is.',
    description: '',
  },

  // The deceased
  theDeceased: {
    id: 'es.application:theDeceased',
    defaultMessage: 'Hinn látni',
    description: '',
  },
  nameOfTheDeceased: {
    id: 'es.application:nameOfTheDeceased',
    defaultMessage: 'Nafn hins látna',
    description: '',
  },
  deathDate: {
    id: 'es.application:deathDate',
    defaultMessage: 'Dánardagur',
    description: '',
  },
  deathDateNotRegistered: {
    id: 'es.application:deathDateNotRegistered',
    defaultMessage: 'Dánardagur ekki skráður',
    description: '',
  },

  // Spouse of the deceased
  isDeceasedWithUndividedEstate: {
    id: 'es.application:isDeceasedWithUndividedEstate',
    defaultMessage: 'Sat hinn látni í óskiptu búi?',
    description: '',
  },
  spouseOfTheDeceased: {
    id: 'es.application:spouseOfTheDeceased',
    defaultMessage: 'Maki hins látna',
    description: '',
  },

  // General
  total: {
    id: 'es.application:total',
    defaultMessage: 'Samtals',
    description: '',
  },

  // Applicant
  announcer: {
    id: 'es.application:announcer',
    defaultMessage: 'Tilkynnandi',
    description: '',
  },
  announcerNoAssets: {
    id: 'es.application:announcerNoAssets',
    defaultMessage: 'Yfirlýsandi eignaleysis',
    description: '',
  },
  announcerPermitToPostpone: {
    id: 'es.application:announcerPermitToPostpone',
    defaultMessage: 'Umsækjandi um leyfi til setu í óskiptu búi',
    description: '',
  },
  announcerPTP: {
    id: 'es.application:announcerPTP',
    defaultMessage: 'Umsækjandi',
    description: '',
  },
  applicantsInfoSubtitle: {
    id: 'es.application:applicantsInfoSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: '',
  },
  name: {
    id: 'es.application:name',
    defaultMessage: 'Nafn',
    description: '',
  },
  nationalId: {
    id: 'es.application:nationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  address: {
    id: 'es.application:address',
    defaultMessage: 'Lögheimili',
    description: '',
  },
  phone: {
    id: 'es.application:phone',
    defaultMessage: 'Símanúmer',
    description: '',
  },
  email: {
    id: 'es.application:email',
    defaultMessage: 'Netfang',
    description: '',
  },
  relationToDeceased: {
    id: 'es.application:relationToDeceased',
    defaultMessage: 'Tengsl við hinn látna',
    description: 'Relation label',
  },
  applicantAutonomous: {
    id: 'es.application:applicantAutonomous',
    defaultMessage: 'Er umsækjandi lögráða',
    description: 'Autonomous label',
  },

  // Estate members, assets, vehicles
  estateMembersTitle: {
    id: 'es.application:estateMembersTitle',
    defaultMessage: 'Erfingjar og erfðaskrá',
    description: '',
  },
  estateMembersDescriptionEstateWithoutAssets: {
    id: 'es.application:estateMembersDescriptionEstateWithoutAssets',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: '',
  },
  estateMembersDescriptionOfficialDivision: {
    id: 'es.application:estateMembersDescriptionOfficialDivision',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: '',
  },
  estateMembersDescriptionUndividedEstate: {
    id: 'es.application:estateMembersDescriptionUndividedEstate',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: '',
  },
  estateMembersDescriptionDivisionOfEstateByHeirs: {
    id: 'es.application:estateMembersDescriptionDivisionOfEstateByHeirs',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: '',
  },
  estateMembers: {
    id: 'es.application:estateMembers',
    defaultMessage: 'Erfingjar',
    description: '',
  },
  estateMember: {
    id: 'es.application:estateMember',
    defaultMessage: 'Erfingi',
    description: '',
  },
  estateMembersHeaderDescription: {
    id: 'es.application:estateMembersHeaderDescription',
    defaultMessage: 'Vantar uppl hér',
    description: '',
  },
  willsInCustody: {
    id: 'es.application:willsInCustody',
    defaultMessage: 'Erfðaskrá í vörslu sýslumanns',
    description: '',
  },
  willsAndAgreements: {
    id: 'es.application:willsAndAgreements',
    defaultMessage: 'Erfðaskrá og kaupmáli',
    description: '',
  },
  willsAndAgreementsDescriptionEstateWithoutAssets: {
    id: 'es.application:willsAndAgreementsDescriptionEstateWithoutAssets',
    defaultMessage:
      'Vinsamlegast tilgreindu um tilvist erfðaskráar eða kaupmála, og skráðu athugasemdir ef einhverjar eru.',
    description: '',
  },
  willsAndAgreementsDescriptionOfficialDivision: {
    id: 'es.application:willsAndAgreementsDescriptionOfficialDivision',
    defaultMessage:
      'Vinsamlegast tilgreindu um tilvist erfðaskráar eða kaupmála, og skráðu athugasemdir ef einhverjar eru.',
    description: '',
  },
  willsAndAgreementsDescriptionDescriptionUndividedEstate: {
    id: 'es.application:willsAndAgreementsDescriptionDescriptionUndividedEstate',
    defaultMessage:
      'Vinsamlegast tilgreindu um tilvist erfðaskráar eða kaupmála, og skráðu athugasemdir ef einhverjar eru.',
    description: '',
  },
  willsAndAgreementsDescriptionDivisionOfEstateByHeirs: {
    id: 'es.application:willsAndAgreementsDescriptionDivisionOfEstateByHeirs',
    defaultMessage:
      'Vinsamlegast tilgreindu um tilvist erfðaskráar eða kaupmála, og skráðu athugasemdir ef einhverjar eru.',
    description: '',
  },
  doesWillExist: {
    id: 'es.application:doesWillExist',
    defaultMessage: 'Er til erfðaskrá?',
    description: '',
  },
  doesAgreementExist: {
    id: 'es.application:doesAgreementExist',
    defaultMessage: 'Er til kaupmáli?',
    description: '',
  },
  doesPermissionToPostponeExist: {
    id: 'es.application:doesPermissionToPostponeExist',
    defaultMessage: 'Er til leyfi til setu í óskiptu búi?',
    description: '',
  },
  agreements: {
    id: 'es.application:agreements',
    defaultMessage: 'Kaupmáli',
    description: '',
  },
  additionalInfo: {
    id: 'es.application:additionalInfo',
    defaultMessage: 'Athugasemdir',
    description: '',
  },
  additionalInfoPlaceholder: {
    id: 'es.application:additionalInfoPlaceholder',
    defaultMessage: 'Skráðu athugasemdir ef einhverjar eru',
    description: '',
  },
  otherWills: {
    id: 'es.application:otherWills',
    defaultMessage: 'Vitneskja um aðra erfðaskrá',
    description: '',
  },
  properties: {
    id: 'es.application:properties',
    defaultMessage: 'Eignir',
    description: '',
  },
  propertiesTitle: {
    id: 'es.application:propertiesTitle',
    defaultMessage: 'Innlendar og erlendar eignir á dánardegi hins látna',
    description: '',
  },
  propertiesDescription: {
    id: 'es.application:propertiesDescription#markdown',
    defaultMessage: 'Tilgreina skal allar hjúskapaeignir beggja hjóna.',
    description: '',
  },
  propertiesDescriptionOfficialDivision: {
    id: 'es.application:propertiesDescriptionOfficialDivision#markdown',
    defaultMessage: 'Tilgreina skal allar hjúskapaeignir beggja hjóna.',
    description: '',
  },
  propertiesDescriptionUndividedEstate: {
    id: 'es.application:propertiesDescriptionUndividedEstate#markdown',
    defaultMessage: 'Tilgreina skal allar hjúskapaeignir beggja hjóna.',
    description: '',
  },
  propertiesDescriptionEstateWithoutAssets: {
    id: 'es.application:propertiesDescriptionEstateWithoutAssets#markdown',
    defaultMessage: 'Tilgreina skal allar hjúskapaeignir beggja hjóna.',
    description: '',
  },
  propertiesDescriptionDivisionOfEstateByHeirs: {
    id: 'es.application:propertiesDescriptionDivisionOfEstateByHeirs#markdown',
    defaultMessage: 'Tilgreina skal allar hjúskapaeignir beggja hjóna.',
    description: '',
  },
  realEstate: {
    id: 'es.application:realEstate',
    defaultMessage: 'Fasteignir',
    description: '',
  },
  realEstateRepeaterHeader: {
    id: 'es.application:realEstateRepeaterHeader',
    defaultMessage: 'Fasteign',
    description: '',
  },
  vehicleRepeaterHeader: {
    id: 'es.application:vehicleRepeaterHeader',
    defaultMessage: 'Farartæki',
    description: '',
  },
  vehicleMarketLabel: {
    id: 'es.application:vehicleMarketLabel',
    defaultMessage: 'Markaðsverð á dánardegi',
    description: '',
  },
  vehicleNameLabel: {
    id: 'es.application:vehicleNameLabel',
    defaultMessage: 'Heiti',
    description: '',
  },
  realEstateDescription: {
    id: 'es.application:realEstateDescription',
    defaultMessage: 'Til dæmis íbúðarhús, sumarhús, lóðir og jarðir',
    description: '',
  },
  inventoryTitle: {
    id: 'es.application:inventoryTitle',
    defaultMessage: 'Innbú',
    description: '',
  },
  inventoryDescription: {
    id: 'es.application:inventoryDescription',
    defaultMessage: 'Til dæmis bækur og málverk',
    description: '',
  },
  inventoryTextField: {
    id: 'es.application:inventoryTextField',
    defaultMessage: 'Upplýsingar um innbú',
    description: '',
  },
  inventoryValueTitle: {
    id: 'es.application:inventoryValueTitle',
    defaultMessage: 'Matsverð samtals',
    description: '',
  },
  inventoryTextFieldPlaceholder: {
    id: 'es.application:inventoryTextFieldPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar um innbú hér',
    description: '',
  },
  vehicles: {
    id: 'es.application:vehicles',
    defaultMessage: 'Farartæki',
    description: '',
  },
  vehiclesDescription: {
    id: 'es.application:vehiclesDescription',
    defaultMessage: 'Til dæmis ökutæki, flugvélar og skip.',
    description: '',
  },
  guns: {
    id: 'es.application:guns',
    defaultMessage: 'Skotvopn',
    description: '',
  },
  gunsDescription: {
    id: 'es.application:gunsDescription',
    defaultMessage: 'Til dæmis haglabyssa, riffill og skammbyssa',
    description: '',
  },

  // Bank Info
  estateBankInfo: {
    id: 'es.application:estateBankInfo',
    defaultMessage: 'Innstæður í bönkum og sparisjóðum',
    description: '',
  },
  estateBankInfoDescription: {
    id: 'es.application:estateBankInfoDescription',
    defaultMessage:
      'Innstæður í bæði innlendum og erlendum bönkum og sparisjóðum',
    description: '',
  },
  bankAccount: {
    id: 'es.application:bankAccount',
    defaultMessage: 'Bankareikningur',
    description: '',
  },
  bankAccountBalance: {
    id: 'es.application:bankAccountBalance',
    defaultMessage: 'Innistæða með vöxtum á dánardegi',
    description: '',
  },
  bankAccountPlaceholder: {
    id: 'es.application:bankAccountPlaceholder',
    defaultMessage: 'xxxx - xx - xxxxxx',
    description: '',
  },
  bankAccountRepeaterButton: {
    id: 'es.application:bankAccountRepeaterButton',
    defaultMessage: 'Bæta við bankareikning',
    description: '',
  },

  // Claims
  claimsTitle: {
    id: 'es.application:claimsTitle',
    defaultMessage: 'Verðbréf og kröfur',
    description: '',
  },
  claimsDescription: {
    id: 'es.application:claimsDescription',
    defaultMessage: 'Útgefandi og fjárhæð með vöxtum',
    description: '',
  },
  claimsPublisher: {
    id: 'es.application:claimsPublisher',
    defaultMessage: 'Útgefandi',
    description: '',
  },
  claimsAmount: {
    id: 'es.application:claimsAmount',
    defaultMessage: 'Fjárhæð með vöxtum á dánardegi',
    description: '',
  },
  claimsRepeaterButton: {
    id: 'es.application:claimsRepeaterButton',
    defaultMessage: 'Bæta við verðbréfum',
    description: '',
  },

  // Stocks
  stocksTitle: {
    id: 'es.application:stocksTitle',
    defaultMessage: 'Hlutabréf',
    description: '',
  },
  stocksDescription: {
    id: 'es.application:stocksDescription',
    defaultMessage: 'Nafn og kennitala ef um einstakling er að ræða.',
    description: '',
  },
  stocksOrganization: {
    id: 'es.application:stocksOrganization',
    defaultMessage: 'Útgefandi',
    description: '',
  },
  stocksNationalId: {
    id: 'es.application:stocksNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  stocksFaceValue: {
    id: 'es.application:stocksFaceValue',
    defaultMessage: 'Nafnverð',
    description: '',
  },
  stocksRateOfChange: {
    id: 'es.application:stocksRateOfChange',
    defaultMessage: 'Gengi',
    description: '',
  },
  stocksValue: {
    id: 'es.application:stocksValue',
    defaultMessage: 'Verðmæti á dánardegi',
    description: '',
  },
  stocksRepeaterButton: {
    id: 'es.application:stocksRepeaterButton',
    defaultMessage: 'Bæta við hlutabréfum',
    description: '',
  },

  // Money & deposit
  moneyAndDepositTitle: {
    id: 'es.application:moneyAndDepositTitle',
    defaultMessage: 'Peningar og bankahólf',
    description: '',
  },
  moneyAndDepositDescription: {
    id: 'es.application:moneyAndDepositDescription#markdown',
    defaultMessage: 'Nafn og kennitala ef um einstakling er að ræða',
    description: '',
  },
  moneyAndDepositText: {
    id: 'es.application:moneyAndDepositText',
    defaultMessage: 'Upplýsingar um peninga eða bankahólf',
    description: '',
  },
  moneyAndDepositPlaceholder: {
    id: 'es.application:moneyAndDepositPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar hér',
    description: '',
  },
  moneyAndDepositValue: {
    id: 'es.application:moneyAndDepositValue',
    defaultMessage: 'Fjárhæð á dánardegi',
    description: '',
  },

  // Other assets
  otherAssetRepeaterButton: {
    id: 'es.application:otherAssetRepeaterButton',
    defaultMessage: 'Bæta við eign',
    description: '',
  },
  otherAssetsTitle: {
    id: 'es.application:otherAssetsTitle',
    defaultMessage: 'Aðrar eignir',
    description: '',
  },
  otherAssetsDescription: {
    id: 'es.application:otherAssetsDescription',
    defaultMessage: 'Til dæmis hugverkaréttindi, búseturéttur o.fl.',
    description: '',
  },
  otherAssetsText: {
    id: 'es.application:otherAssetsText',
    defaultMessage: 'Upplýsingar um aðrar eignir',
    description: '',
  },
  otherAssetsPlaceholder: {
    id: 'es.application:otherAssetsPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar hér',
    description: '',
  },
  otherAssetsValue: {
    id: 'es.application:otherAssetsValue',
    defaultMessage: 'Fjárhæð á dánardegi',
    description: '',
  },
  acceptAssets: {
    id: 'es.application:acceptExistenceAssets#markdown',
    defaultMessage:
      'Ég lýsi því yfir, að eftir minni bestu vitund nema eignir búsins ekki meira en kostnaði af útför. Gegn því að fá eignirnar framseldar mér, mun ég kosta útför hins látna.',
    description: '',
  },
  acceptNoAssets: {
    id: 'es.application:acceptNoAssets#markdown',
    defaultMessage:
      'Ég lýsi því yfir að eftir minni bestu vitund eru engar eignir í búinu.',
    description: '',
  },
  acceptNoAssetsNoDebts: {
    id: 'es.application:acceptNoAssetsNoDebts#markdown',
    defaultMessage:
      'Ég lýsi því yfir að eftir minni bestu vitund eru engar eignir í búinu.',
    description: '',
  },
  acceptCorrectAssets: {
    id: 'es.application:acceptCorrectAssets#markdown',
    defaultMessage:
      'Ég staðfesti hér með að eftir minni bestu vitund eru upplýsingarnar um eignir réttar.',
    description: '',
  },

  // Debts
  debtsTitle: {
    id: 'es.application:debtsTitle',
    defaultMessage: 'Skuldir',
    description: '',
  },
  debtsDescription: {
    id: 'es.application:debtsDescription',
    defaultMessage: 'Innlendar og erlendar skuldir',
    description: '',
  },
  debtsDescriptionOfficialDivision: {
    id: 'es.application:debtsDescriptionOfficialDivision',
    defaultMessage: 'Innlendar og erlendar skuldir',
    description: '',
  },
  debtsDescriptionEstateWithoutAssets: {
    id: 'es.application:debtsDescriptionEstateWithoutAssets',
    defaultMessage: 'Innlendar og erlendar skuldir',
    description: '',
  },
  debtsDescriptionDivisionOfEstateByHeirs: {
    id: 'es.application:debtsDescriptionDivisionOfEstateByHeirs',
    defaultMessage: 'Innlendar og erlendar skuldir',
    description: '',
  },
  debtsDescriptionUndividedEstate: {
    id: 'es.application:debtsDescriptionUndividedEstate',
    defaultMessage: 'Innlendar og erlendar skuldir',
    description: '',
  },
  debtsCreditorHeader: {
    id: 'es.application:debtsCreditorHeader',
    defaultMessage: 'Kröfuhafi',
    description: '',
  },
  debtsCreditorName: {
    id: 'es.application:debtsCreditorName',
    defaultMessage: 'Nafn kröfuhafa',
    description: '',
  },
  debtsNationalId: {
    id: 'es.application:debtsNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  debtsBalance: {
    id: 'es.application:debtsBalance',
    defaultMessage: 'Eftirstöðvar á dánardegi',
    description: '',
  },
  debtsLoanIdentity: {
    id: 'es.application:debtsLoanIdentity',
    defaultMessage: 'Auðkenni / Lánsnúmer',
    description: '',
  },
  debtsRepeaterButton: {
    id: 'es.application:debtsRepeaterButton',
    defaultMessage: 'Bæta við skuldum',
    description: '',
  },
  // Representative
  representativeTitle: {
    id: 'es.application:representativeTitle',
    defaultMessage: 'Umboðsmenn',
    description: '',
  },
  representativeDescription: {
    id: 'es.application:representativeDescription',
    defaultMessage: 'Vanalega er valinn umboðsmaður...',
    description: '',
  },

  // Attachments
  attachmentsTitle: {
    id: 'es.application:attachmentsTitle',
    defaultMessage: 'Skjöl með umsókn',
    description: '',
  },
  attachmentsDescription: {
    id: 'es.application:attachmentsDescription#markdown',
    defaultMessage: 'Með umsókn skulu fylgja eftirfarandi skjöl:',
    description: '',
  },
  attachmentsButton: {
    id: 'es.application:attachmentsButton',
    defaultMessage: 'Velja skjöl',
    description: '',
  },
  uploadHeader: {
    id: 'es.application:uploadHeader',
    defaultMessage: 'Dragðu skjöl hingað til að hlaða upp',
    description: '',
  },
  uploadDescription: {
    id: 'es.application:uploadDescription',
    defaultMessage:
      'Tekið er við skjölum með endingunum: .pdf, .doc, .docx, .rtf',
    description: '',
  },

  // No assets
  doAssetsExist: {
    id: 'es.application:doAssetsExist',
    defaultMessage: 'Eru eignir til staðar?',
    description: '',
  },
  doAssetsExistSidebarTitle: {
    id: 'es.application:doAssetsExistSidebarTitle',
    defaultMessage: 'Átti látni eignir á dánardegi?',
    description: '',
  },
  doAssetsExistSelect: {
    id: 'es.application:doAssetsExistSelect',
    defaultMessage: 'Eru eignir til staðar?',
    description: '',
  },
  doDebtsExist: {
    id: 'es.application:doDebtsExist',
    defaultMessage: 'Eru skuldir til staðar?',
    description: '',
  },

  // Overview
  overviewTitle: {
    id: 'es.application:overviewTitle',
    defaultMessage: 'Yfirlit',
    description: '',
  },
  overviewSubtitleWithoutAssets: {
    id: 'es.application:overviewSubtitleWithoutAssets',
    defaultMessage: 'Þú hefur lýst yfir eignaleysi dánarbús.',
    description: '',
  },
  overviewSubtitleDivisionOfEstate: {
    id: 'es.application:overviewSubtitleDivisionOfEstate#markdown',
    defaultMessage:
      'Þú hefur valið að lýsa því yfir að þú óskir eftir að ofangreint dánarbú verði tekið til opinberra skipta. Nánari upplýsingar um skilyrði opinberra skipta má finna á eftirfarandi vefslóð á Ísland.is',
    description: '',
  },
  divisionOfEstateTerms: {
    id: 'es.application:divisionOfEstateTerms',
    defaultMessage: 'Skilmálar',
    description: '',
  },
  divisionOfEstateTermsText: {
    id: 'es.application:divisionOfEstateTermsText#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið beiðni þína um einkaskipti. Hún verður nú tekin til afgreiðslu og upplýsingar um afgreiðslu beiðninnar sendar í pósthólf þitt á Ísland.is.',
    description: '',
  },
  divisionOfEstateSubmissionCheckbox: {
    id: 'es.application:divisionOfEstateByHeirsSubmissionCheckbox',
    defaultMessage: 'Ég hef lesið skilmálana',
    description: '',
  },
  divisionOfEstateConfirmActionCheckbox: {
    id: 'es.application:divisionOfEstateConfirmActionCheckbox',
    defaultMessage:
      'Ég krefst þess að eftirfarandi dánarbú verði tekið til opinberra skipta.',
    description: '',
  },
  overviewSubtitlePermitToPostpone: {
    id: 'es.application:overviewSubtitlePermitToPostpone#markdown',
    defaultMessage:
      'Þú hefur nú útfyllt beiðni um leyfi til setu í óskiptu búi.',
    description: '',
  },
  overviewSubtitleDivisionOfEstateByHeirs: {
    id: 'es.application:overviewSubtitleDivisionOfEstateByHeirs#markdown',
    defaultMessage: 'Þú hefur nú útfyllt beiðni um einkaskipti.',
    description: '',
  },
  overviewMarketValue: {
    id: 'es.application:overviewMarketValue',
    defaultMessage: 'Markaðsvirði',
    description: '',
  },
  divisionOfEstateByHeirsTerms: {
    id: 'es.application:divisionOfEstateByHeirsTerms',
    defaultMessage: 'Skilmálar',
    description: '',
  },
  divisionOfEstateByHeirsText: {
    id: 'es.application:divisionOfEstateByHeirsText#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið beiðni þína um einkaskipti. Hún verður nú tekin til afgreiðslu og upplýsingar um afgreiðslu beiðninnar send í pósthólf þitt á Ísland.is.',
    description: '',
  },
  divisionOfEstateByHeirsSubmissionCheckbox: {
    id: 'es.application:divisionOfEstateByHeirsSubmissionCheckbox#markdown',
    defaultMessage: 'Ég hef lesið skilmálana',
    description: '',
  },
  notFilledOut: {
    id: 'es.application:notFilledOut#markdown',
    defaultMessage: 'Ekki fyllt út',
    description: '',
  },
  notFilledOutItalic: {
    id: 'es.application:notFilledOutItalic#markdown',
    defaultMessage: '*Ekki fyllt út*',
    description: '',
  },

  // Submit
  submitApplication: {
    id: 'es.application:submitApplication',
    defaultMessage: 'Senda inn beiðni',
    description: '',
  },

  // Done
  doneTitle: {
    id: 'es.application:doneTitle',
    defaultMessage: 'Beiðni móttekin',
    description: '',
  },
  divisionOfEstateDoneSubtitle: {
    id: 'es.application:divisionOfEstateDoneSubtitle#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið yfirlýsingu þína um að þú óskir eftir að dánarbúið verði tekið til opinberra skipta. Yfirlýsingin verður nú tekin til meðferðar hjá sýslumanni. Reynist skilyrði til þess að senda dánarbúið í opinber skipti verður það gert í framhaldinu. Þér mun berast tilkynning um slíkt inn á pósthólf þitt á Ísland.is.',
    description: '',
  },
  estateWithoutAssetsSubtitle: {
    id: 'es.application:estateWithoutAssetsSubtitle#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið yfirlýsingu þína um eignaleysi dánarbús. Hún verður yfirfarin af sýslumanni og afgreiðsla sýslumanns í kjölfarið send í pósthólf þitt á Ísland.is.',
    description: '',
  },
  permitToPostponeEstateDivisionSubtitle: {
    id: 'es.application:permitToPostponeEstateDivisionSubtitle#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið beiðni þína um leyfi til setu í óskiptu búi. Hún verður nú tekin til afgreiðslu og upplýsingar um afgreiðslu beiðninnar send í pósthólf þitt á Ísland.is.',
    description: '',
  },
  divisionOfEstateByHeirsSubtitle: {
    id: 'es.application:divisionOfEstateByHeirsSubtitle#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið beiðni þína um einkaskipti. Hún verður nú tekin til afgreiðslu og upplýsingar um afgreiðslu beiðninnar send í pósthólf þitt á Ísland.is.',
    description: '',
  },
  openServicePortalTitle: {
    id: 'es.application:openServicePortalTitle',
    defaultMessage: 'Mínar síður',
    description: '',
  },
  openServicePortalMessage: {
    id: 'es.application:openServicePortalMessage',
    defaultMessage:
      'Inni á Mínum síðum og í Ísland.is appinu hefur þú aðgang að þínum upplýsingum, Stafrænu pósthólfi og stöðu umsóknar.',
    description: '',
  },

  // Validation errors
  errorPhoneNumber: {
    id: 'es.application:error.errorPhoneNumber',
    defaultMessage: 'Símanúmer virðist ekki vera rétt',
    description: 'Phone number is invalid',
  },
  errorEmail: {
    id: 'es.application:error.errorEmail',
    defaultMessage: 'Netfang virðist ekki vera rétt',
    description: 'Email is invalid',
  },
  errorRelation: {
    id: 'es.application:error.errorRelation',
    defaultMessage: 'Tengsl virðast ekki vera rétt',
    description: 'Relation is invalid',
  },
  fillOutRates: {
    id: 'es.application:error.fillOutRates',
    defaultMessage: 'Vinsamlegast fylltu út í alla reiti',
    description: '',
  },
  errorNationalIdIncorrect: {
    id: 'es.application:error.nationalIdIncorrect',
    defaultMessage: 'Þessi kennitala virðist ekki vera rétt',
    description: 'National id is invalid',
  },
  errorNotAutonmous: {
    id: 'es.application:error.errorNotAutonmous',
    defaultMessage:
      'Umsækjandi er ekki lögráða og því ekki hægt að halda áfram með umsókn. Vinsamlegast hafið samband við næsta sýslumannsembætti til að fá frekari upplýsingar.',
    description: 'Applicant not autonomous',
  },
  errorPropertyNumber: {
    id: 'es.application:error.errorPropertyNumber',
    defaultMessage: 'Verður að innihalda L og 6 tölustafi eða F og 7 tölustafi',
    description: 'Property number is invalid',
  },

  // Inheritance step
  inheritanceAddMember: {
    id: 'es.application:inheritanceAddMember',
    defaultMessage: 'Bæta við erfingja',
    description: 'Inheritance step add member of estate',
  },
  inheritanceDisableMember: {
    id: 'es.application:inheritanceDisableMember',
    defaultMessage: 'Afvirkja',
    description: 'Inheritance step disable member of estate',
  },
  inheritanceEnableMember: {
    id: 'es.application:inheritanceEnableMember',
    defaultMessage: 'Virkja',
    description: 'Inheritance step enable member of estate',
  },
  inheritanceDeleteMember: {
    id: 'es.application:inheritanceDeleteMember',
    defaultMessage: 'Eyða',
    description: 'Inheritance step delete member of estate',
  },
  inheritanceKtLabel: {
    id: 'es.application:inheritanceKtLabel',
    defaultMessage: 'Kennitala',
    description: 'National id label',
  },
  inheritanceRelationLabel: {
    id: 'es.application:inheritanceRelationLabel',
    defaultMessage: 'Tengsl',
    description: 'Relation label',
  },
  inheritanceRelationWithApplicantLabel: {
    id: 'es.application:inheritanceRelationWithApplicantLabel',
    defaultMessage: 'Tengsl við umsækjanda',
    description: 'Relation label',
  },
  inheritanceRelationPlaceholder: {
    id: 'es.application:inheritanceRelationPlaceholder',
    defaultMessage: 'Veldu tengsl',
    description: 'Relation placeholder',
  },
  inheritanceNameLabel: {
    id: 'es.application:inheritanceNameLabel',
    defaultMessage: 'Nafn',
    description: 'Name label',
  },
  inheritanceForeignCitizenshipLabel: {
    id: 'es.application:inheritanceForeignCitizenshipLabel',
    defaultMessage: 'Aðili án íslenskrar kennitölu',
    description: '',
  },
  inheritanceDayOfBirthLabel: {
    id: 'es.application:inheritanceDayOfBirthLabel',
    defaultMessage: 'Fæðingardagur',
    description: 'Day of birth label',
  },
  inheritanceAdvocateLabel: {
    id: 'es.application:inheritanceAdvocateLabel',
    defaultMessage: 'Forsjáraðili/málsvari/sérstakur lögráðamaður',
    description: 'Custody label',
  },
  inheritanceUnder18Error: {
    id: 'es.application:inheritanceUnder18Error',
    defaultMessage:
      'Eftirfarandi erfingi er undir lögaldri og því er ekki hægt að halda áfram með umsókn. Vinsamlegast hafið samband við næsta sýslumannsembætti til að fá frekari upplýsingar.',
    description: '',
  },
  inheritanceUnder18ErrorAdvocate: {
    id: 'es.application:inheritanceUnder18ErrorAdvocate',
    defaultMessage:
      'Eftirfarandi málssvari er undir lögaldri og því ekki hægt að halda áfram með umsókn. Vinsamlegast hafið samband við næsta sýslumannsembætti til að fá frekari upplýsingar.',
    description: '',
  },
  inheritanceAgeValidation: {
    id: 'es.application:inheritanceAgeValidation',
    defaultMessage:
      'Ekki er hægt að halda áfram með umsókn þar sem erfingi undir lögaldri er skráður',
    description: '',
  },
  heirAdvocateAgeValidation: {
    id: 'es.application:heirAdvocateAgeValidation',
    defaultMessage:
      'Ekki er hægt að halda áfram með umsókn þar sem aðili undir 18 er skráður án málssvara yfir lögaldri',
    description: '',
  },
  missingHeirUndividedEstateValidation: {
    id: 'es.application:missingHeirUndividedEstateValidation',
    defaultMessage:
      'Ekki er hægt að halda áfram með umsókn þar sem engin erfingi er skráður',
    description: '',
  },
  missingSpouseUndividedEstateValidation: {
    id: 'es.application:missingSpouseUndividedEstateValidation',
    defaultMessage:
      'Ekki er hægt að halda áfram með umsókn þar sem skrá þarf maka í listann af erfingjum',
    description: '',
  },

  // Properties
  realEstatesDescription: {
    id: 'es.application:realEstatesDescription',
    defaultMessage: 'Til dæmis íbúðarhús, sumarhús, lóðir og jarðir.',
    description: 'Real estates and lands description',
  },
  gunTitle: {
    id: 'es.application:gunTitle',
    defaultMessage: 'Skotvopn',
    description: 'Vehicles title',
  },
  vehiclesTitle: {
    id: 'es.application:vehiclesTitle',
    defaultMessage: 'Faratæki',
    description: 'Vehicles title',
  },
  vehiclesPlaceholder: {
    id: 'es.application:vehiclesPlaceholder',
    defaultMessage: 't.d. Toyota Yaris',
    description: 'Placeholder for vehicles type',
  },
  otherPropertiesTitle: {
    id: 'es.application:otherPropertiesTitle',
    defaultMessage: 'Aðrar eignir',
    description: 'Other properties title',
  },
  otherPropertiesDescription: {
    id: 'es.application:otherPropertiesDescription',
    defaultMessage: 'Merktu við það sem á við eftir bestu vitund.',
    description: 'Other properties description',
  },
  otherPropertiesAccounts: {
    id: 'es.application:otherPropertiesAccounts',
    defaultMessage: 'Bankareikningar, verðbréf eða hlutabréf',
    description: 'Other properties option: Accounts',
  },
  otherPropertiesOwnBusiness: {
    id: 'es.application:otherPropertiesOwnBusiness',
    defaultMessage: 'Eigin rekstur',
    description: 'Other properties option: Own business',
  },
  otherPropertiesResidence: {
    id: 'es.application:otherPropertiesResidence',
    defaultMessage: 'Búseturéttur vegna kaupleigu íbúða',
    description: 'Other properties option: Residence',
  },
  otherPropertiesAssetsAbroad: {
    id: 'es.application:otherPropertiesAssetsAbroad',
    defaultMessage: 'Eignir erlendis',
    description: 'Other properties option: Assets abroad',
  },
  propertyNumber: {
    id: 'es.application:propertyNumber',
    defaultMessage: 'Fastanúmer',
    description: 'Property number label',
  },
  propertyShare: {
    id: 'es.application:propertyShare',
    defaultMessage: 'Eignarhluti',
    description: 'Property share label',
  },
  addProperty: {
    id: 'es.application:addProperty',
    defaultMessage: 'Bæta við fasteign',
    description: 'Add property',
  },
  addVehicle: {
    id: 'es.application:addVehicle',
    defaultMessage: 'Bæta við ökutæki',
    description: 'Add vehicle',
  },
  vehicleNumberLabel: {
    id: 'es.application:vehicleNumberLabel',
    defaultMessage: 'Skráninganúmer ökutækis',
    description: 'Vehicle number label',
  },
  vehicleTypeLabel: {
    id: 'es.application:vehicleTypeLabel',
    defaultMessage: 'Tegund faratækis',
    description: 'Vehicle type label',
  },
  addGun: {
    id: 'es.application:addGun',
    defaultMessage: 'Bæta við skotvopni',
    description: '',
  },
  gunNumberLabel: {
    id: 'es.application:gunNumberLabel',
    defaultMessage: 'Raðnúmer skotvopns',
    description: 'Gun number label',
  },
  gunTypeLabel: {
    id: 'es.application:gunTypeLabel',
    defaultMessage: 'Tegund skotvopns',
    description: 'Gun type label',
  },
  marketValueTitle: {
    id: 'es.application:marketValueTitle',
    defaultMessage: 'Markaðsvirði á dánardegi',
    description: '',
  },
  realEstateValueTitle: {
    id: 'es.application:realEstateValueTitle',
    defaultMessage: 'Fasteignamat á dánardegi',
    description: '',
  },
})
