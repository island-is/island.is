import { defineMessages } from 'react-intl'

export const m = defineMessages({
  prerequisitesTitle: {
    id: 'ir.application:prerequisitesTitle',
    defaultMessage: 'Erfðafjárskýrsla',
    description: '',
  },
  // Pre-data collection
  preDataCollectionHeading: {
    id: 'ir.application:preDataCollectionHeading',
    defaultMessage: 'Foröflun gagna',
    description: 'Heading for pre-collection',
  },
  preDataCollectionInfo: {
    id: 'ir.application:preDataCollectionInfo',
    defaultMessage:
      'Til þess að geta hafið umsókn þarf fyrst að sækja til sýslumanns hvort viðkomandi eigi einhver dánarbú á skrá.',
    description: 'Info for pre-collection',
  },
  preDataCollectionTitle: {
    id: 'ir.application:preDataCollectionTitle',
    defaultMessage: 'Upplýsingar um dánarbú',
    description: 'Title of provider for pre-collection',
  },

  preDataCollectionDescription: {
    id: 'ir.application:preDataCollectionDescription',
    defaultMessage: 'Sóttar verða upplýsingar frá sýslumanni um dánarbú',
    description: 'Description of provider for pre-collection',
  },

  preDataCollectionChooseEstateSelectTitle: {
    id: 'ir.application:preDataCollectionChooseEstateSelectTitle',
    defaultMessage: 'Upplýsingaöflun',
    description: 'Title for pre-collection of data',
  },
  preDataCollectionChooseEstateSelectTitleDropdown: {
    id: 'ir.application:preDataCollectionChooseEstateSelectTitleDropdown',
    defaultMessage: 'Upplýsingaöflun (nýr textareitur)',
    description: 'Title for pre-collection of data',
  },
  preDataCollectionApplicationFor: {
    id: 'ir.application:preDataCollectionApplicationFor',
    defaultMessage: 'Tegund umsóknar',
    description: 'Get application for',
  },
  preDataCollectionApplicationFoDescription: {
    id: 'ir.application:preDataCollectionApplicationFoDescription#markdown',
    defaultMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a ex magna. Aenean varius dui eget consectetur posuere. Pellentesque dignissim nunc id euismod porttitor. Curabitur ut ante pellentesque, rutrum purus in, vestibulum elit. Donec egestas lacus justo.',
    description: 'Get application for',
  },
  preDataCollectionApplicationForPrepaid: {
    id: 'ir.application:preDataCollectionApplicationForPrepaid',
    defaultMessage: 'Fyrirframgreiddur arfur',
    description: '',
  },
  preDataCollectionApplicationForDefault: {
    id: 'ir.application:preDataCollectionApplicationForDefault',
    defaultMessage: 'Dánarbú',
    description: '',
  },
  preDataCollectionApplicationForDefaultTooltip: {
    id: 'ir.application:preDataCollectionApplicationForDefaultTooltip',
    defaultMessage: 'Ekki er búið að opna fyrir umsóknir af þessari gerð.',
    description: '',
  },
  // Application begin
  selectEstate: {
    id: 'ir.application:selectEstate',
    defaultMessage: 'Veldu dánarbú',
    description: '',
  },
  selectEstateDescription: {
    id: 'ir.application:selectEstateDescription',
    defaultMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description: '',
  },
  applicationNamePrepaid: {
    id: 'ir.application:applicationNamePrepaid',
    defaultMessage: 'Fyrirframgreiddur arfur',
    description: '',
  },
  applicationNameEstate: {
    id: 'ir.application:applicationNameEstate',
    defaultMessage: 'Dánarbú',
    description: '',
  },
  institutionName: {
    id: 'ir.application:institution.name',
    defaultMessage: 'Sýslumenn',
    description: '',
  },
  draftTitle: {
    id: 'ir.application:draft.title',
    defaultMessage: 'Drög',
    description: '',
  },
  draftDescription: {
    id: 'ir.application:draft.description',
    defaultMessage: 'Drög að ólokinni umsókn',
    description: '',
  },
  institution: {
    id: 'ir.application:institution',
    defaultMessage: 'Sýslumenn',
    description: '',
  },
  confirmButton: {
    id: 'ir.application:confirmButton',
    defaultMessage: 'Staðfesta',
    description: '',
  },
  inheritance: {
    id: 'ir.application:inheritance',
    defaultMessage: 'Arfur',
    description: '',
  },
  inheritanceSelectionPrePaid: {
    id: 'ir.application:inheritanceSelectionPrePaid',
    defaultMessage: 'Hvað á að greiða í arf?',
    description: '',
  },
  inheritanceSelectionDescriptionPrePaid: {
    id: 'ir.application:inheritanceSelectionDescriptionPrePaid',
    defaultMessage: 'Lorem ipsum foo bar beep boop meep morp.',
    description: '',
  },
  // Data collection - external data providers
  dataCollectionTitle: {
    id: 'ir.application:dataCollectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: '',
  },
  dataCollectionSubtitle: {
    id: 'ir.application:dataCollectionSubtitle',
    defaultMessage: 'Eftirfarandi gögn verða sótt rafrænt',
    description: '',
  },
  dataCollectionCheckbox: {
    id: 'ir.application:dataCollectionCheckbox',
    defaultMessage: 'Ég skil að ofangreindra gagna verður aflað',
    description: '',
  },
  dataCollectionNoEstatesError: {
    id: 'ir.application:dataCollectionNoEstatesError',
    defaultMessage:
      'Þú ert ekki skráð/ur fyrir dánarbúi hjá sýslumanni. Ef þú telur svo vera skaltu hafa samband við sýslumann.',
    description:
      'User not eligible for estate or no estates found bound to their national id',
  },
  applicationInfoSectionTitle: {
    id: 'ir.application:applicationInfoSectionTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Titill fyrir hliðarstiku',
  },
  applicationInfoTitle: {
    id: 'ir.application:applicationInfoTitle',
    defaultMessage: 'Upplýsingar',
    description: 'Upplýsinga skjár titill',
  },
  applicationInfoText: {
    id: 'ir.application:applicationInfoTexts#markdown',
    defaultMessage: 'Upplýsinga Texti',
    description: 'Texti fyrir upplýsinga skjá',
  },

  deceasedInfoProviderTitle: {
    id: 'ir.application:deceasedInfoProviderTitle',
    defaultMessage: 'Upplýsingar um hinn látna',
    description: '',
  },
  deceasedInfoProviderSubtitle: {
    id: 'ir.application:deceasedInfoProviderSubtitle',
    defaultMessage:
      'Upplýsingar frá sýslumanni um kennitölu, dánardag, lögheimili, erfingja, eignir og hvort arfleifandi hafi skilað inn erfðaskrá eða gert kaupmála.',
    description: '',
  },
  personalInfoProviderTitle: {
    id: 'ir.application:personalInfoProviderTitle',
    defaultMessage: 'Persónuupplýsingar um þig',
    description: '',
  },
  personalInfoProviderSubtitle: {
    id: 'ir.application:personalInfoProviderSubtitle',
    defaultMessage: 'Upplýsingar frá Þjóðskrá um kennitölu og lögheimili.',
    description: '',
  },
  financialInformationProviderTitle: {
    id: 'ir.application:financialInformationProviderTitle',
    defaultMessage: 'Fjárhagsupplýsingar hins látna',
    description: '',
  },
  financialInformationProviderSubtitle: {
    id: 'ir.application:financialInformationProviderSubtitle',
    defaultMessage:
      'Upplýsingar um eignir og skuldir frá fjármálafyrirtækjum, húsnæðis- og mannvirkjastofnun, samgöngustofu, lífeyrissjóðum, innheimstustofnun sveitarfélaga, ríkissjóði og skattinum.',
    description: '',
  },
  settingsInfoProviderTitle: {
    id: 'ir.application:settingsInfoProviderTitle',
    defaultMessage: 'Stillingar frá Ísland.is',
    description: '',
  },
  settingsInfoProviderSubtitle: {
    id: 'ir.application:settingsInfoProviderSubtitle',
    defaultMessage:
      'Persónustillingar þínar (sími og netfang) þínar frá Ísland.is.',
    description: '',
  },
  maritalStatusProviderTitle: {
    id: 'ir.application:maritalStatusProviderTitle',
    defaultMessage: 'Hjúskaparstaða',
    description: '',
  },
  maritalStatusProviderSubtitle: {
    id: 'ir.application:maritalStatusProviderSubtitle',
    defaultMessage: 'Hjúskaparstaða falleg lýsing kemur hér.',
    description: '',
  },

  // Applicant's Information
  applicantsInfo: {
    id: 'ir.application:applicantsInfo',
    defaultMessage: 'Samskiptaupplýsingar',
    description: '',
  },
  applicantsInfoSubtitle: {
    id: 'ir.application:applicantsInfoSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: '',
  },
  applicantsInfoPrePaidSubtitle: {
    id: 'ir.application:applicantsInfoPrePaidSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og staðfestu hvort þær séu réttar.',
    description: '',
  },
  applicantsPrePaidInfoSubtitle: {
    id: 'ir.application:applicantsPrePaidInfoSubtitle',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: 'Subtitle text shown above prepaid applicant information form',
  },
  name: {
    id: 'ir.application:name',
    defaultMessage: 'Nafn',
    description: '',
  },
  dateOfBirth: {
    id: 'ir.application:dateOfBirth',
    defaultMessage: 'Fæðingardagur',
    description: '',
  },
  nationalId: {
    id: 'ir.application:nationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  advocateNationalId: {
    id: 'ir.application:advocateNationalId',
    defaultMessage: 'Kennitala forsjáraðila',
    description: '',
  },
  errorNationalIdIncorrect: {
    id: 'ir.application:error.nationalIdIncorrect',
    defaultMessage: 'Þessi kennitala virðist ekki vera rétt',
    description: 'National id is invalid',
  },
  address: {
    id: 'ir.application:address',
    defaultMessage: 'Lögheimili',
    description: '',
  },
  phone: {
    id: 'ir.application:phone',
    defaultMessage: 'Símanúmer',
    description: '',
  },
  advocatePhone: {
    id: 'ir.application:advocatePhone',
    defaultMessage: 'Símanúmer',
    description: '',
  },
  email: {
    id: 'ir.application:email',
    defaultMessage: 'Netfang',
    description: '',
  },
  relation: {
    id: 'ir.application:relation',
    defaultMessage: 'Tengsl umsækjanda við dánarbú',
  },
  advocateEmail: {
    id: 'ir.application:advocateEmail',
    defaultMessage: 'Netfang forsjáraðila',
    description: '',
  },

  // Inheritance report submit
  irSubmitTitle: {
    id: 'ir.application:irSubmitTitle',
    defaultMessage: 'Erfðafjárskýrsla',
    description: '',
  },
  irSubmitSubtitle: {
    id: 'ir.application:irSubmitSubtitle',
    defaultMessage:
      'Við lok einkaskipta á dánarbú þurfa erfingjarnir eða umboðsmaður/menn þeirra að fylla út erfðafjárskýrslu og skila til sýslumanns. Við lok opinberra skipta á dánarbú þarf skiptastjóri að skila inn erfðafjárskýrslu reynist skilyrði til þess. Þú ert að skila inn erfðafjárskýrslu fyrir:',
    description: '',
  },

  // The deceased
  theDeceased: {
    id: 'ir.application:theDeceased',
    defaultMessage: 'Hinn látni',
    description: '',
  },
  nameOfTheDeceased: {
    id: 'ir.application:nameOfTheDeceased',
    defaultMessage: 'Nafn hins látna',
    description: '',
  },
  deathDate: {
    id: 'ir.application:deathDate',
    defaultMessage: 'Dánardagur',
    description: '',
  },
  deathDateNotRegistered: {
    id: 'ir.application:deathDateNotRegistered',
    defaultMessage: 'Dánardagur ekki skráður',
    description: '',
  },

  // Estate Properties
  properties: {
    id: 'ir.application:properties',
    defaultMessage: 'Eignir',
    description: '',
  },
  propertiesTitle: {
    id: 'ir.application:propertiesTitle',
    defaultMessage: 'Innlendar og erlendar eignir á dánardegi hins látna',
    description: '',
  },
  propertiesDescriptionAssets: {
    id: 'ir.application:propertiesDescriptionAssets#markdown',
    defaultMessage:
      'Vinsamlegast tilgreindu allar hjúskapareignir beggja hjóna utan einstaklingsatvinnurekstrar á dánardegi hins látna. Einnig séreign hins látna. Ef hinn látni átti ekki fasteign vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  propertiesDescriptionPrePaidAssets: {
    id: 'ir.application:propertiesDescriptionPrePaidAssets#markdown',
    defaultMessage: 'Lorem ipsum lorem ipsum',
    description: '',
  },
  propertiesDescriptionInventory: {
    id: 'ir.application:propertiesDescriptionInventory#markdown',
    defaultMessage:
      'Vinsamlegast tilgreindu allar hjúskapareignir beggja hjóna utan einstaklingsatvinnurekstrar á dánardegi hins látna. Einnig séreign hins látna. Ef hinn látni átti ekki innbú vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  propertiesDescriptionVehicles: {
    id: 'ir.application:propertiesDescriptionVehicles#markdown',
    defaultMessage:
      'Vinsamlegast tilgreindu allar hjúskapareignir beggja hjóna utan einstaklingsatvinnurekstrar á dánardegi hins látna. Einnig séreign hins látna. Ef hinn látni átti ekki farartæki vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  propertiesDescriptionGuns: {
    id: 'ir.application:propertiesDescriptionGuns#markdown',
    defaultMessage:
      'Vinsamlegast tilgreindu allar hjúskapareignir beggja hjóna utan einstaklingsatvinnurekstrar á dánardegi hins látna. Einnig séreign hins látna. Ef hinn látni átti ekki skotvopn vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  propertiesDescriptionBankAccounts: {
    id: 'ir.application:propertiesDescriptionBankAccounts#markdown',
    defaultMessage:
      'Vinsamlegast tilgreindu allar hjúskapareignir beggja hjóna utan einstaklingsatvinnurekstrar á dánardegi hins látna. Einnig séreign hins látna. Ef hinn látni átti ekki innstæður í bönkum vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  propertiesDescriptionClaims: {
    id: 'ir.application:propertiesDescriptionClaims#markdown',
    defaultMessage:
      'Vinsamlegast tilgreindu allar hjúskapareignir beggja hjóna utan einstaklingsatvinnurekstrar á dánardegi hins látna. Einnig séreign hins látna. Ef hinn látni átti ekki verðbréf eða kröfur vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  propertiesDescriptionStocks: {
    id: 'ir.application:propertiesDescriptionStocks#markdown',
    defaultMessage:
      'Vinsamlegast tilgreindu allar hjúskapareignir beggja hjóna utan einstaklingsatvinnurekstrar á dánardegi hins látna. Einnig séreign hins látna. Ef hinn látni átti ekki hlutabréf vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  propertiesDescriptionMoney: {
    id: 'ir.application:propertiesDescriptionMoney#markdown',
    defaultMessage:
      'Vinsamlegast tilgreindu allar hjúskapareignir beggja hjóna utan einstaklingsatvinnurekstrar á dánardegi hins látna. Einnig séreign hins látna. Ef hinn látni átti ekki peninga sem varðveittir eru utan fjármálastofnana vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  propertiesDescriptionOtherAssets: {
    id: 'ir.application:propertiesDescriptionOtherAssets#markdown',
    defaultMessage:
      'Vinsamlegast tilgreindu allar hjúskapareignir beggja hjóna utan einstaklingsatvinnurekstrar á dánardegi hins látna. Einnig séreign hins látna. Ef hinn látni átti ekki aðrar eignir vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },

  // Estate Properties - Prepaid
  propertiesDescriptionPrePaidStocks: {
    id: 'ir.application:propertiesDescriptionPrePaidStocks#markdown',
    defaultMessage: 'Lorem ipsum lorem ipsum',
    description: '',
  },
  propertiesDescriptionPrePaidMoney: {
    id: 'ir.application:propertiesDescriptionPrePaidMoney#markdown',
    defaultMessage: 'Lorem ipsum lorem ipsum',
    description: '',
  },
  propertiesDescriptionPrePaidOtherAssets: {
    id: 'ir.application:propertiesDescriptionPrePaidOtherAssets#markdown',
    defaultMessage: 'Lorem ipsum lorem ipsum',
    description: '',
  },
  otherAssetRepeaterButton: {
    id: 'ir.application:otherAssetRepeaterButton',
    defaultMessage: 'Bæta við eign',
    description: '',
  },
  realEstate: {
    id: 'ir.application:realEstate',
    defaultMessage: 'Fasteignir',
    description: '',
  },
  realEstateRepeaterHeader: {
    id: 'ir.application:realEstateRepeaterHeader',
    defaultMessage: 'Fasteign',
    description: '',
  },
  realEstateDescription: {
    id: 'ir.application:realEstateDescription',
    defaultMessage: 'Til dæmis íbúðarhús, sumarhús, lóðir og jarðir.',
    description: '',
  },
  realEstateDescriptionPrePaid: {
    id: 'ir.application:realEstateDescriptionPrePaid#markdown',
    defaultMessage: 'Til dæmis íbúðarhús, sumarhús, lóðir og jarðir.',
    description: '',
  },
  addRealEstate: {
    id: 'ir.application:addRealEstate',
    defaultMessage: 'Bæta við fasteign',
    description: '',
  },
  assetNumber: {
    id: 'ir.application:assetNumber',
    defaultMessage: 'Fasteignanúmer',
    description: '',
  },
  assetAddress: {
    id: 'ir.application:assetAddress',
    defaultMessage: 'Lögheimili',
    description: '',
  },
  propertyValuationPrePaid: {
    id: 'ir.application:propertyValuationPrepaid',
    defaultMessage: 'Fasteignamat',
    description: '',
  },
  propertyValuation: {
    id: 'ir.application:propertyValuation',
    defaultMessage: 'Fasteignamat á dánardegi',
    description: '',
  },
  inventoryTitle: {
    id: 'ir.application:inventoryTitle',
    defaultMessage: 'Innbú',
    description: '',
  },
  inventoryDescription: {
    id: 'ir.application:inventoryDescription',
    defaultMessage: 'Til dæmis bækur og málverk.',
    description: '',
  },
  inventoryTextField: {
    id: 'ir.application:inventoryTextField',
    defaultMessage: 'Upplýsingar um innbú',
    description: '',
  },
  inventoryValueTitle: {
    id: 'ir.application:inventoryValueTitle',
    defaultMessage: 'Matsverðmæti á dánardegi',
    description: '',
  },
  inventoryTextFieldPlaceholder: {
    id: 'ir.application:inventoryTextFieldPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar um innbú hér',
    description: '',
  },
  addInventory: {
    id: 'ir.application:addInventory',
    defaultMessage: 'Bæta við innbúi',
    description: 'Add property',
  },
  vehicles: {
    id: 'ir.application:vehicles',
    defaultMessage: 'Farartæki',
    description: '',
  },
  vehiclesDescription: {
    id: 'ir.application:vehiclesDescription',
    defaultMessage: 'Til dæmis ökutæki, flugvélar og skip/bátar.',
    description: '',
  },
  vehicleType: {
    id: 'ir.application:vehicleType',
    defaultMessage: 'Tegund',
    description: '',
  },
  vehicleValuation: {
    id: 'ir.application:vehicleValuation',
    defaultMessage: 'Markaðsverðmæti á dánardegi',
    description: '',
  },
  propertyNumber: {
    id: 'ir.application:propertyNumber',
    defaultMessage: 'Fastanúmer',
    description: 'Property number label',
  },
  propertyShare: {
    id: 'ir.application:propertyShare',
    defaultMessage: 'Eignarhluti',
    description: 'Property share label',
  },
  addProperty: {
    id: 'ir.application:addProperty',
    defaultMessage: 'Bæta við fasteign',
    description: 'Add property',
  },
  vehiclesTitle: {
    id: 'ir.application:vehiclesTitle',
    defaultMessage: 'Faratæki',
    description: 'Vehicles title',
  },
  vehiclesPlaceholder: {
    id: 'ir.application:vehiclesPlaceholder',
    defaultMessage: 't.d. Toyota Yaris',
    description: 'Placeholder for vehicles type',
  },
  addVehicle: {
    id: 'ir.application:addVehicle',
    defaultMessage: 'Bæta við farartæki',
    description: 'Add vehicle',
  },
  vehicleNumberLabel: {
    id: 'ir.application:vehicleNumberLabel',
    defaultMessage: 'Fastanúmer ökutækis',
    description: 'Vehicle number label',
  },
  vehicleTypeLabel: {
    id: 'ir.application:vehicleTypeLabel',
    defaultMessage: 'Tegund faratækis',
    description: 'Vehicle type label',
  },

  // Guns
  guns: {
    id: 'ir.application:guns',
    defaultMessage: 'Skotvopn',
    description: '',
  },
  gunsDescription: {
    id: 'ir.application:gunsDescription',
    defaultMessage: 'Til dæmis haglabyssa, riffill og skammbyssa',
    description: '',
  },
  addGun: {
    id: 'ir.application:addGun',
    defaultMessage: 'Bæta við skotvopni',
    description: 'Add gun',
  },
  gunType: {
    id: 'ir.application:gunType',
    defaultMessage: 'Tegund',
    description: '',
  },
  gunValuation: {
    id: 'ir.application:gunValuation',
    defaultMessage: 'Markaðsverðmæti á dánardegi',
    description: '',
  },
  gunSerialNumber: {
    id: 'ir.application:gunSerialNumber',
    defaultMessage: 'Raðnúmer',
    description: '',
  },

  // Bank Info
  estateBankInfo: {
    id: 'ir.application:estateBankInfo',
    defaultMessage: 'Innstæður í bönkum og sparisjóðum',
    description: '',
  },
  estateBankInfoDescription: {
    id: 'ir.application:estateBankInfoDescription',
    defaultMessage:
      'Innstæður í bæði innlendum og erlendum bönkum og sparisjóðum.',
    description: '',
  },
  bankAccount: {
    id: 'ir.application:bankAccount',
    defaultMessage: 'Bankareikningur',
    description: '',
  },
  bankAccountForeign: {
    id: 'ir.application:bankAccountForeign',
    defaultMessage: 'Erlendur bankareikningur',
    description: '',
  },
  bankAccountForeignLabel: {
    id: 'ir.application:bankAccountForeignLabel',
    defaultMessage: 'Erlendur bankareikningur',
    description: '',
  },
  bankAccountBalance: {
    id: 'ir.application:bankAccountBalance',
    defaultMessage: 'Innstæða með vöxtum á dánardegi',
    description: '',
  },
  bankAccountCapitalPrePaid: {
    id: 'ir.application:bankAccountCapitalPrePaid',
    defaultMessage: 'Upphæð',
    description: '',
  },
  bankAccountCapital: {
    id: 'ir.application:bankAccountCapital',
    defaultMessage: 'Höfuðstóll á dánardegi',
    description: '',
  },
  bankAccountPenaltyInterestRates: {
    id: 'ir.application:bankAccountPenaltyInterestRates',
    defaultMessage: 'Áfallnir vextir á dánardegi',
    description: '',
  },
  bankAccountPlaceholder: {
    id: 'ir.application:bankAccountPlaceholder',
    defaultMessage: 'xxxx - xx - xxxxxx',
    description: '',
  },
  bankAccountRepeaterButton: {
    id: 'ir.application:bankAccountRepeaterButton',
    defaultMessage: 'Bæta við bankareikningi',
    description: '',
  },

  // Claims
  claimsTitle: {
    id: 'ir.application:claimsTitle',
    defaultMessage: 'Verðbréf og kröfur',
    description: '',
  },
  claimsDescription: {
    id: 'ir.application:claimsDescription',
    defaultMessage: 'Útgefandi og fjárhæð með vöxtum.',
    description: '',
  },
  claimsIssuer: {
    id: 'ir.application:claimsIssuer',
    defaultMessage: 'Útgefandi',
    description: '',
  },
  claimsAmount: {
    id: 'ir.application:claimsAmount',
    defaultMessage: 'Fjárhæð með vöxtum á dánardegi',
    description: '',
  },
  claimsRepeaterButton: {
    id: 'ir.application:claimsRepeaterButton',
    defaultMessage: 'Bæta við verðbréfi og/eða kröfu',
    description: '',
  },

  // Stocks
  stocksTitle: {
    id: 'ir.application:stocksTitle',
    defaultMessage: 'Hlutabréf',
    description: '',
  },
  stocksDescription: {
    id: 'ir.application:stocksDescription#markdown',
    defaultMessage: 'Nafn og kennitala ef um einstakling er að ræða.',
    description: '',
  },
  stocksDescriptionPrePaid: {
    id: 'ir.application:stocksDescriptionPrePaid#markdown',
    defaultMessage:
      'Upplýsingar um nafnverð hlutabréfa má finna í síðasta skattframtali. Upplýsingar um gengi hlutabréfa er hægt að fá hjá bönkum, félaginu sjálfu eða miða við síðasta ársreikning félagsins sem sækja má á heimasíðu Skattsins, www.skatturinn.is/fyrirtaekjaskra',
    description: '',
  },
  stocksOrganization: {
    id: 'ir.application:stocksOrganization',
    defaultMessage: 'Útgefandi',
    description: '',
  },
  stocksNationalId: {
    id: 'ir.application:stocksNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  stocksFaceValue: {
    id: 'ir.application:stocksFaceValue',
    defaultMessage: 'Nafnverð á dánardegi',
    description: '',
  },
  stocksFaceValuePrePaid: {
    id: 'ir.application:stocksFaceValuePrePaid',
    defaultMessage: 'Nafnverð',
    description: '',
  },
  stocksRateOfChange: {
    id: 'ir.application:stocksRateOfChange',
    defaultMessage: 'Gengi á dánardegi',
    description: '',
  },
  stocksRateOfChangePrePaid: {
    id: 'ir.application:stocksRateOfChangePrePaid',
    defaultMessage: 'Gengi',
    description: '',
  },
  stocksValue: {
    id: 'ir.application:stocksValue',
    defaultMessage: 'Markaðsverðmæti á dánardegi',
    description: '',
  },
  stocksRepeaterButton: {
    id: 'ir.application:stocksRepeaterButton',
    defaultMessage: 'Bæta við hlutabréfi',
    description: '',
  },

  // Money & deposit
  moneyTitle: {
    id: 'ir.application:moneyTitle',
    defaultMessage: 'Peningar og bankahólf',
    description: '',
  },
  moneyTitlePrePaid: {
    id: 'ir.application:moneyTitlePrePaid',
    defaultMessage: 'Peningar',
    description: '',
  },
  moneyDescription: {
    id: 'ir.application:moneyDescription',
    defaultMessage: 'Peningar sem varðveittir eru utan fjármálastofnanna.',
    description: '',
  },
  moneyDescriptionPrePaid: {
    id: 'ir.application:moneyDescriptionPrePaid',
    defaultMessage: 'Peningar sem varðveittir eru utan fjármálastofnanna.',
    description: '',
  },
  moneyText: {
    id: 'ir.application:moneyText',
    defaultMessage: 'peningar og bankahólf',
    description: '',
  },
  moneyPlaceholder: {
    id: 'ir.application:moneyPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar hér',
    description: '',
  },
  moneyValuePrePaid: {
    id: 'ir.application:moneyValuePrePaid',
    defaultMessage: 'Fjárhæð',
    description: '',
  },
  moneyValue: {
    id: 'ir.application:moneyValue',
    defaultMessage: 'Fjárhæð á dánardegi',
    description: '',
  },
  addMoney: {
    id: 'ir.application:addMoney',
    defaultMessage: 'Bæta við peningum og/eða bankahólfi',
    description: '',
  },

  // Other assets
  otherAssetsTitle: {
    id: 'ir.application:otherAssetsTitle',
    defaultMessage: 'Aðrar eignir',
    description: '',
  },
  otherAssetsDescription: {
    id: 'ir.application:otherAssetsDescription',
    defaultMessage: 'Til dæmis verkfæri, hugverkaréttindi, búseturéttur o.fl.',
    description: '',
  },
  otherAssetsDescriptionPrePaid: {
    id: 'ir.application:otherAssetsDescriptionPrePaid',
    defaultMessage: 'Til dæmis verkfæri, hugverkaréttindi, búseturéttur o.fl.',
    description: '',
  },
  otherAssetsText: {
    id: 'ir.application:otherAssetsText',
    defaultMessage: 'Hvaða eign',
    description: '',
  },
  otherAssetsPlaceholder: {
    id: 'ir.application:otherAssetsPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar hér',
    description: '',
  },
  otherAssetsValue: {
    id: 'ir.application:otherAssetsValue',
    defaultMessage: 'Markaðsverðmæti á dánardegi',
    description: '',
  },
  addAsset: {
    id: 'ir.application:addAsset',
    defaultMessage: 'Bæta við annari eign',
    description: '',
  },
  assetHeaderText: {
    id: 'ir.application:assetHeaderText',
    defaultMessage: 'Eign',
    description: '',
  },
  otherAssetsTotal: {
    id: 'ir.application:otherAssetsTotal',
    defaultMessage: 'Matsverð annarra eigna samtals á dánardegi',
    description: '',
  },

  // Assets overview
  overview: {
    id: 'ir.application:overview',
    defaultMessage: 'Yfirlit',
    description: '',
  },
  overviewDescription: {
    id: 'ir.application:overviewDescription',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og athugaðu hvort þær séu réttar.',
    description: '',
  },
  notFilledOut: {
    id: 'ir.application:notFilledOut',
    defaultMessage: 'Ekki fyllt út',
    description: '',
  },
  assetOverview: {
    id: 'ir.application:assetOverview',
    defaultMessage: 'Yfirlit eigna',
    description: '',
  },
  debtsAndFuneralCostOverview: {
    id: 'ir.application:debtsAndFuneralCostOverview',
    defaultMessage: 'Yfirlit skulda og útfararkostnaðar',
    description: '',
  },
  assetOverviewDescription: {
    id: 'ir.application:assetOverviewDescription',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
    description: '',
  },
  assetsOverviewConfirmation: {
    id: 'ir.application:assetsOverviewConfirmation',
    defaultMessage:
      'Ég staðfesti að hafa fært inn upplýsingar um eignir á dánardegi eftir minni bestu vitund.',
    description: '',
  },
  assetsOverviewConfirmationPrePaid: {
    id: 'ir.application:assetsOverviewConfirmationPrePaid',
    defaultMessage:
      'Ég staðfesti að hafa fært inn upplýsingar um eignir eftir minni bestu vitund.',
    description: '',
  },
  debtsOverviewConfirmation: {
    id: 'ir.application:debtsOverviewConfirmation',
    defaultMessage:
      'Ég staðfesti að hafa fært inn upplýsingar um skuldir eftir minni bestu vitund.',
    description: '',
  },
  heirsOverviewConfirmation: {
    id: 'ir.application:heirsOverviewConfirmation',
    defaultMessage:
      'Ég staðfesti að hafa fært inn upplýsingar um eign til skipta og erfingja eftir minni bestu vitund.',
    description: '',
  },
  realEstateEstimation: {
    id: 'ir.application:realEstateEstimation',
    defaultMessage: 'Fasteignamat samtals á dánardegi',
    description: '',
  },
  realEstateEstimationPrePaid: {
    id: 'ir.application:realEstateEstimationPrePaid',
    defaultMessage: 'Fasteignamat samtals',
    description: '',
  },
  marketValueTotal: {
    id: 'ir.application:marketValueTotal',
    defaultMessage: 'Markaðsverð samtals á dánardegi',
    description: '',
  },
  totalValue: {
    id: 'ir.application:totalValue',
    defaultMessage: 'Verðmæti samtals á dánardegi',
    description: '',
  },
  totalValuePrePaid: {
    id: 'ir.application:totalValuePrePaid',
    defaultMessage: 'Verðmæti samtals',
    description: '',
  },
  banksBalance: {
    id: 'ir.application:banksBalance',
    defaultMessage: 'Innstæða í bönkum með vöxtum á dánardegi',
    description: '',
  },
  totalValueOfAssets: {
    id: 'ir.application:totalValueOfAssets',
    defaultMessage: 'Samtals virði eigna',
    description: '',
  },
  total: {
    id: 'ir.application:total',
    defaultMessage: 'Samtals',
    description: '',
  },

  // Debts and funeral cost
  debtsAndFuneralCost: {
    id: 'ir.application:debtsAndFuneralCost',
    defaultMessage: 'Innlendar og erlendar skuldir á dánardegi hins látna',
    description: '',
  },
  debtsAndFuneralCostDescription: {
    id: 'ir.application:debtsAndFuneralCostDescription',
    defaultMessage:
      'Vinsamlegast tilgreindu allar skuldir beggja hjóna utan einstaklingsatvinnurekstrar. Ef hinn látni átti ekki neinar skuldir vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  domesticAndForeignDebts: {
    id: 'ir.application:debtsDescription',
    defaultMessage: 'Skuldir',
    description: '',
  },
  domesticAndForeignDebtsDescription: {
    id: 'ir.application:domesticAndForeignDebtsDescription',
    defaultMessage: 'Tilgreindu kennitölu ef um einstakling er að ræða.',
    description: '',
  },
  funeralCostTitle: {
    id: 'ir.application:funeralCostTitle',
    defaultMessage: 'Útfararkostnaður',
    description: '',
  },
  funeralCostDescription: {
    id: 'ir.application:funeralCostDescription',
    defaultMessage: 'Útfararkostnaður samkvæmt yfirliti um útfararkostnað.',
    description: '',
  },
  amount: {
    id: 'ir.application:amount',
    defaultMessage: 'Fjárhæð',
    description: '',
  },
  funeralCostAmount: {
    id: 'ir.application:funeralCostAmount',
    defaultMessage: 'Fjárhæð',
    description: '',
  },
  funeralBuildCost: {
    id: 'ir.application:funeralBuildCost',
    defaultMessage: 'Smíði kistu og umbúnaður',
    description: '',
  },
  funeralCremationCost: {
    id: 'ir.application:funeralCremationCost',
    defaultMessage: 'Líkbrennsla',
    description: '',
  },
  funeralPrintCost: {
    id: 'ir.application:funeralPrintCost',
    defaultMessage: 'Prentun',
    description: '',
  },
  funeralFlowersCost: {
    id: 'ir.application:funeralFlowersCost',
    defaultMessage: 'Blóm',
    description: '',
  },
  funeralMusicCost: {
    id: 'ir.application:funeralMusicCost',
    defaultMessage: 'Tónlistarflutningur',
    description: '',
  },
  funeralRentCost: {
    id: 'ir.application:funeralRentCost',
    defaultMessage: 'Leiga á sal',
    description: '',
  },
  funeralFoodAndDrinkCost: {
    id: 'ir.application:funeralFoodAndDrinkCost',
    defaultMessage: 'Erfidrykkja',
    description: '',
  },
  funeralTombstoneCost: {
    id: 'ir.application:funeralTombstoneCost',
    defaultMessage: 'Legsteinn (áætlaður kostnaður)',
    description: '',
  },
  funeralServiceCost: {
    id: 'ir.application:funeralServiceCost',
    defaultMessage: 'Útfararþjónusta',
    description: '',
  },
  funeralOtherCostQuestion: {
    id: 'ir.application:funeralOtherCostQuestion',
    defaultMessage: 'Annar kostnaður?',
    description: '',
  },
  funeralOtherCost: {
    id: 'ir.application:funeralOtherCost',
    defaultMessage: 'Annar kostnaður',
    description: '',
  },
  funeralOtherCostDetails: {
    id: 'ir.application:funeralOtherCostDetails',
    defaultMessage:
      'Vinsamlegast tilgreinið með nánari hætti hvað felst í öðrum kostnaði',
    description: '',
  },
  funeralOtherCostDetailsOverview: {
    id: 'ir.application:funeralOtherCostDetailsOverview',
    defaultMessage: 'Hvað felst í öðrum kostnaði',
    description: '',
  },
  totalCost: {
    id: 'ir.application:totalCost',
    defaultMessage: 'Heildarkostnaður',
    description: '',
  },
  debtsTitle: {
    id: 'ir.application:debtsTitle',
    defaultMessage: 'Skuldir',
    description: '',
  },
  debtsCreditorHeader: {
    id: 'ir.application:debtsCreditorHeader',
    defaultMessage: 'Skuld',
    description: '',
  },
  debtsCreditorName: {
    id: 'ir.application:debtsCreditorName',
    defaultMessage: 'Nafn kröfuhafa',
    description: '',
  },
  debtsLoanIdentity: {
    id: 'ir.application:debtsLoanIdentity',
    defaultMessage: 'Auðkenni / Lánsnúmer',
    description: '',
  },
  debtType: {
    id: 'ir.application:debtsType',
    defaultMessage: 'Tegund skuldar',
    description: '',
  },
  creditorsNationalId: {
    id: 'ir.application:creditorsNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  debtsBalance: {
    id: 'ir.application:debtsBalance',
    defaultMessage: 'Eftirstöðvar á dánardegi',
    description: '',
  },
  debtsRepeaterButton: {
    id: 'ir.application:debtsRepeaterButton',
    defaultMessage: 'Bæta við skuldum',
    description: '',
  },
  publicChargesTitle: {
    id: 'ir.application:publicChargesTitle',
    defaultMessage: 'Opinber gjöld',
    description: '',
  },
  publicChargesDescription: {
    id: 'ir.application:publicChargesDescription',
    defaultMessage: 'Skuld við opinberar stofnanir.',
    description: '',
  },
  publicChargesRepeaterButton: {
    id: 'ir.application:publicChargesRepeaterButton',
    defaultMessage: 'Bæta við opinberum gjöldum',
    description: '',
  },
  publicChargeHeader: {
    id: 'ir.application:publicChargeHeader',
    defaultMessage: 'Gjald',
    description: '',
  },
  totalValueOfDebts: {
    id: 'ir.application:totalValueOfDebts',
    defaultMessage: 'Samtals virði skulda',
    description: '',
  },

  // Debts overview
  totalAmount: {
    id: 'ir.application:totalAmount',
    defaultMessage: 'Samtals fjárhæð',
    description: '',
  },

  totalAmountDebts: {
    id: 'ir.application:totalAmountDebts',
    defaultMessage: 'Samtals fjárhæð skuldir',
    description: '',
  },

  totalAmountPublic: {
    id: 'ir.application:totalAmountPublic',
    defaultMessage: 'Samtals fjárhæð opinber gjöld',
    description: '',
  },

  totalAmountFuneralCost: {
    id: 'ir.application:totalAmountFuneralCost',
    defaultMessage: 'Samtals fjárhæð útfararkostnaðar',
    description: '',
  },

  debtsAndFuneralCostTitle: {
    id: 'ir.application:debtsAndFuneralCostTitle',
    defaultMessage: 'Skuldir og útfararkostnaður',
    description: '',
  },

  // Business
  business: {
    id: 'ir.application:business',
    defaultMessage: 'Atvinnurekstur',
    description: '',
  },
  businessTitle: {
    id: 'ir.application:businessTitle',
    defaultMessage: 'Eignir og skuldir í einstaklingsatvinnurekstri',
    description: '',
  },
  businessDescription: {
    id: 'ir.application:businessDescription',
    defaultMessage:
      'Vinsamlegast tilgreindu allar eignir og skuldir arfleifanda í einstaklingsatvinnurekstri.',
    description: '',
  },
  businessAssets: {
    id: 'ir.application:businessAssets',
    defaultMessage: 'Eignir í einstaklingsatvinnurekstri',
    description: '',
  },
  businessAssetsDescription: {
    id: 'ir.application:businessAssetsDescription',
    defaultMessage:
      'Aðrar eignir en fasteignir, t.d. vélar og tæki í landbúnaði. Færast á markaðsverðmæti á dánardegi.',
    description: '',
  },
  businessAsset: {
    id: 'ir.application:businessAsset',
    defaultMessage: 'Hvaða eign',
    description: '',
  },
  businessAssetAmount: {
    id: 'ir.application:businessAssetAmount',
    defaultMessage: 'Markaðsvirði á dánardegi',
    description: '',
  },
  businessAssetRepeaterButton: {
    id: 'ir.application:businessAssetRepeaterButton',
    defaultMessage: 'Bæta við eign',
    description: '',
  },
  businessAssetRepeaterHeader: {
    id: 'ir.application:businessAssetRepeaterHeader',
    defaultMessage: 'Eign',
    description: '',
  },
  businessDebtsTitle: {
    id: 'ir.application:businessDebtsTitle',
    defaultMessage: 'Skuldir',
    description: '',
  },
  businessDebts: {
    id: 'ir.application:businessDebts',
    defaultMessage: 'Skuldir í einstaklingsatvinnurekstri',
    description: '',
  },
  businessDebtsDescription: {
    id: 'ir.application:businessDebtsDescription',
    defaultMessage: 'Tilgreindu kennitölu ef um einstakling er að ræða.',
    description: '',
  },
  businessOverview: {
    id: 'ir.application:businessOverview',
    defaultMessage: 'Yfirlit eigna og skulda í atvinnurekstri',
    description: '',
  },
  businessEquity: {
    id: 'ir.application:businessEquity',
    defaultMessage: 'Hrein eign í atvinnurekstri',
    description: '',
  },

  // Assets to share
  assetsToShareDescription: {
    id: 'ir.application:assetsToShareDescription#markdown',
    defaultMessage:
      'Frá dregst búshluti eftirlifandi maka samkvæmt reglum hjúskaparlaga nr. 31/1993.',
    description: '',
  },
  assetsToShareTotalAssets: {
    id: 'ir.application:assetsToShareTotalAssets',
    defaultMessage: 'Heildareignir',
    description: '',
  },
  assetsToShareTotalDebts: {
    id: 'ir.application:assetsToShareTotalDebts',
    defaultMessage: 'Heildarskuldir',
    description: '',
  },
  assetsToShareSpouseShare: {
    id: 'ir.application:assetsToShareSpouseShare',
    defaultMessage: 'Búshluti makans',
    description: '',
  },
  assetsToShareEstateShare: {
    id: 'ir.application:assetsToShareEstateShare',
    defaultMessage: 'Búshluti dánarbús',
    description: '',
  },
  assetsToShareHasCustomSpousePercentage: {
    id: 'ir.application:assetsToShareHasCustomSpousePercentage',
    defaultMessage: 'Maki hefur annan búshluta en 50%',
    description: '',
  },
  assetsToShareHasCustomSpousePercentageError: {
    id: 'ir.application:assetsToShareHasCustomSpousePercentageError',
    defaultMessage: 'Búshluti verður að vera á milli 50% og 100%',
    description: '',
  },
  assetsToShareCustomSpousePercentage: {
    id: 'ir.application:assetsToShareCustomSpousePercentage',
    defaultMessage: 'Búshluti',
    description: '',
  },

  // Heirs
  spousesShare: {
    id: 'ir.application:spousesShare',
    defaultMessage: 'Búshluti eftirlifandi maka',
    description: '',
  },
  deceasedSeparateProperty: {
    id: 'ir.application:deceasedSeparateProperty',
    defaultMessage: 'Séreign hins látna',
    description: '',
  },
  share: {
    id: 'ir.application:share',
    defaultMessage: 'Séreign',
    description: '',
  },
  deceasedSharePercentage: {
    id: 'ir.application:deceasedSharePercentage',
    defaultMessage: 'Búshluti maka',
    description: '',
  },
  deceasedShare: {
    id: 'ir.application:deceasedShare',
    defaultMessage: 'Hlutfall séreignar',
    description: '',
  },
  spousesShareDescription: {
    id: 'ir.application:spousesShareDescription',
    defaultMessage:
      'Vinsamlegast tilgreindu um tilvist erfðaskráar eða kaupmála, og skráðu athugasemdir ef einhverjar eru.',
    description: '',
  },
  wasInCohabitation: {
    id: 'ir.application:wasInCohabitation',
    defaultMessage: 'Var hinn látni í hjúskap?',
    description: '',
  },
  hasCustomSpouseSharePercentage: {
    id: 'ir.application:hasCustomSpouseSharePercentage',
    defaultMessage: 'Er verið að skipta dánarbúi að fullu eða að hluta?',
    description: '',
  },
  spouseShareFull: {
    id: 'ir.application:spouseShareFull',
    defaultMessage: 'Að fullu',
    description: '',
  },
  spouseSharePart: {
    id: 'ir.application:spouseSharePart',
    defaultMessage: 'Að hluta',
    description: '',
  },
  hadSeparateProperty: {
    id: 'ir.application:hadSeparateProperty',
    defaultMessage:
      'Átti hinn látni séreign í hjúskapnum samkvæmt kaupmála eða fyrirmælum í erfðaskrá?',
    description: '',
  },
  hadSeparatePropertyTitle: {
    id: 'ir.application:hadSeparatePropertyTitle',
    defaultMessage: 'Látni átti séreign í eigninni',
    description: '',
  },
  totalSeparateProperty: {
    id: 'ir.application:totalSeparateProperty',
    defaultMessage:
      'Vinsamlegast tilgreindu heildarverðmæti séreignar hins látna.',
    description: '',
  },
  totalSeparatePropertyDescription: {
    id: 'ir.application:totalSeparatePropertyDescription',
    defaultMessage: '[Nánari lýsing hér fyrir til að útskýra þessa upphæð]',
    description: '',
  },
  errorTotalSeparateProperty: {
    id: 'ir.application:errorTotalSeparateProperty',
    defaultMessage: 'Vantar að fylla út.',
    description: '',
  },
  errorTotalDeduction: {
    id: 'ir.application:errorTotalDeduction',
    defaultMessage: 'Vantar að fylla út.',
    description: '',
  },
  totalSeparatePropertyLabel: {
    id: 'ir.application:totalSeparatePropertyLabel',
    defaultMessage: 'Heildarverðmæti séreignir hins látna',
    description: '',
  },
  propertyForExchange: {
    id: 'ir.application:propertyForExchange',
    defaultMessage: 'Hrein eign dánarbús til skipta milli erfingja',
    description: '',
  },
  propertyForExchangeDescription: {
    id: 'ir.application:propertyForExchangeDescription',
    defaultMessage:
      'Frá dregst búshluti eftirlifandi maka skv. reglum hjúskaparlaga nr. 31/1993 (50% eigna).',
    description: '',
  },
  propertyForExchangeAndHeirs: {
    id: 'ir.application:propertyForExchangeAndHeirs',
    defaultMessage: 'Eign til skipta og erfingjar',
    description: '',
  },
  propertyForExchangeAlternative: {
    id: 'ir.application:propertyForExchangeAlternative',
    defaultMessage: 'Eign til skipta',
    description: '',
  },
  totalDeduction: {
    id: 'ir.application:totalDeduction',
    defaultMessage: 'Samtals frádráttur (búshluti maka)',
    description: '',
  },
  totalDeductionAlternative: {
    id: 'ir.application:totalDeductionAlternative',
    defaultMessage: 'Samtals frádráttur',
    description: '',
  },
  netProperty: {
    id: 'ir.application:netProperty',
    defaultMessage: 'Hrein eign',
    description: '',
  },
  netPropertyForExchange: {
    id: 'ir.application:netPropertyForExchange',
    defaultMessage: 'Hrein eign til skipta',
    description: '',
  },
  heirsTitlePrePaid: {
    id: 'ir.application:heirsTitlePrePaid',
    defaultMessage: 'Hver á að fá arfinn?',
    description: '',
  },
  heirsDescriptionPrePaid: {
    id: 'ir.application:heirsDescriptionPrePaid#markdown',
    defaultMessage:
      'Vinsamlegast skráðu upplýsingar um þá erfingja sem eiga að taka við fyrirframgreiddum arfi.',
    description: '',
  },
  heirsAndPartition: {
    id: 'ir.application:heirsAndPartition',
    defaultMessage: 'Erfingjar og skipting',
    description: '',
  },
  heirsAndPartitionDescription: {
    id: 'ir.application:heirsAndPartitionDescription#markdown',
    defaultMessage:
      'Skrá skal netfang erfingja vegna tilkynninga skattstjóra skv. 9. og 10. gr. laga nr. 14/2004.',
    description: '',
  },
  heirsAndPartitionPrePaidDescription: {
    id: 'ir.application:heirsAndPartitionPrePaidDescription',
    defaultMessage:
      'Skrá skal netfang erfingja vegna tilkynninga skattstjóra skv. 9. og 10. gr. laga nr. 14/2004.',
    description: '',
  },
  heirsReminderToFillInSpouse: {
    id: 'ir.application:heirsReminderToFillInSpouse',
    defaultMessage: 'Athugið að passa þarf að skrá inn upplýsingar um maka.',
    description: '',
  },
  heirsName: {
    id: 'ir.application:heirsName',
    defaultMessage: 'Nafn',
    description: '',
  },
  heirsNationalId: {
    id: 'ir.application:heirsNationalId',
    defaultMessage: 'Kennitala',
    description: '',
  },
  heirsEmail: {
    id: 'ir.application:heirsEmail',
    defaultMessage: 'Netfang',
    description: '',
  },
  heirsPhone: {
    id: 'ir.application:heirsPhone',
    defaultMessage: 'Símanúmer',
    description: '',
  },
  heirsRelation: {
    id: 'ir.application:heirsRelation',
    defaultMessage: 'Tengsl við arfleifanda',
    description: '',
  },
  heirsInheritanceRate: {
    id: 'ir.application:heirsInheritanceRate',
    defaultMessage: 'Arfshlutfall (%)',
    description: '',
  },
  taxableInheritance: {
    id: 'ir.application:taxableInheritance',
    defaultMessage: 'Skattskyldur arfur',
    description: '',
  },
  taxFreeInheritance: {
    id: 'ir.application:taxFreeInheritance',
    defaultMessage: 'Óskattskyldur arfur',
    description: '',
  },
  inheritanceAmount: {
    id: 'ir.application:inheritanceAmount',
    defaultMessage: 'Fjárhæð arfshluta',
    description: '',
  },
  inheritanceTax: {
    id: 'ir.application:inheritanceTax',
    defaultMessage: 'Erfðafjárskattur',
    description: '',
  },
  inheritanceAddMember: {
    id: 'ir.application:inheritanceAddMember',
    defaultMessage: 'Bæta við erfingja',
    description: 'Inheritance step add member of estate',
  },
  inheritanceDisableMember: {
    id: 'ir.application:inheritanceDisableMember',
    defaultMessage: 'Afvirkja',
    description: 'Inheritance step disable member of estate',
  },
  inheritanceEnableMember: {
    id: 'ir.application:inheritanceEnableMember',
    defaultMessage: 'Virkja',
    description: 'Inheritance step enable member of estate',
  },
  inheritanceDeleteMember: {
    id: 'ir.application:inheritanceDeleteMember',
    defaultMessage: 'Eyða',
    description: 'Inheritance step delete member of estate',
  },
  inheritanceKtLabel: {
    id: 'ir.application:inheritanceKtLabel',
    defaultMessage: 'Kennitala',
    description: 'National id label',
  },
  inheritanceRelationLabel: {
    id: 'ir.application:inheritanceRelationLabel',
    defaultMessage: 'Tengsl',
    description: 'Relation label',
  },
  inheritanceRelationWithApplicantLabel: {
    id: 'ir.application:inheritanceRelationWithApplicantLabel',
    defaultMessage: 'Tengsl við umsækjanda',
    description: 'Relation label',
  },
  inheritanceRelationPlaceholder: {
    id: 'ir.application:inheritanceRelationPlaceholder',
    defaultMessage: 'Veldu tengsl',
    description: 'Relation placeholder',
  },
  inheritanceNameLabel: {
    id: 'ir.application:inheritanceNameLabel',
    defaultMessage: 'Nafn',
    description: 'Name label',
  },
  inheritanceForeignCitizenshipLabel: {
    id: 'ir.application:inheritanceForeignCitizenshipLabel',
    defaultMessage: 'Aðili án íslenskrar kennitölu',
    description: '',
  },
  inheritanceDayOfBirthLabel: {
    id: 'ir.application:inheritanceDayOfBirthLabel',
    defaultMessage: 'Fæðingardagur',
    description: 'Day of birth label',
  },
  inheritanceAdvocateLabel: {
    id: 'ir.application:inheritanceAdvocateLabel',
    defaultMessage: 'Forsjáraðili/málsvari/sérstakur lögráðamaður',
    description: 'Custody label',
  },
  inheritanceAdvocateLabelPrePaid: {
    id: 'ir.application:inheritanceAdvocateLabelPrePaid',
    defaultMessage: 'Forsjáraðili/málsvari/sérstakur lögráðamaður',
    description: 'Custody label',
  },
  errorSpouseCount: {
    id: 'ir.application:errorSpouseCount',
    defaultMessage: 'Aðeins er hægt að hafa einn erfingja sem maka',
    description: '',
  },
  inheritanceUnder18Error: {
    id: 'ir.application:inheritanceUnder18Error',
    defaultMessage:
      'Eftirfarandi erfingi er undir lögaldri og því er ekki hægt að halda áfram með umsókn. Vinsamlegast hafið samband við næsta sýslumannsembætti til að fá frekari upplýsingar.',
    description: '',
  },
  inheritanceUnder18ErrorAdvocate: {
    id: 'ir.application:inheritanceUnder18ErrorAdvocate',
    defaultMessage:
      'Eftirfarandi málssvari er undir lögaldri og því ekki hægt að halda áfram með umsókn. Vinsamlegast hafið samband við næsta sýslumannsembætti til að fá frekari upplýsingar.',
    description: '',
  },
  inheritanceAgeValidation: {
    id: 'ir.application:inheritanceAgeValidation',
    defaultMessage:
      'Ekki er hægt að halda áfram með umsókn þar sem erfingi undir lögaldri er skráður',
    description: '',
  },
  heirAdvocateAgeValidation: {
    id: 'ir.application:heirAdvocateAgeValidation',
    defaultMessage:
      'Ekki er hægt að halda áfram með umsókn þar sem aðili undir 18 er skráður án málssvara yfir lögaldri',
    description: '',
  },
  heirNationalIdValidation: {
    id: 'ir.application:heirNationalIdValidation',
    defaultMessage:
      'Ekki er hægt að halda áfram með umsókn þar sem erfingi má ekki vera sá sami og arfleifandi',
    description: '',
  },
  advocate: {
    id: 'ir.application:advocate',
    defaultMessage: 'Forsjáraðili',
    description: '',
  },
  advocateName: {
    id: 'ir.application:advocateName',
    defaultMessage: 'Nafn forsjáraðila',
    description: '',
  },
  addHeir: {
    id: 'ir.application:addHeir',
    defaultMessage: 'Bæta við erfingja',
    description: '',
  },
  heir: {
    id: 'ir.application:heir',
    defaultMessage: 'Erfingi',
    description: '',
  },
  representative: {
    id: 'ir.application:representative',
    defaultMessage: 'Umboðsmaður',
    description: '',
  },
  exchangeManager: {
    id: 'ir.application:exchangeManager',
    defaultMessage: 'Skiptastjóri',
    description: '',
  },
  grantors: {
    id: 'ir.application:grantors',
    defaultMessage: 'Arflátar',
    description: '',
  },
  grantorsDescription: {
    id: 'ir.application:grantorsDescription',
    defaultMessage: 'Lorem ipsum foo bar beep boop meep morp.',
    description: '',
  },
  grantor: {
    id: 'ir.application:grantor',
    defaultMessage: 'Arfláti',
    description: '',
  },
  heirs: {
    id: 'ir.application:heirs',
    defaultMessage: 'Erfingjar',
    description: '',
  },
  heirContactInfo: {
    id: 'ir.application:heirContactInfo',
    defaultMessage: 'Tengiliðaupplýsingar',
    description: '',
  },
  heirAdditionalInfo: {
    id: 'ir.application:heirAdditionalInfo',
    defaultMessage: 'Athugasemdir erfingja',
    description: '',
  },
  fileUploadPrivateTransfer: {
    id: 'ir.application:fileUploadPrivateTransfer',
    defaultMessage: 'Einkaskiptagerð',
    description: '',
  },
  fileUploadOtherDocuments: {
    id: 'ir.application:fileUploadOtherDocuments',
    defaultMessage: 'Önnur fylgigögn',
    description: '',
  },
  fileUploadOtherDocumentsPrePaid: {
    id: 'ir.application:fileUploadOtherDocumentsPrePaid',
    defaultMessage: 'Fylgigögn',
    description: '',
  },
  fileUploadOtherDocumentsPrePaidDescription: {
    id: 'ir.application:fileUploadOtherDocumentsPrePaidDescription',
    defaultMessage:
      'Samþykktar skráargerðir eru .pdf, .doc, .docx, .jpg, .jpeg, .png, .xls og .xlsx',
    description: '',
  },
  fileUploadOtherDocumentsPrePaidUserGuidelines: {
    id: 'ir.application:fileUploadOtherDocumentsPrePaidUserGuidelines#markdown',
    defaultMessage:
      'Vinsamlegast hlaðið upp önnur fylgigögn. Hægt að hlaða inn fleiri en eitt skjal.',
    description: '',
  },
  uploadPrivateTransferDescription: {
    id: 'ir.application:uploadPrivateTransferDescription',
    defaultMessage:
      'Samþykktar skráargerðir eru .pdf, .doc, .docx, .jpg, .jpeg, .png, .xls og .xlsx',
    description: '',
  },
  uploadPrivateTransferUserGuidelines: {
    id: 'ir.application:uploadPrivateTransferUserGuidelines#markdown',
    defaultMessage:
      'Vinsamlegast hlaðið upp einkaskiptagerð. Aðeins er hægt að hlaða inn 1 skjal.',
    description: '',
  },
  uploadOtherDocumentsDescription: {
    id: 'ir.application:uploadOtherDocumentsDescription',
    defaultMessage:
      'Samþykktar skráargerðir eru .pdf, .doc, .docx, .jpg, .jpeg, .png, .xls og .xlsx',
    description: '',
  },
  uploadOtherDocumentsUserGuidelines: {
    id: 'ir.application:uploadOtherDocumentsUserGuidelines#markdown',
    defaultMessage:
      'Vinsamlegast hlaðið upp önnur fylgigögn. Hægt að hlaða inn fleiri 1 skjal.',
    description: '',
  },
  heirShare: {
    id: 'ir.application:heirShare',
    defaultMessage: 'Arfur og erfðafjárskattur',
    description: '',
  },
  heirAdditionalInfoDescription: {
    id: 'ir.application:heirAdditionalInfoDescription',
    defaultMessage:
      'Skýringar og athugasemdir erfingja og/eða þess sem skilar inn erfðafjárskýrslu.',
    description: '',
  },
  heirAdditionalInfoPrePaidDescription: {
    id: 'ir.application:heirAdditionalInfoPrePaidDescription',
    defaultMessage:
      'Skýringar og athugasemdir erfingja og/eða þess sem skilar inn erfðafjárskýrslu.',
    description: '',
  },
  info: {
    id: 'ir.application:info',
    defaultMessage: 'Athugasemdir',
    description: '',
  },
  infoPlaceholder: {
    id: 'ir.application:infoPlaceholder',
    defaultMessage: 'Skráðu inn athugasemdir hér',
    description: '',
  },
  invalidShareValue: {
    id: 'ir.application:invalidShareValue',
    defaultMessage: 'Ógilt eignarhlutfall',
    description: '',
  },
  totalPercentage: {
    id: 'ir.application:totalPercentage',
    defaultMessage: 'Samtals arfshlutfall',
    description: '',
  },
  totalPercentageError: {
    id: 'ir.application:totalPercentageError',
    defaultMessage: 'Samtals arfshlutfall þarf að vera 100%',
    description: '',
  },
  overviewTotal: {
    id: 'ir.application:overviewTotal',
    defaultMessage: 'Samtals alls',
    description: '',
  },
  overviewTotalInheritance: {
    id: 'ir.application:overviewTotalInheritance',
    defaultMessage: 'Samtals erfðafjárskattur',
    description: '',
  },
  overviewPrint: {
    id: 'ir.application:overviewPrint',
    defaultMessage: 'Prenta yfirlit',
    description: '',
  },
  overviewHeirsTitle: {
    id: 'ir.application:overviewHeirsTitle',
    defaultMessage: 'Yfirlit erfingja',
    description: '',
  },
  overviewHeirsDescription: {
    id: 'ir.application:overviewHeirsDescription',
    defaultMessage: 'Yfirlit yfir erfingja og skiptingu',
    description: '',
  },

  // Done
  beforeSubmitStatement: {
    id: 'ir.application:beforeSubmitStatement#markdown',
    defaultMessage:
      'Undirritaðir erfingjar eða umboðsmenn þeirra lýsa því yfir með undirskrift sinni og leggja við drengskap sinn:\n\n1. Að á erfðafjárskýrslu þessari séu tilgreindir allir erfingjar búsins, sem þeim er kunnugt um.\n2. Að á erfðafjárskýrslu þessari komi fram tæmandi talning á eignum og skuldum búsins og að réttilega sé frá verðmæti þeirra eða matsverði greint í öllum atriðum.\n3. Að þeir taki sér á hendur einn fyrir alla og allir fyrir einn greiðslu allra skulda búsins, jafnt þeirra sem fram koma í þessari skýrslu, sem þeirra er óþekktar eru en síðar kunna að koma í ljós, svo og með sama skilorði greiðslu erfðafjárskatts.\n4. Ef við á, að gagnvart erfingjum sem eru ófjárráða eða málsvarar koma annars fram fyrir við skiptin, takast erfingjar á hendur ábyrgð á því að þeir fyrrnefndu muni ekki gjalda fyrir ábyrgð sína á skuldum búsins og gjöldum, umfram arfshluta sinn.',
    description: '',
  },
  beforeSubmitStatementPrePaid: {
    id: 'ir.application:beforeSubmitStatementPrePaid#markdown',
    defaultMessage:
      'Undirritaðir erfingjar eða umboðsmenn þeirra lýsa því yfir með undirskrift sinni og leggja við drengskap sinn:\n\n1. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel leo eu nunc varius suscipit.\n2. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel leo eu nunc varius suscipit.\n3. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel leo eu nunc varius suscipit.\n4. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc vel leo eu nunc varius suscipit.',
    description: '',
  },
  readyToSubmit: {
    id: 'ir.application:readyToSubmit',
    defaultMessage: 'Skila inn erfðafjárskýrslu',
    description: '',
  },
  inheritanceReportSubmissionCheckbox: {
    id: 'ir.application:inheritanceReportSubmissionCheckbox',
    defaultMessage: 'Ég samþykki ofangreinda yfirlýsingu',
    description: '',
  },
  submitReport: {
    id: 'ir.application:submitReport',
    defaultMessage: 'Senda inn skýrslu',
    description: '',
  },
  doneTitleEFS: {
    id: 'ir.application:doneTitleEFS',
    defaultMessage: 'Erfðafjárskýrsla móttekin',
    description: '',
  },
  doneMultiFieldTitleEFS: {
    id: 'ir.application:doneMultiFieldTitleEFS',
    defaultMessage: 'Erfðafjárskýrsla móttekin',
    description: '',
  },
  doneAlertTitleEFS: {
    id: 'ir.application:doneAlertTitleEFS',
    defaultMessage: 'Sýslumaður hefur móttekið erfðafjárskýrslu',
    description: '',
  },
  doneTitlePrepaidEFS: {
    id: 'ir.application:doneTitlePrepaidEFS',
    defaultMessage: 'Erfðafjárskýrsla um fyrirframgreiddan arf móttekin',
    description: '',
  },
  doneDescriptionEFS: {
    id: 'ir.application:doneDescriptionEFS#markdown',
    defaultMessage:
      'Sýslumaður hefur móttekið erfðafjárskýrslu. Hún verður nú yfirfarin. Ef sýslumaður staðfestir skýrsluna að þá fá erfingjar/umboðsmaður senda tilkynningu um álagningu erfðafjárskatts í pósthólf á Íslands.is. Ef sýslumaður hefur athugasemdir við innsenda skýrslu mun sýslumaður senda bréf í pósthólf erfingja inn á Ísland.is',
    description: '',
  },
  doneDescriptionPrepaidEFS: {
    id: 'ir.application:doneDescriptionPrepaidEFS#markdown',
    defaultMessage:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet urna nec nunc ultricies ultricies.',
    description: '',
  },
  bottomButtonMessagePrepaidEFS: {
    id: 'ir.application:bottomButtonMessagePrepaidEFS',
    defaultMessage:
      'Inni á Mínum síðum og í Ísland.is appinu hefur þú aðgang að þínum upplýsingum og Stafrænu pósthólfi.',
    description: '',
  },
  bottomButtonMessageEFS: {
    id: 'ir.application:bottomButtonMessageEFS',
    defaultMessage:
      'Inni á Mínum síðum og í Ísland.is appinu hefur þú aðgang að þínum upplýsingum og Stafrænu pósthólfi.',
    description: '',
  },
  errorRelation: {
    id: 'ir.application:error.errorRelation',
    defaultMessage: 'Tengsl virðast ekki vera rétt',
    description: 'Relation is invalid',
  },
  expandableHeaderEFS: {
    id: 'ir.application:expandableHeaderEFS',
    defaultMessage: 'Næstu skref',
    description: '',
  },
  expandableHeaderPrepaid: {
    id: 'ir.application:expandableHeaderPrepaid',
    defaultMessage: 'Næstu skref',
    description: '',
  },
  expandableIntroEFS: {
    id: 'ir.application:expandableIntroEFS',
    defaultMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description: '',
  },
  expandableIntroPrepaid: {
    id: 'ir.application:expandableIntroPrepaid',
    defaultMessage: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    description: '',
  },

  // Tax Free Limit
  // This will be fetched from sýslumaður API when ready
  taxFreeLimit: {
    id: 'ir.application:taxFreeLimit',
    defaultMessage: '6203409',
    description: '',
  },

  // Pre-paid inheritance relation types
  spouse: {
    id: 'ir.application:spouse',
    defaultMessage: 'Maki',
    description: '',
  },
  child: {
    id: 'ir.application:child',
    defaultMessage: 'Barn',
    description: '',
  },
  parent: {
    id: 'ir.application:parent',
    defaultMessage: 'Foreldri',
    description: '',
  },
  sibling: {
    id: 'ir.application:sibling',
    defaultMessage: 'Systkin',
    description: '',
  },
  other: {
    id: 'ir.application:other',
    defaultMessage: 'Annað',
    description: '',
  },

  // general
  yes: {
    id: 'ir.application:yes',
    defaultMessage: 'Já',
    description: '',
  },
  no: {
    id: 'ir.application:no',
    defaultMessage: 'Nei',
    description: '',
  },
  marketValue: {
    id: 'ir.application:marketValuation',
    defaultMessage: 'Markaðsverðmæti',
    description: '',
  },
  includeSpousePrePaid: {
    id: 'ir.application:includeSpouse',
    defaultMessage: 'Ráðstafa úr sameign hjúskaps',
    description: '',
  },
  includeSpousePrePaidDescription: {
    id: 'ir.application:includeSpouseDescription',
    defaultMessage:
      'Ef arfláti er í gift/ur og ráðstafa á úr sameign, þarf maki að vera með sem arfláti',
    description: '',
  },
  // Error messages
  errorPropertyNumber: {
    id: 'ir.application:error.errorPropertyNumber',
    defaultMessage:
      'Verður að innihalda 6 tölustafi eða L + 6 fyrir landeignanúmer, 7 tölustafi eða F + 7 fyrir fasteignanúmer',
    description: 'Property number is invalid',
  },
})
