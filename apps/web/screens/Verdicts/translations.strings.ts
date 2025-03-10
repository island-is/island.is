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
  }),
}
