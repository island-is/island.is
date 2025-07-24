import { defineMessages } from 'react-intl'

export const m = {
  info: defineMessages({
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
  }),
  validation: defineMessages({
    invalidNationalId: {
      id: 'web.landspitali.directGrants:validation.invalidNationalId',
      defaultMessage: 'Kennitala verður að vera 10 tölustafir',
      description: 'Kennitala verður að vera 10 tölustafir',
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
