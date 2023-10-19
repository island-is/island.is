import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // Application begin
  applicationName: {
    id: 'ir.application:applicationName',
    defaultMessage: 'Erfðafjárskýrsla eftir andlát',
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
  funeralExpensesTitle: {
    id: 'ir.application:funeralExpensesTitle',
    defaultMessage: 'Yfirlit um útfararkostnað',
    description: '',
  },
  funeralExpensesSubtitle: {
    id: 'ir.application:funeralExpensesSubtitle',
    defaultMessage:
      'Athugað er hvort að skráningaraðili sé búinn að fylla út yfirlit um útfararkostnað',
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
  name: {
    id: 'ir.application:name',
    defaultMessage: 'Nafn',
    description: '',
  },
  nationalId: {
    id: 'ir.application:nationalId',
    defaultMessage: 'Kennitala',
    description: '',
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
  email: {
    id: 'ir.application:email',
    defaultMessage: 'Netfang',
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
  propertiesDescription: {
    id: 'ir.application:propertiesDescription',
    defaultMessage:
      'Vinsamlegast tilgreindu allar hjúskapareignir beggja hjóna utan einstaklingsatvinnurekstrar á dánardegi hins látna. Einnig séreign hins látna.',
    description: '',
  },
  continueWithoutAssests: {
    id: 'ir.application:continueWithoutAssests',
    defaultMessage:
      'Ef hinn látni átti ekki fasteign vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  continueWithoutVehicles: {
    id: 'ir.application:continueWithoutVehicles',
    defaultMessage:
      'Ef hinn látni átti ekki farartæki vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  continueWithoutGuns: {
    id: 'ir.application:continueWithoutGuns',
    defaultMessage:
      'Ef hinn látni átti ekki skotvopn vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  continueWithoutInnventory: {
    id: 'ir.application:continueWithoutInnventory',
    defaultMessage:
      'Ef hinn látni átti ekki innbú vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  continueWithoutBankAccounts: {
    id: 'ir.application:continueWithoutBankAccounts',
    defaultMessage:
      'Ef hinn látni átti ekki innstæður í bönkum vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  continueWithoutClaims: {
    id: 'ir.application:continueWithoutClaims',
    defaultMessage:
      'Ef hinn látni átti ekki verðbréf eða kröfur vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  continueWithoutStocks: {
    id: 'ir.application:continueWithoutStocks',
    defaultMessage:
      'Ef hinn látni átti ekki hlutabréf vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  continueWithoutMoney: {
    id: 'ir.application:continueWithoutMoney',
    defaultMessage:
      'Ef hinn látni átti ekki peninga sem varðveittir eru utan fjármálastofnana vinsamlegast haltu áfram í ferlinu.',
    description: '',
  },
  continueWithoutOtherAssets: {
    id: 'ir.application:continueWithoutOtherAssets',
    defaultMessage:
      'Ef hinn látni átti ekki aðrar eignir vinsamlegast haltu áfram í ferlinu.',
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
    defaultMessage: 'Skráninganúmer ökutækis',
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
  bankAccountBalance: {
    id: 'ir.application:bankAccountBalance',
    defaultMessage: 'Innstæða með vöxtum á dánardegi',
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
    id: 'ir.application:stocksDescription',
    defaultMessage: 'Nafn og kennitala ef um einstakling er að ræða.',
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
    defaultMessage: 'Nafnverð',
    description: '',
  },
  stocksRateOfChange: {
    id: 'ir.application:stocksRateOfChange',
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
  moneyDescription: {
    id: 'ir.application:moneyDescription',
    defaultMessage: 'Peningar sem varðveittir eru utan fjármálastofnanna.',
    description: '',
  },
  moneyText: {
    id: 'ir.application:moneyText',
    defaultMessage: 'Upplýsingar um peninga',
    description: '',
  },
  moneyPlaceholder: {
    id: 'ir.application:moneyPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar hér',
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
  assetOverview: {
    id: 'ir.application:assetOverview',
    defaultMessage: 'Yfirlit eigna',
    description: '',
  },
  debtsOverview: {
    id: 'ir.application:debtsOverview',
    defaultMessage: 'Yfirlit skulda',
    description: '',
  },
  assetOverviewDescription: {
    id: 'ir.application:assetOverviewDescription',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
    description: '',
  },
  realEstateEstimation: {
    id: 'ir.application:realEstateEstimation',
    defaultMessage: 'Fasteignamat samtals á dánardegi',
    description: '',
  },
  marketValue: {
    id: 'ir.application:marketValue',
    defaultMessage: 'Markaðsverð samtals á dánardegi',
    description: '',
  },
  totalValue: {
    id: 'ir.application:totalValue',
    defaultMessage: 'Verðmæti samtals á dánardegi',
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
    defaultMessage: 'Útfarakostnaður',
    description: '',
  },
  funeralCostDescription: {
    id: 'ir.application:funeralCostDescription',
    defaultMessage: 'Útfarakostnaður samkvæmt yfirlit um útfarakostnað.',
    description: '',
  },
  amount: {
    id: 'ir.application:funeralCostAmount',
    defaultMessage: 'Fjárhæð',
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

  // Heirs
  spousesShare: {
    id: 'ir.application:spousesShare',
    defaultMessage: 'Búshluti eftirlifandi maka',
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
  totalDeduction: {
    id: 'ir.application:totalDeduction',
    defaultMessage: 'Samtals frádráttur (búshluti maka)',
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
  heirsAndPartition: {
    id: 'ir.application:heirsAndPartition',
    defaultMessage: 'Erfingjar og skipting',
    description: '',
  },
  heirsAndPartitionDescription: {
    id: 'ir.application:heirsAndPartitionDescription',
    defaultMessage:
      'Skrá skal netfang erfingja vegna tilkynninga skattstjóra skv. 9. og 10. gr. laga nr. 14/2004.',
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
  heirs: {
    id: 'ir.application:heirs',
    defaultMessage: 'Erfingjar',
    description: '',
  },
  heirAdditionalInfo: {
    id: 'ir.application:heirAdditionalInfo',
    defaultMessage: 'Athugasemdir erfingja',
    description: '',
  },
  heirAdditionalInfoDescription: {
    id: 'ir.application:heirAdditionalInfoDescription',
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

  // Done
  submitReport: {
    id: 'ir.application:submitReport',
    defaultMessage: 'Senda inn skýrslu',
    description: '',
  },
  doneTitle: {
    id: 'ir.application:doneTitle',
    defaultMessage: 'Erfðafjárskýrsla móttekin',
    description: '',
  },
  doneDescription: {
    id: 'ir.application:doneDescription',
    defaultMessage:
      'Sýslumaður hefur móttekið erfðafjárskýrslu. Hún verður nú yfirfarin. Ef sýslumaður staðfestir skýrsluna að þá fá erfingjar/umboðsmaður senda tilkynningu um álagningu erfðafjárskatts í pósthólf á Íslands.is. Ef sýslumaður hefur athugasemdir við innsenda skýrslu mun sýslumaður senda bréf í pósthólf erfingja inn á Ísland.is',
    description: '',
  },

  // Tax Free Limit
  taxFreeLimit: {
    id: 'ir.application:taxFreeLimit',
    defaultMessage: '5757759',
    description: '',
  },
})
