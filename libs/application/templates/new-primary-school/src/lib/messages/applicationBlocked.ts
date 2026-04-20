import { defineMessages } from 'react-intl'

export const applicationBlockedMessages = defineMessages({
  title: {
    id: 'nps.application:applicationBlocked.title',
    defaultMessage: 'Ekki hægt að halda áfram með umsókn',
    description: 'Unable to continue with the application',
  },
  description: {
    id: 'nps.application:applicationBlocked.description#markdown',
    defaultMessage:
      'Umsókn vegna barnsins er þegar í vinnslu og því ekki hægt að halda áfram að svo stöddu.\n\nEf þú þarft frekari upplýsingar skaltu hafa samband við lögheimilissveitarfélag barnsins.',
    description:
      'An application for the child is already in progress, and therefore it is not possible to continue at this time. \n\nIf you need further information, please contact the child’s municipality of legal residence.',
  },
})
