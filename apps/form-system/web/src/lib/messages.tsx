import { defineMessages } from 'react-intl'

export const m = defineMessages({
  loginMessage: {
    id: 'form.system:loginLoading',
    defaultMessage: 'Er að vinna í innskráningu',
    description: 'Message shown when logging in',
  },
  unexpectedErrorTitle: {
    id: 'form.system:unexpectedErrorTitle',
    defaultMessage: 'Eitthvað fór úrskeiðis',
    description: 'Title shown when the application cannot be loaded',
  },
  unexpectedErrorSubtitle: {
    id: 'form.system:unexpectedErrorSubtitle',
    defaultMessage: 'Ekki tókst að hlaða síðunni.',
    description: 'Subtitle shown when the application cannot be loaded',
  },
  unexpectedErrorDescription: {
    id: 'form.system:unexpectedErrorDescription#markdown',
    defaultMessage:
      '* Reyndu að endurhlaða síðunni\n* Ef vandamálið heldur áfram skaltu reyna aftur síðar\n* Ef vandamálið lagast ekki getur þú sent tölvupóst á island@island.is',
    description:
      'Recovery guidance shown when the application cannot be loaded',
  },
  reloadPage: {
    id: 'form.system:reloadPage',
    defaultMessage: 'Endurhlaða síðu',
    description: 'Button that reloads the page after an unexpected error',
  },
  myApplications: {
    id: 'form.system:myApplications',
    defaultMessage: 'Fara í þínar umsóknir',
    description: 'Button that opens the user application overview',
  },
})
