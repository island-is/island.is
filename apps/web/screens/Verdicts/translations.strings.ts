import { defineMessages } from 'react-intl'

export const m = {
  listPage: defineMessages({
    heading: {
      id: 'web.verdicts:listPage.heading',
      defaultMessage: 'Dómar og úrskurðir',
      description: 'H1 titill',
    },
    description: {
      id: 'web.verdicts:listPage.description',
      defaultMessage: 'Dómar frá öllum dómstigum á Íslandi',
      description: 'Lýsing',
    },
    presentings: {
      id: 'web.verdicts:listPage.presentings',
      defaultMessage: 'Reifun',
      description: 'Reifun',
    },
    loadingMoreFailed: {
      id: 'web.verdicts:listPage.loadingMoreFailed',
      defaultMessage:
        'Villa kom upp við að sækja fleiri dóma. Vinsamlegast reynið aftur síðar.',
      description: 'Villuskilaboð ef ekki tekst að sækja fleiri dóma',
    },
    seeMoreVerdicts: {
      id: 'web.verdicts:listPage.seeMoreVerdicts',
      defaultMessage: 'Sjá fleiri dóma ({remainingVerdictCount})',
      description:
        'Texti í hnapp neðst á yfirlitssíðu til að sækja fleiri dóma',
    },
    displayList: {
      id: 'web.verdicts:listPage.displayList',
      defaultMessage: 'Sýna sem lista',
      description: 'Sýna sem lista',
    },
    displayGrid: {
      id: 'web.verdicts:listPage.displayGrid',
      defaultMessage: 'Sýna sem spjöld',
      description: 'Sýna sem spjöld',
    },
  }),
  verdictPage: {
    heading: {
      id: 'web.verdicts:verdictPage.heading',
      defaultMessage: 'Dómur',
      description: 'H1 titill á síðu dóms',
    },
    print: {
      id: 'web.verdicts:verdictPage.print',
      defaultMessage: 'Prenta',
      description: 'Texti á prenta hnapp',
    },
    goBack: {
      id: 'web.verdicts:verdictPage.goBack',
      defaultMessage: 'Til baka',
      description: 'Texti á "Til baka" hnapp',
    },
    caseNumberPrefix: {
      id: 'web.verdicts:verdictPage.caseNumberPrefix',
      defaultMessage: 'Mál nr.',
      description: 'Texti á undan málsnúmeri fyrir HTML dóma',
    },
    keywords: {
      id: 'web.verdicts:verdictPage.keywords',
      defaultMessage: 'Lykilorð',
      description: 'Lykilorð',
    },
    presentings: {
      id: 'web.verdicts:verdictPage.presentings',
      defaultMessage: 'Reifun',
      description: 'Reifun',
    },
    htmlVerdictLogoUrl: {
      id: 'web.verdicts:verdictPage.htmlVerdictLogoUrl',
      defaultMessage:
        'https://images.ctfassets.net/8k0h54kbe6bj/40DkdlOOP8LT7a49ytG0vS/71bdcf876b158e860e27b1d249043798/Frame_25613.svg',
      description: 'Logo efst í HTML dómi',
    },
  },
}
