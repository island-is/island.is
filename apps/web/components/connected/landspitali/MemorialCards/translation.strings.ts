import { defineMessages } from 'react-intl'

export const m = {
  info: defineMessages({
    senderNationalIdDescription: {
      id: 'web.landspitali.memorialCard:info.senderNationalIdDescription',
      defaultMessage:
        'Með því að skrá kennitölu er hægt að nýta styrkinn til skattafsláttar. Ef ekki er skráð kennitala fæst ekki endurgreiðsla.',
      description: 'Upplýsingar um kennitölureitinn',
    },
    fundLabel: {
      id: 'web.landspitali.memorialCard:info.fundLabel',
      defaultMessage: 'Veldu nafn minningarsjóðs úr listanum',
      description: 'Veldu nafn minningarsjóðs úr listanum',
    },
    inMemoryOfLabel: {
      id: 'web.landspitali.memorialCard:info.inMemoryOfLabel',
      defaultMessage: 'Til minningar um',
      description: 'Til minningar um',
    },
    amountOfMoneyTitle: {
      id: 'web.landspitali.memorialCard:info.amountOfMoneyTitle',
      defaultMessage: 'Veldu fjárhæð',
      description: 'Veldu fjárhæð',
    },
    amountOfMoneyExtraInfo: {
      id: 'web.landspitali.memorialCard:info.amountOfMoneyExtraInfo',
      defaultMessage: 'Ath. lágmark 1.000 kr.',
      description: 'Ath. lágmark 1.000 kr.',
    },
    amountOfMoneyOtherRadioLabel: {
      id: 'web.landspitali.memorialCard:info.amountOfMoneyOtherRadioLabel',
      defaultMessage: 'Önnur fjárhæð',
      description: 'Önnur fjárhæð',
    },
    amountOfMoneyOtherInputLabel: {
      id: 'web.landspitali.memorialCard:info.amountOfMoneyOtherInputLabel',
      defaultMessage: 'Skrá aðra upphæð',
      description: 'Skrá aðra upphæð',
    },
    senderSignatureLabel: {
      id: 'web.landspitali.memorialCard:info.senderSignatureLabel',
      defaultMessage:
        'Undirskrift sendanda (Á korti stendur fyrir ofan undirskrift: "Með innilegri samúðarkveðju").',
      description:
        'Undirskrift sendanda (Á korti stendur fyrir ofan undirskrift: "Með innilegri samúðarkveðju").',
    },
    recipientLabel: {
      id: 'web.landspitali.memorialCard:info.recipientLabel',
      defaultMessage: 'Upplýsingar um viðtakanda minningarkorts',
      description: 'Upplýsingar um viðtakanda minningarkorts',
    },
    recipientNameLabel: {
      id: 'web.landspitali.memorialCard:info.recipientNameLabel',
      defaultMessage: 'Nafn viðtakanda korts',
      description: 'Nafn viðtakanda korts',
    },
    recipientAddressLabel: {
      id: 'web.landspitali.memorialCard:info.recipientAddressLabel',
      defaultMessage: 'Heimilisfang',
      description: 'Heimilisfang',
    },
    recipientPostalCodeLabel: {
      id: 'web.landspitali.memorialCard:info.recipientPostalCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Póstnúmer',
    },
    recipientPlaceLabel: {
      id: 'web.landspitali.memorialCard:info.recipientPlaceLabel',
      defaultMessage: 'Staður',
      description: 'Staður',
    },
    senderTitle: {
      id: 'web.landspitali.memorialCard:info.senderTitle',
      defaultMessage: 'Upplýsingar um greiðanda',
      description: 'Upplýsingar um greiðanda',
    },
    senderNameLabel: {
      id: 'web.landspitali.memorialCard:info.senderNameLabel',
      defaultMessage: 'Nafn',
      description: 'Nafn',
    },
    senderEmailLabel: {
      id: 'web.landspitali.memorialCard:info.senderEmailLabel',
      defaultMessage: 'Netfang',
      description: 'Netfang',
    },
    senderNationalIdLabel: {
      id: 'web.landspitali.memorialCard:info.senderNationalIdLabel',
      defaultMessage: 'Kennitala',
      description: 'Kennitala',
    },
    senderNationalIdSkippedLabel: {
      id: 'web.landspitali.memorialCard:info.senderNationalIdSkippedLabel',
      defaultMessage: 'Ég hef ekki kennitölu eða vil ekki gefa upp kennitölu',
      description: 'Ég hef ekki kennitölu eða vil ekki gefa upp kennitölu',
    },
    senderAddressLabel: {
      id: 'web.landspitali.memorialCard:info.senderAddressLabel',
      defaultMessage: 'Heimilisfang',
      description: 'Heimilisfang',
    },
    senderPostalCodeLabel: {
      id: 'web.landspitali.memorialCard:info.senderPostalCodeLabel',
      defaultMessage: 'Póstnúmer',
      description: 'Póstnúmer',
    },
    senderPlaceLabel: {
      id: 'web.landspitali.memorialCard:info.senderPlaceLabel',
      defaultMessage: 'Staður',
      description: 'Staður',
    },
    amountISKPrefix: {
      id: 'web.landspitali.memorialCard:info.amountISKPrefix',
      defaultMessage: 'Fjárhæð:',
      description: 'Fjárhæð',
    },
    amountISKCurrency: {
      id: 'web.landspitali.memorialCard:info.amountISKCurrency',
      defaultMessage: 'kr.',
      description: 'gjaldmiðill',
    },
    amountISKExtra: {
      id: 'web.landspitali.memorialCard:info.amountISKExtra',
      defaultMessage: '500 króna kostnaður bætist við',
      description: 'Texti fyrir auka kostnað',
    },
    continue: {
      id: 'web.landspitali.memorialCard:info.continue',
      defaultMessage: 'Áfram',
      description: 'Halda áfram takki',
    },
  }),
  overview: defineMessages({
    errorTitle: {
      id: 'web.landspitali.memorialCard:overview.errorTitle',
      defaultMessage: 'Villa',
      description: 'Titill á villuskilaboðum',
    },
    errorMessage: {
      id: 'web.landspitali.memorialCard:overview.errorMessage',
      defaultMessage: 'Ekki tókst að áframsenda þig á greiðslusíðuna',
      description: 'Villuskilaboð',
    },
    title: {
      id: 'web.landspitali.memorialCard:overview.title',
      defaultMessage: 'Yfirlit',
      description: 'Titill á yfirlitssíðu',
    },
    senderTitle: {
      id: 'web.landspitali.memorialCard:overview.senderTitle',
      defaultMessage: 'Greiðandi',
      description: 'Titill á upplýsingar um greiðanda',
    },
    senderName: {
      id: 'web.landspitali.memorialCard:overview.senderName',
      defaultMessage: 'Nafn:',
      description: 'Nafn',
    },
    senderNationalId: {
      id: 'web.landspitali.memorialCard:overview.senderNationalId',
      defaultMessage: 'Kennitala:',
      description: 'Kennitala',
    },
    senderAddress: {
      id: 'web.landspitali.memorialCard:overview.senderAddress',
      defaultMessage: 'Heimilisfang:',
      description: 'Heimilisfang',
    },
    senderPostalCode: {
      id: 'web.landspitali.memorialCard:overview.senderPostalCode',
      defaultMessage: 'Póstnúmer:',
      description: 'Póstnúmer',
    },
    recipientTitle: {
      id: 'web.landspitali.memorialCard:overview.recipientTitle',
      defaultMessage: 'Viðtakandi',
      description: 'Titill á upplýsingar um viðtakanda',
    },
    recipientName: {
      id: 'web.landspitali.memorialCard:overview.recipientName',
      defaultMessage: 'Nafn:',
      description: 'Nafn',
    },
    recipientAddress: {
      id: 'web.landspitali.memorialCard:overview.recipientAddress',
      defaultMessage: 'Heimilisfang:',
      description: 'Heimilisfang',
    },
    recipientPostalCode: {
      id: 'web.landspitali.memorialCard:overview.recipientPostalCode',
      defaultMessage: 'Póstnúmer:',
      description: 'Póstnúmer',
    },
    inMemoryOf: {
      id: 'web.landspitali.memorialCard:overview.inMemoryOf',
      defaultMessage: 'Til minningar um:',
      description: 'Til minningar um',
    },
    senderSignatureTitle: {
      id: 'web.landspitali.memorialCard:overview.senderSignatureTitle',
      defaultMessage: 'Sendandi',
      description: 'Titill fyrir undirskrift á korti',
    },
    senderSignature: {
      id: 'web.landspitali.memorialCard:overview.senderSignature',
      defaultMessage: 'Undirskrift á korti:',
      description: 'Undirskrift á korti',
    },
    memorialCardTitle: {
      id: 'web.landspitali.memorialCard:overview.memorialCardTitle',
      defaultMessage: 'Minningarkort',
      description: 'Minningarkort',
    },
    amountISK: {
      id: 'web.landspitali.memorialCard:overview.amountISK',
      defaultMessage: 'Upphæð:',
      description: 'Upphæð',
    },
    fund: {
      id: 'web.landspitali.memorialCard:overview.fund',
      defaultMessage: 'Sjóður:',
      description: 'Sjóður',
    },
    goBack: {
      id: 'web.landspitali.memorialCard:overview.goBack',
      defaultMessage: 'Breyta upplýsingum',
      description: 'Breyta upplýsingum',
    },
    pay: {
      id: 'web.landspitali.memorialCard:overview.pay',
      defaultMessage: 'Greiða',
      description: 'Greiða',
    },
  }),
  validation: defineMessages({
    genericFormErrorMessage: {
      id: 'web.landspitali.memorialCard:validation.genericFormErrorMessage',
      defaultMessage:
        'Það vantar upplýsingar í einn af reitunum hér fyrir ofan',
      description: 'Villuskilaboð fyrir form',
    },
    invalidNationalIdLength: {
      id: 'web.landspitali.memorialCard:validation.invalidNationalIdLength',
      defaultMessage: 'Kennitala verður að vera 10 tölustafir',
      description: 'Kennitala verður að vera 10 tölustafir',
    },
    invalidNationalIdFormat: {
      id: 'web.landspitali.memorialCard:validation.invalidNationalIdFormat',
      defaultMessage: 'Kennitala er ekki gild',
      description: 'Kennitala er ekki gild',
    },
    required: {
      id: 'web.landspitali.memorialCard:validation.required',
      defaultMessage: 'Það þarf að fylla út þennan reit',
      description: 'Villuskilaboð á óútfylltan reit',
    },
    minimumAmount: {
      id: 'web.landspitali.memorialCard:validation.minimumAmount',
      defaultMessage: 'Lágmark er 1.000 kr.',
      description: 'Villuskilaboð fyrir lágmarksupphæð',
    },
    requiredAmount: {
      id: 'web.landspitali.memorialCard:validation.requiredAmount',
      defaultMessage: 'Veldu upphæð eða sláðu inn aðra upphæð.',
      description: 'Villuskilaboð þegar ekkert er valið í fjárhæð',
    },
  }),
}
