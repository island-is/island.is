import { defineMessages } from 'react-intl'

export const m = defineMessages({
  // Application begin
  institutionName: {
    id: 'ir.application:institution.name',
    defaultMessage: 'Sýslumenn',
    description: 'Institution name',
  },
  draftTitle: {
    id: 'ir.application:draft.title',
    defaultMessage: 'Drög',
    description: 'Draft title',
  },
  draftDescription: {
    id: 'ir.application:draft.description',
    defaultMessage: 'Drög að ólokinni umsókn',
    description: 'Draft description',
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
  settingsInfoProviderTitle: {
    id: 'ir.application:settingsInfoProviderTitle',
    defaultMessage: 'Stillingar frá Ísland.is',
    description: '',
  },
  settingsInfoProviderSubtitle: {
    id: 'ir.application:settingsInfoProviderSubtitle',
    defaultMessage: 'Persónustillingar þínar (sími og netfang) frá Ísland.is.',
    description: '',
  },
  financialInformationProviderTitle: {
    id: 'ir.application:financialInformationProviderTitle',
    defaultMessage: 'Fjárhagsupplýsingar úr skattaskýrslu hins látna',
    description: '',
  },
  financialInformationProviderSubtitle: {
    id: 'ir.application:financialInformationProviderSubtitle',
    defaultMessage: 'vantar hér',
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
      'Vinsamlegast farðu yfir upplýsingarnar og gakktu úr skugga um að þær séu réttar.',
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
    defaultMessage: 'Skil á erfðafjárskýrslu',
    description: '',
  },
  irSubmitSubtitle: {
    id: 'ir.application:irSubmitSubtitle',
    defaultMessage:
      'Við uppgjör dánarbús þurfa erfingjarnir að fylla út erfðafjárskýrslu og skila til sýslumanns. Þú hefur valið að skila inn erfðafjárskýrslu fyrir:',
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
  propertiesTitle: {
    id: 'ir.application:propertiesTitle',
    defaultMessage: 'Eignir',
    description: '',
  },
  propertiesDescription: {
    id: 'ir.application:propertiesDescription',
    defaultMessage:
      'Vinsamlegast tilgreindu allar eignir arfleifanda utan atvinnurekstrar. Ef ekkert á við vinsamlegast haltu áfram í ferlinu.',
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
    defaultMessage: 'Til dæmis íbúðarhús, sumarhús, lóðir og jarðir',
    description: '',
  },
  inventoryTitle: {
    id: 'ir.application:inventoryTitle',
    defaultMessage: 'Innbú',
    description: '',
  },
  inventoryDescription: {
    id: 'ir.application:inventoryDescription',
    defaultMessage: 'Til dæmis bækur og málverk',
    description: '',
  },
  inventoryTextField: {
    id: 'ir.application:inventoryTextField',
    defaultMessage: 'Upplýsingar um innbú',
    description: '',
  },
  inventoryValueTitle: {
    id: 'ir.application:inventoryValueTitle',
    defaultMessage: 'Matsverð samtals',
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
    defaultMessage: 'Til dæmis ökutæki, flugvélar og skip.',
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
    defaultMessage: 'Bæta við ökutæki',
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

  // Bank Info
  estateBankInfo: {
    id: 'ir.application:estateBankInfo',
    defaultMessage: 'Innstæður í bönkum og sparisjóðum',
    description: '',
  },
  estateBankInfoDescription: {
    id: 'ir.application:estateBankInfoDescription',
    defaultMessage:
      'Innstæður í bæði innlendum og erlendum bönkum og sparisjóðum',
    description: '',
  },
  bankAccount: {
    id: 'ir.application:bankAccount',
    defaultMessage: 'Bankareikningur',
    description: '',
  },
  bankAccountBalance: {
    id: 'ir.application:bankAccountBalance',
    defaultMessage: 'Innistæða með vöxtum á dánardegi',
    description: '',
  },
  bankAccountPlaceholder: {
    id: 'ir.application:bankAccountPlaceholder',
    defaultMessage: 'xxxx - xx - xxxxxx',
    description: '',
  },
  bankAccountRepeaterButton: {
    id: 'ir.application:bankAccountRepeaterButton',
    defaultMessage: 'Bæta við bankareikning',
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
    defaultMessage: 'Útgefandi og fjárhæð með vöxtum',
    description: '',
  },
  claimsPublisher: {
    id: 'ir.application:claimsPublisher',
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
    defaultMessage: 'Bæta við verðbréfum',
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
  stocksSsn: {
    id: 'ir.application:stocksSsn',
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
    defaultMessage: 'Verðmæti á dánardegi',
    description: '',
  },
  stocksRepeaterButton: {
    id: 'ir.application:stocksRepeaterButton',
    defaultMessage: 'Bæta við hlutabréfum',
    description: '',
  },

  // Money & deposit
  moneyTitle: {
    id: 'ir.application:moneyTitle',
    defaultMessage: 'Peningar',
    description: '',
  },
  moneyDescription: {
    id: 'ir.application:moneyDescription',
    defaultMessage: 'Samtals fjárhæð peninga',
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
    defaultMessage: 'Bæta við peningum',
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
    defaultMessage: 'Til dæmis hugverkaréttindi, búseturéttur o.fl.',
    description: '',
  },
  otherAssetsText: {
    id: 'ir.application:otherAssetsText',
    defaultMessage: 'Upplýsingar um aðrar eignir',
    description: '',
  },
  otherAssetsPlaceholder: {
    id: 'ir.application:otherAssetsPlaceholder',
    defaultMessage: 'Skráðu inn upplýsingar hér',
    description: '',
  },
  otherAssetsValue: {
    id: 'ir.application:otherAssetsValue',
    defaultMessage: 'Fjárhæð á dánardegi',
    description: '',
  },
  addAsset: {
    id: 'ir.application:addAsset',
    defaultMessage: 'Bæta við öðrum eignum',
    description: '',
  },
  assetHeaderText: {
    id: 'ir.application:assetHeaderText',
    defaultMessage: 'Eign',
    description: '',
  },
})
