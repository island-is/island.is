import { defineMessages } from 'react-intl'

export const m = {
  listPage: defineMessages({
    heading: {
      id: 'web.supremeCourt.appeals:listPage.heading',
      defaultMessage: 'Áfrýjuð mál',
      description: 'H1 titill á listasíðu',
    },
    appealPolicyDatePrefix: {
      id: 'web.supremeCourt.appeals:listPage.appealPolicyDatePrefix',
      defaultMessage: 'Útgáfa áfrýjunarstefnu:',
      description: 'Texti á undan útgáfu áfrýjunarstefnu',
    },
    registrationDatePrefix: {
      id: 'web.supremeCourt.appeals:listPage.registrationDatePrefix',
      defaultMessage: 'Skráð:',
      description: 'Texti á undan skráningardagsetningu',
    },
    verdictDateInFuturePrefix: {
      id: 'web.supremeCourt.appeals:listPage.verdictDateInFuturePrefix',
      defaultMessage: 'Mál sett á dagskrá:',
      description: 'Texti á undan dagsetningu sem mál er sett á dagskrá',
    },
    verdictDateInPastSuffix: {
      id: 'web.supremeCourt.appeals:listPage.verdictDateInPastSuffix',
      defaultMessage: 'Málið var flutt:',
      description: 'Texti á undan dagsetningu sem mál var flutt',
    },
  }),
}
