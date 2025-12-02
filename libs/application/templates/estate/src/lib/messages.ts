import { defineMessages } from 'react-intl'

export const m = defineMessages({
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
  estateTypeOfficialDivision: {
    id: 'es.application:selectedEstateOfficialDivision',
    defaultMessage: 'Opinber skipti',
  },
  estateTypeWithoutAssets: {
    id: 'es.application:estateTypeWithoutAssets',
    defaultMessage: 'Eignalaust dánarbú',
  },
  estateTypeUndividedEstate: {
    id: 'es.application:estateTypeUndividedEstate',
    defaultMessage: 'Seta í óskiptu búi',
  },
  estateTypeDivisionByHeirs: {
    id: 'es.application:estateTypeDivisionByHeirs',
    defaultMessage: 'Einkaskipti',
  },

  // Data collection - external data providers
  dataCollectionTitle: {
    id: 'es.application:dataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: '',
  },
  dataCollectionSubtitle: {
    id: 'es.application:dataCollectionSubtitle#markdown',
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
  activate: {
    id: 'es.application:activate',
    defaultMessage: 'Virkja',
    description: '',
  },
  disable: {
    id: 'es.application:disable',
    defaultMessage: 'Afvirkja',
    description: '',
  },
  delete: {
    id: 'es.application:delete',
    defaultMessage: 'Fjarlægja',
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
    id: 'es.application:applicantsInfoSubtitle#markdown',
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
    id: 'es.application:estateMembersDescriptionEstateWithoutAssets#markdown',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: '',
  },
  estateMembersDescriptionOfficialDivision: {
    id: 'es.application:estateMembersDescriptionOfficialDivision#markdown',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: '',
  },
  estateMembersDescriptionUndividedEstate: {
    id: 'es.application:estateMembersDescriptionUndividedEstate#markdown',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: '',
  },
  estateMembersDescriptionDivisionOfEstateByHeirs: {
    id: 'es.application:estateMembersDescriptionDivisionOfEstateByHeirs#markdown',
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
  willsAndAgreements: {
    id: 'es.application:willsAndAgreements',
    defaultMessage: 'Erfðaskrá og kaupmáli',
    description: '',
  },
  willsAndAgreementsDescriptionEstateWithoutAssets: {
    id: 'es.application:willsAndAgreementsDescriptionEstateWithoutAssets#markdown',
    defaultMessage:
      'Vinsamlegast tilgreindu um tilvist erfðaskráar eða kaupmála, og skráðu athugasemdir ef einhverjar eru.',
    description: '',
  },
  willsAndAgreementsDescriptionOfficialDivision: {
    id: 'es.application:willsAndAgreementsDescriptionOfficialDivision#markdown',
    defaultMessage:
      'Vinsamlegast tilgreindu um tilvist erfðaskráar eða kaupmála, og skráðu athugasemdir ef einhverjar eru.',
    description: '',
  },
  willsAndAgreementsDescriptionDescriptionUndividedEstate: {
    id: 'es.application:willsAndAgreementsDescriptionDescriptionUndividedEstate#markdown',
    defaultMessage:
      'Vinsamlegast tilgreindu um tilvist erfðaskráar eða kaupmála, og skráðu athugasemdir ef einhverjar eru.',
    description: '',
  },
  willsAndAgreementsDescriptionDivisionOfEstateByHeirs: {
    id: 'es.application:willsAndAgreementsDescriptionDivisionOfEstateByHeirs#markdown',
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
  reminderInfoTitle: {
    id: 'es.application:reminderInfoTitle',
    defaultMessage: 'Áminningar',
    description: '',
  },
  reminderInfoDescription: {
    id: 'es.application:reminderInfoDescription#markdown',
    defaultMessage:
      'Hér á eftir eru tvær staðhæfingar sem mikilvægt er að þú hafir í huga áður en þú heldur áfram með umsóknina. Þú þarft að samþykkja báðar staðhæfingarnar til að geta haldið áfram með umsóknina.',
    description: '',
  },
  reminderInfoAssetsAndDebts: {
    id: 'es.application:reminderInfoAssetsAndDebts',
    defaultMessage: 'Áminning fyrir eignir og skuldir',
    description: '',
  },
  reminderInfoAssetsAndDebtsDescription: {
    id: 'es.application:reminderInfoAssetsAndDebtsDescription#markdown',
    defaultMessage:
      'Athugaðu að þú hafir skráð allar eignir og skuldir lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    description: '',
  },
  reminderInfoAssetsAndDebtsCheckbox: {
    id: 'es.application:reminderInfoAssetsAndDebtsCheckbox',
    defaultMessage:
      'Já, ég skil að ég þurfi að skrá inn allar eignir og skuldir eftirlifandi maka',
    description: '',
  },
  reminderInfoAttachments: {
    id: 'es.application:reminderInfoAttachments',
    defaultMessage: 'Áminning fyrir skjöl sem þurfa að fylgja',
    description: '',
  },
  reminderInfoAttachmentsDescription: {
    id: 'es.application:reminderInfoAttachmentsDescription#markdown',
    defaultMessage:
      'Athugaðu að þú ert með öll gögn sem þarf að láta fylgja með, lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    description: '',
  },
  reminderInfoAttachmentsCheckbox: {
    id: 'es.application:reminderInfoAttachmentsCheckbox',
    defaultMessage:
      'Já, ég skil að ég þurfi að láta fylgja með öll nauðsynleg skjöl',
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
    id: 'es.application:realEstateDescription#markdown',
    defaultMessage: 'Til dæmis íbúðarhús, sumarhús, lóðir og jarðir',
    description: '',
  },
  inventoryTitle: {
    id: 'es.application:inventoryTitle',
    defaultMessage: 'Innbú',
    description: '',
  },
  inventoryDescription: {
    id: 'es.application:inventoryDescription#markdown',
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
    id: 'es.application:vehiclesDescription#markdown',
    defaultMessage: 'Til dæmis ökutæki, flugvélar og skip.',
    description: '',
  },
  guns: {
    id: 'es.application:guns',
    defaultMessage: 'Skotvopn',
    description: '',
  },
  gunsDescription: {
    id: 'es.application:gunsDescription#markdown',
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
    id: 'es.application:estateBankInfoDescription#markdown',
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
  bankAccountInterestRate: {
    id: 'es.application:bankAccountInterestRate',
    defaultMessage: 'Áfallnir vextir',
    description: '',
  },
  bankAccountRepeaterButton: {
    id: 'es.application:bankAccountRepeaterButton',
    defaultMessage: 'Bæta við bankareikning',
    description: '',
  },
  bankAccountForeign: {
    id: 'es.application:bankAccountForeign',
    defaultMessage: 'Erlendur bankareikningur',
    description: '',
  },

  // Claims
  claimsTitle: {
    id: 'es.application:claimsTitle',
    defaultMessage: 'Verðbréf og kröfur',
    description: '',
  },
  claimsDescription: {
    id: 'es.application:claimsDescription#markdown',
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
    id: 'es.application:stocksDescription#markdown',
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
    id: 'es.application:otherAssetsDescription#markdown',
    defaultMessage: 'Til dæmis hugverkaréttindi, búseturéttur o.fl.',
    description: '',
  },
  otherAssetsText: {
    id: 'es.application:otherAssetsText',
    defaultMessage: 'Upplýsingar um aðrar eignir',
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
    id: 'es.application:debtsDescription#markdown',
    defaultMessage: 'Innlendar og erlendar skuldir',
    description: '',
  },
  debtsDescriptionOfficialDivision: {
    id: 'es.application:debtsDescriptionOfficialDivision#markdown',
    defaultMessage: 'Innlendar og erlendar skuldir',
    description: '',
  },
  debtsDescriptionEstateWithoutAssets: {
    id: 'es.application:debtsDescriptionEstateWithoutAssets#markdown',
    defaultMessage: 'Innlendar og erlendar skuldir',
    description: '',
  },
  debtsDescriptionDivisionOfEstateByHeirs: {
    id: 'es.application:debtsDescriptionDivisionOfEstateByHeirs#markdown',
    defaultMessage: 'Innlendar og erlendar skuldir',
    description: '',
  },
  debtsDescriptionUndividedEstate: {
    id: 'es.application:debtsDescriptionUndividedEstate#markdown',
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
    id: 'es.application:representativeDescription#markdown',
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
  attachmentsDescriptionUndividedEstate: {
    id: 'es.application:attachmentsDescriptionUndividedEstate#markdown',
    defaultMessage: 'Með umsókn skulu fylgja eftirfarandi skjöl:',
    description: '',
  },
  attachmentsDescriptionEstateWithoutAssets: {
    id: 'es.application:attachmentsDescriptionEstateWithoutAssets#markdown',
    defaultMessage: 'Með umsókn skulu fylgja eftirfarandi skjöl:',
    description: '',
  },
  attachmentsDescriptionDivisionOfEstateByHeirs: {
    id: 'es.application:attachmentsDescriptionDivisionOfEstateByHeirs#markdown',
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
  additionalCommentsTitle: {
    id: 'es.application:additionalCommentsTitle',
    defaultMessage: 'Athugasemdir',
    description: '',
  },
  additionalCommentsDescription: {
    id: 'es.application:additionalCommentsDescription',
    defaultMessage:
      'Hér er hægt að skrá viðbótarupplýsingar um dánarbúið, umsóknina eða önnur atriði sem gætu verið gagnleg fyrir sýslumanninn við afgreiðslu málsins.',
    description: '',
  },
  additionalCommentsPlaceholder: {
    id: 'es.application:additionalCommentsPlaceholder',
    defaultMessage:
      'T.d. upplýsingar um sérstök skilyrði, samkomulag erfingja eða aðrar skýringar',
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
    id: 'es.application:overviewSubtitleWithoutAssets#markdown',
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
    id: 'es.application:divisionOfEstateConfirmActionCheckbox#markdown',
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
  privateDivisionDoneTitle: {
    id: 'es.application:privateDivisionDoneTitle',
    defaultMessage: 'Beiðni um einkaskipti móttekin',
    description: '',
  },
  undividedEstateDoneTitle: {
    id: 'es.application:undividedEstateDoneTitle',
    defaultMessage: 'Beiðni um leyfi til setu í óskiptu búi móttekin',
    description: '',
  },
  estateWithoutAssetsDoneTitle: {
    id: 'es.application:estateWithoutAssetsDoneTitle',
    defaultMessage: 'Yfirlýsing um eignaleysi dánarbús móttekin',
    description: '',
  },
  officialDivisionDoneTitle: {
    id: 'es.application:officialDivisionDoneTitle',
    defaultMessage: 'Yfirlýsing um opinber skipti móttekin',
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
  multipleSpousesValidation: {
    id: 'es.application:multipleSpousesValidation',
    defaultMessage:
      'Ekki er hægt að halda áfram með umsókn þar sem aðeins einn maki getur verið skráður í listann af erfingjum',
    description: '',
  },

  // Properties
  gunTitle: {
    id: 'es.application:gunTitle',
    defaultMessage: 'Skotvopn',
    description: 'Vehicles title',
  },
  propertyNumber: {
    id: 'es.application:propertyNumber',
    defaultMessage: 'Fastanúmer',
    description: 'Property number label',
  },
  propertyNumberVehicle: {
    id: 'es.application:propertyNumberVehicle',
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

  // Debt repeater messages

  // Debt type messages
  debtsCreditorType: {
    id: 'es.application:debtsCreditorType',
    defaultMessage: 'Tegund skuldar',
    description: 'Debt type label',
  },
  debtsTypeDuties: {
    id: 'es.application:debtsTypeDuties',
    defaultMessage: 'Opinber gjöld',
    description: 'Duties debt type',
  },
  debtsTypeOther: {
    id: 'es.application:debtsTypeOther',
    defaultMessage: 'Aðrar skuldir',
    description: 'Other debts type',
  },
  debtsTypePropertyFees: {
    id: 'es.application:debtsTypePropertyFees',
    defaultMessage: 'Fasteignagjöld',
    description: 'Property fees debt type',
  },
  debtsTypeInsurance: {
    id: 'es.application:debtsTypeInsurance',
    defaultMessage: 'Tryggingastofnun',
    description: 'Insurance company debt type',
  },
  debtsTypeLoan: {
    id: 'es.application:debtsTypeLoan',
    defaultMessage: 'Lán',
    description: 'Loan debt type',
  },
  debtsTypeCreditCard: {
    id: 'es.application:debtsTypeCreditCard',
    defaultMessage: 'Kreditkort',
    description: 'Credit card debt type',
  },
  debtsTypeOverdraft: {
    id: 'es.application:debtsTypeOverdraft',
    defaultMessage: 'Yfirdráttur',
    description: 'Overdraft debt type',
  },
})
