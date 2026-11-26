import { defineMessages } from 'react-intl'

export const conclusionMessages = defineMessages({
  multiFieldTitle: {
    id: 'stwlr.application:conclusion.multiFieldTitle',
    defaultMessage: 'Takk fyrir að ljúka skráningunni',
    description: 'Thank you for completing the registration',
  },
  consentAlertTitle: {
    id: 'stwlr.application:conclusion.consentAlertTitle',
    defaultMessage:
      'Barnið þitt hefur nú verið skráð á miðlægan biðlista talþjálfunar',
    description:
      'Your child has now been registered on the central speech therapy waiting list',
  },
  declineAlertTitle: {
    id: 'stwlr.application:conclusion.declineAlertTitle',
    defaultMessage: 'Höfnun þín hefur nú verið send til Sjúkratrygginga',
    description: 'Your refusal has now been sent to Icelandic Health Insurance',
  },
  consentDescription: {
    id: 'stwlr.application:conclusion.consentDescription#markdown',
    defaultMessage:
      'Með samþykkinu tekur skráning barnsins á miðlægan biðlista talþjálfunar gildi.\n\nÞegar talmeinafræðingur getur tekið barnið í þjónustu er haft samband við forsjáraðila.\n\nStaðfesting á samþykkinu berst í rafrænt pósthólf þitt á Ísland.is.',
    description: 'Description when consent is given',
  },
  declineDescription: {
    id: 'stwlr.application:conclusion.declineDescription#markdown',
    defaultMessage: 'Texti kemur hér',
    description: 'Description when consent is declined (placeholder)',
  },
})
