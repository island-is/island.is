import { defineMessages } from 'react-intl'

export const header = defineMessages({
  tipDisclaimer: {
    id: 'judicial.system.core:header_tip_disclaimer',
    defaultMessage:
      'Erindi vegna aðgangs að Réttarvörslugátt sendast á {linkStart}{linkEnd}',
    description:
      'Notaður sem skilaboð sem segir hvert á að senda erindi vegna aðgangs í haus í öllum flæðum.',
  },
  tipDisclaimerDefenders: {
    id: 'judicial.system.core:header_tip_disclaimer_defenders',
    defaultMessage: 'Ofangreindar upplýsingar eru sóttar í félagatal LMFÍ',
    description:
      'Notaður sem skilaboð sem segir hvaðan upplýsingar í haus eru sóttar í öllum flæðum.',
  },
  defender: {
    id: 'judicial.system.core:header_defender_title',
    defaultMessage: 'lögmaður',
    description: 'Notað sem titill fyrir lögmenn í user dropdown í haus.',
  },
  feedbackButtonLabel: {
    id: 'judicial.system.core:header_feedback_button_label',
    defaultMessage: 'Senda ábendingu',
    description: 'Notaður sem texti á hnappi til að senda ábendingu.',
  },
})
