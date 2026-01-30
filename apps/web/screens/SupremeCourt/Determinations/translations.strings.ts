import { defineMessages } from 'react-intl'

export const m = {
  listPage: defineMessages({
    heading: {
      id: 'web.supremeCourt.determinations:listPage.heading',
      defaultMessage: 'Ákvarðanir',
      description: 'H1 titill á listasíðu',
    },
  }),
  detailsPage: defineMessages({
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
