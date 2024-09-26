import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  lawyer: {
    id: 'judicial.system.core:info_card.civil_claimant_info.lawyer',
    defaultMessage: 'Lögmaður',
    description: 'Notaður sem titill á lögmanni kröfuhafa.',
  },
  noLawyer: {
    id: 'judicial.system.core:info_card.civil_claimant_info.no_lawyer',
    defaultMessage: 'Hefur ekki verið skráður',
    description: 'Notaður sem texti þegar lögmaður kröfuhafa er ekki skráður.',
  },
  spokesperson: {
    id: 'judicial.system.core:info_card.civil_claimant_info.spokesperson',
    defaultMessage: 'Réttargæslumaður',
    description:
      'Notaður sem titill á lögmanni kröfuhafa ef hann er réttargæslumanður.',
  },
})
