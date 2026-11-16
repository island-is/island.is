import { defineMessages } from 'react-intl'

export const conclusionMessages = defineMessages({
  multiFieldTitle: {
    id: 'stwlr.application:conclusion.multiFieldTitle',
    defaultMessage: 'Takk fyrir að ljúka skráningunni',
    description: 'Thank you for completing the registration',
  },
  consentAlertTitle: {
    id: 'stwlr.application:conclusion.consentAlertTitle',
    defaultMessage: 'Samþykki þitt hefur nú verið sent til Sjúkratrygginga',
    description: 'Your consent has now been sent to Icelandic Health Insurance',
  },
  declineAlertTitle: {
    id: 'stwlr.application:conclusion.declineAlertTitle',
    defaultMessage: 'Höfnun þín hefur nú verið send til Sjúkratrygginga',
    description: 'Your refusal has now been sent to Icelandic Health Insurance',
  },
  consentDescription: {
    id: 'stwlr.application:conclusion.consentDescription#markdown',
    defaultMessage:
      'Með samþykkinu tekur skráning barnsins á miðlægan biðlista talmeinaþjónustu gildi.\n\nSjúkratryggingar staðfesta skráninguna og barnið raðast á biðlistann miðað við dagsetningu skráningar hjá Reykjavíkurborg.\n\nÞegar talmeinafræðingur getur tekið barnið í þjónustu er haft samband við forsjáraðila. Þú getur fylgst með stöðu skráningarinnar á Mínum síðum.\n\nStaðfesting á samþykkinu berst í rafrænt pósthólf þitt á Ísland.is.',
    description: 'Description when consent is given',
  },
  declineDescription: {
    id: 'stwlr.application:conclusion.declineDescription#markdown',
    defaultMessage: 'Texti kemur hér',
    description: 'Description when consent is declined (placeholder)',
  },
})
