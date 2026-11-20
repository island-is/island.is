import { defineMessages } from 'react-intl'

export const childMessages = defineMessages({
  sectionTitle: {
    id: 'stwlr.application:child.sectionTitle',
    defaultMessage: 'Barn',
    description: 'Child',
  },
  description: {
    id: 'stwlr.application:child.description#markdown',
    defaultMessage:
      'Hér staðfestir þú skráningu barnsins á miðlægan biðlista talmeinaþjónustu hjá Sjúkratryggingum.\n\nBiðlistinn er sameiginlegur fyrir allt landið. Þegar talmeinafræðingur losnar er haft samband við forsjáraðila í þeirri röð sem skráningar berast. Skráningin tekur gildi þegar forsjáraðili hefur veitt samþykki sitt hér.\n\nUpplýsingar um barnið eru sóttar sjálfkrafa úr Þjóðskrá og frá skráningaraðila. Ef eitthvað er rangt skaltu hafa samband við Sjúkratryggingar áður en þú heldur áfram.',
    description: 'Description',
  },
  address: {
    id: 'stwlr.application:child.address',
    defaultMessage: 'Heimilisfang',
    description: 'Address',
  },
  municipality: {
    id: 'stwlr.application:child.municipality',
    defaultMessage: 'Sveitarfélag',
    description: 'Municipality',
  },
  waitingListConsentYes: {
    id: 'stwlr.application:child.waitingListConsentYes',
    defaultMessage: 'Ég samþykki skráningu á biðlista',
    description: 'I consent to registration on the waiting list',
  },
  waitingListConsentNo: {
    id: 'stwlr.application:child.waitingListConsentNo',
    defaultMessage: 'Ég hafna skráningu á biðlista',
    description: 'I refuse registration on the waiting list',
  },
  waitingListDeclineReason: {
    id: 'stwlr.application:child.waitingListDeclineReason',
    defaultMessage: 'Ástæða',
    description: 'Reason',
  },
  waitingListDeclineReasonPlaceholder: {
    id: 'stwlr.application:child.waitingListDeclineReasonPlaceholder',
    defaultMessage: 'Veldu ástæðu',
    description: 'Select reason',
  },
})
