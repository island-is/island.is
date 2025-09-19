import { defineMessages } from 'react-intl'

export const m = {
  info: defineMessages({
    senderNationalIdDescription: {
      id: 'web.landspitali.directGrants:info.senderNationalIdDescription',
      defaultMessage:
        'Með því að skrá kennitölu er hægt að nýta styrkinn til skattafsláttar. Ef ekki er skráð kennitala fæst ekki endurgreiðsla.',
      description: 'Upplýsingar um kennitölureitinn',
    },
    grantLabel: {
      id: 'web.landspitali.directGrants:info.grantLabel',
      defaultMessage: 'Veldu nafn styrktarsjóðs úr listanum',
      description: 'Veldu nafn styrktarsjóðs úr listanum',
    },
    projectTitle: {
      id: 'web.landspitali.directGrants:info.projectTitle',
      defaultMessage: 'Veldu verkefni',
      description: 'Veldu verkefni',
    },
    amountOfMoneyTitle: {
      id: 'web.landspitali.directGrants:info.amountOfMoneyTitle',
      defaultMessage: 'Veldu fjárhæð',
      description: 'Veldu fjárhæð',
    },
    amountOfMoneyOtherRadioLabel: {
      id: 'web.landspitali.directGrants:info.amountOfMoneyOtherRadioLabel',
      defaultMessage: 'Önnur fjárhæð',
      description: 'Önnur fjárhæð',
    },
    amountOfMoneyOtherInputLabel: {
      id: 'web.landspitali.directGrants:info.amountOfMoneyOtherInputLabel',
      defaultMessage: 'Skrá aðra upphæð',
      description: 'Skrá aðra upphæð',
    },
    senderTitle: {
      id: 'web.landspitali.directGrants:info.senderTitle',
      defaultMessage: 'Upplýsingar um greiðanda',
      description: 'Upplýsingar um greiðanda',
    },
    senderNameLabel: {
      id: 'web.landspitali.directGrants:info.senderNameLabel',
      defaultMessage: 'Nafn',
      description: 'Nafn',
    },
    senderEmailLabel: {
      id: 'web.landspitali.directGrants:info.senderEmailLabel',
      defaultMessage: 'Netfang',
      description: 'Netfang',
    },
    senderNationalIdLabel: {
      id: 'web.landspitali.directGrants:info.senderNationalIdLabel',
      defaultMessage: 'Kennitala',
      description: 'Kennitala',
    },
    senderAddressLabel: {
      id: 'web.landspitali.directGrants:info.senderAddressLabel',
      defaultMessage: 'Heimilisfang',
      description: 'Heimilisfang',
    },
    senderPostalCodeLabel: {
      id: 'web.landspitali.directGrants:info.senderPostalCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Póstnúmer',
    },
    senderPlaceLabel: {
      id: 'web.landspitali.directGrants:info.senderPlaceLabel',
      defaultMessage: 'Staður',
      description: 'Staður',
    },
    senderNationalIdSkippedLabel: {
      id: 'web.landspitali.directGrants:info.senderNationalIdSkippedLabel',
      defaultMessage: 'Ég hef ekki kennitölu eða vil ekki gefa upp kennitölu',
      description: 'Ég hef ekki kennitölu eða vil ekki gefa upp kennitölu',
    },
    senderGrantExplanation: {
      id: 'web.landspitali.directGrants:info.senderGrantExplanation',
      defaultMessage: 'Skýring á styrk',
      description: 'Skýring á styrk',
    },
    amountISKPrefix: {
      id: 'web.landspitali.directGrants:info.amountISKPrefix',
      defaultMessage: 'Fjárhæð:',
      description: 'Fjárhæð',
    },
    amountISKCurrency: {
      id: 'web.landspitali.directGrants:info.amountISKCurrency',
      defaultMessage: 'kr.',
      description: 'gjaldmiðill',
    },
    amountISKExtra: {
      id: 'web.landspitali.directGrants:info.amountISKExtra',
      defaultMessage: '500 króna kostnaður bætist við',
      description: 'Texti fyrir auka kostnað',
    },
    pay: {
      id: 'web.landspitali.directGrants:info.pay',
      defaultMessage: 'Greiða',
      description: 'Halda áfram í greiðslu takki',
    },
    continuingEducationProject: {
      id: 'web.landspitali.directGrants:info.continuingEducationProject',
      defaultMessage: 'Endurmenntun',
      description: 'Endurmenntun',
    },
    researchProject: {
      id: 'web.landspitali.directGrants:info.researchProject',
      defaultMessage: 'Rannsóknir',
      description: 'Rannsóknir',
    },
    equipmentPurchaseProject: {
      id: 'web.landspitali.directGrants:info.equipmentPurchaseProject',
      defaultMessage: 'Tækjakaup',
      description: 'Tækjakaup',
    },
    otherProjects: {
      id: 'web.landspitali.directGrants:info.otherProjects',
      defaultMessage: 'Önnur verkefni',
      description: 'Önnur verkefni',
    },
  }),
  validation: defineMessages({
    genericFormErrorMessage: {
      id: 'web.landspitali.directGrants:validation.genericFormErrorMessage',
      defaultMessage:
        'Það vantar upplýsingar í einn af reitunum hér fyrir ofan',
      description: 'Villuskilaboð fyrir form',
    },
    errorTitle: {
      id: 'web.landspitali.directGrants:validation.errorTitle',
      defaultMessage: 'Villa',
      description: 'Titill á villuskilaboðum',
    },
    errorMessage: {
      id: 'web.landspitali.directGrants:validation.errorMessage',
      defaultMessage: 'Ekki tókst að áframsenda þig á greiðslusíðuna',
      description: 'Villuskilaboð',
    },
    invalidNationalIdLength: {
      id: 'web.landspitali.directGrants:validation.invalidNationalIdLength',
      defaultMessage: 'Kennitala verður að vera 10 tölustafir',
      description: 'Kennitala verður að vera 10 tölustafir',
    },
    invalidNationalIdFormat: {
      id: 'web.landspitali.directGrants:validation.invalidNationalIdFormat',
      defaultMessage: 'Kennitala er ekki gild',
      description: 'Kennitala er ekki gild',
    },
    invalidEmail: {
      id: 'web.landspitali.directGrants:validation.invalidEmail',
      defaultMessage: 'Netfang er ekki gilt',
      description: 'Netfang er ekki gilt',
    },
    required: {
      id: 'web.landspitali.directGrants:validation.required',
      defaultMessage: 'Það þarf að fylla út þennan reit',
      description: 'Villuskilaboð á óútfylltan reit',
    },
    minimumAmount: {
      id: 'web.landspitali.directGrants:validation.minimumAmount',
      defaultMessage: 'Lágmark er 1.000 kr.',
      description: 'Villuskilaboð fyrir lágmarksupphæð',
    },
    requiredAmount: {
      id: 'web.landspitali.directGrants:validation.requiredAmount',
      defaultMessage: 'Veldu upphæð eða sláðu inn aðra upphæð.',
      description: 'Villuskilaboð þegar ekkert er valið í fjárhæð',
    },
    requiredProject: {
      id: 'web.landspitali.directGrants:validation.requiredProject',
      defaultMessage: 'Vinsamlegast veldu verkefni',
      description: 'Villuskilaboð þegar ekkert er valið í fjárhæð',
    },
  }),
}
