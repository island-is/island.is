import { defineMessages } from 'react-intl'

// Strings on login screen
export const login = {
  general: defineMessages({
    heading: {
      id: 'judicial.system:login.heading',
      defaultMessage: 'Skráðu þig inn í Réttarvörslugátt',
      description: 'Login screen: Heading',
    },
    description: {
      id: 'judicial.system:login.description',
      defaultMessage:
        'Notaðu rafræn skilríki til þess að skrá þig inn. Passaðu upp á að það sé kveikt á símanum eða hann sé ólæstur.',
      description: 'Login screen: Description',
    },
    buttonLabel: {
      id: 'judicial.system:login.buttonLabel',
      defaultMessage: 'Innskráning',
      description: 'Login screen: Button label',
    },
  }),
  error: {
    failed: defineMessages({
      title: {
        id: 'judicial.system:login.error.failed.title',
        defaultMessage: 'Innskráning ógild',
        description: 'Login screen: Error login failed title',
      },
      message: {
        id: 'judicial.system:login.error.failed.message',
        defaultMessage:
          'Innskráning tókst ekki. Ertu viss um að þú hafir slegið inn rétt símanúmer?',
        description: 'Login screen: Error login failed message',
      },
    }),
    unAuthenticated: defineMessages({
      title: {
        id: 'judicial.system:login.error.unAuthenticated.title',
        defaultMessage: 'Innskráning tókst ekki',
        description: 'Login screen: Error login unauthenticated title',
      },
      message: {
        id: 'judicial.system:login.error.unAuthenticated.message',
        defaultMessage:
          'Innskráning ekki lengur gild. Vinsamlegast reynið aftur.',
        description: 'Login screen: Error login unauthenticated message',
      },
    }),
    unAuthorized: defineMessages({
      title: {
        id: 'judicial.system:login.error.unAuthorized.title',
        defaultMessage: 'Þú ert ekki með aðgang',
        description: 'Login screen: Error login unauthorized title',
      },
      message: {
        id: 'judicial.system:login.error.unAuthorized.message',
        defaultMessage: 'Skráðu þig inn í Réttarvörslugátt',
        description:
          'Þú hefur ekki fengið aðgang að Réttarvörslugátt. Ef þú telur þig eiga að hafa aðgang þarft þú að hafa samband við viðeigandi stjórnanda eða notendaþjónustu hjá þinni starfsstöð.',
      },
    }),
  },
}
