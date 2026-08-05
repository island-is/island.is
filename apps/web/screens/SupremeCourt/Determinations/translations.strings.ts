import { defineMessages } from 'react-intl'

export const m = {
  listPage: defineMessages({
    errorTitle: {
      id: 'web.supremeCourt.determinations:listPage.errorTitle',
      defaultMessage: 'Villa',
      description: 'Titill á villumeðhöndlun á listasíðu',
    },
    error: {
      id: 'web.supremeCourt.determinations:listPage.error',
      defaultMessage: 'Ekki tókst að sækja ákvarðanir',
      description: 'Texti á villumeðhöndlun á listasíðu',
    },
    all: {
      id: 'web.supremeCourt.determinations:listPage.all',
      defaultMessage: 'Allt',
      description: 'Texti á "Allt" tagi',
    },
    searchPlaceholder: {
      id: 'web.supremeCourt.determinations:listPage.searchPlaceholder',
      defaultMessage: 'Leita í ákvörðunum',
      description: 'Placeholder á leitar input',
    },
    heading: {
      id: 'web.supremeCourt.determinations:listPage.heading',
      defaultMessage: 'Ákvarðanir',
      description: 'H1 titill á listasíðu',
    },
  }),
  detailsPage: defineMessages({
    resolutionLink: {
      id: 'web.supremeCourt.determinations:detailsPage.resolutionLink',
      defaultMessage: 'Úrlausn Landsréttar / Héraðsdóms',
      description: 'Texti á "Úrlausn Landsréttar / Héraðsdóms" hnapp',
    },
    caseNumberPrefix: {
      id: 'web.supremeCourt.determinations:detailsPage.caseNumberPrefix',
      defaultMessage: 'Mál nr.',
      description: 'Texti á undan málsnúmeri fyrir HTML dóma',
    },
    court: {
      id: 'web.supremeCourt.determinations:detailsPage.court',
      defaultMessage: 'Hæstiréttur Íslands',
      description: 'Texti á undan málsnúmeri fyrir HTML dóma',
    },
    logoUrl: {
      id: 'web.supremeCourt.determinations:detailsPage.logoUrl',
      defaultMessage:
        'https://images.ctfassets.net/8k0h54kbe6bj/40DkdlOOP8LT7a49ytG0vS/71bdcf876b158e860e27b1d249043798/Frame_25613.svg',
      description: 'URL á logo fyrir HTML dóma',
    },
    keywords: {
      id: 'web.supremeCourt.determinations:detailsPage.keywords',
      defaultMessage: 'Lykilorð',
      description: 'Texti á undan málsgreiningum fyrir HTML dóma',
    },
    presentings: {
      id: 'web.supremeCourt.determinations:detailsPage.presentings',
      defaultMessage: 'Reifun',
      description: 'Texti á undan reifunum fyrir HTML dóma',
    },
  }),
}
