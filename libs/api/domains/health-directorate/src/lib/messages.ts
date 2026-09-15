import { defineMessages } from 'react-intl'

export const m = defineMessages({
  webChatTitle: {
    id: 'api.health-directorate:web-chat-title',
    defaultMessage: 'Ráðgjöf í netspjalli Heilsuveru',
  },
  webChatStatusOpen: {
    id: 'api.health-directorate:web-chat-status-open',
    defaultMessage: 'Opið núna.',
  },
  webChatStatusClosed: {
    id: 'api.health-directorate:web-chat-status-closed',
    defaultMessage: 'Lokað núna.',
  },
  webChatDescription: {
    id: 'api.health-directorate:web-chat-description',
    defaultMessage: '{status} Opið frá 8:00 til 15:30 virka daga.',
  },
  webChatUrl: {
    id: 'api.health-directorate:web-chat-url',
    defaultMessage: 'https://direct.lc.chat/15092154',
  },
  instructionsGeneralAssistance: {
    id: 'api.health-directorate:instructions-general-assistance',
    defaultMessage:
      'Lýstu stuttlega ástæðu, helstu einkennum og tímalengd. Við aðstoðum þig eftir eðli erindis, t.d. með tímabókun, símtali eða ráðgjöf.',
  },
  instructionsMedication: {
    id: 'api.health-directorate:instructions-medication',
    defaultMessage:
      'Lýstu stuttlega erindi. Athugið að endurnýjun lyfja fer fram í [Lyf og endurnýjanir](/minarsidur/heilsa/lyf/lyfjaavisanir).',
  },
  instructionsCertificate: {
    id: 'api.health-directorate:instructions-certificate',
    defaultMessage:
      'Hér er hægt að sækja um fjarvistarvottorð vegna atvinnu eða skóla.',
  },
  instructionsReferral: {
    id: 'api.health-directorate:instructions-referral',
    defaultMessage:
      'Lýstu erindinu. Athugið að nýjar beiðnir/tilvísanir þurfa jafnan mat fagaðila.',
  },
})
