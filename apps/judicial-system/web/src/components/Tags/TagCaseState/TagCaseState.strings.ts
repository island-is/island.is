import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  draft: {
    id: 'judicial.system.core:tag_case_state.draft',
    defaultMessage: 'Drög',
    description: 'Notað sem merki þegar mál í stöðu "Drög" í málalista',
  },
  sent: {
    id: 'judicial.system.core:tag_case_state.sent',
    defaultMessage: 'Sent',
    description: 'Notað sem merki þegar mál í stöðu "Sent" í málalista',
  },
  scheduled: {
    id: 'judicial.system.core:tag_case_state.scheduled',
    defaultMessage: 'Á dagskrá',
    description: 'Notað sem merki þegar mál í stöðu "Á dagskrá" í málalista',
  },
  inactive: {
    id: 'judicial.system.core:tag_case_state.inactive',
    defaultMessage: 'Lokið',
    description: 'Notað sem merki þegar mál í stöðu "Lokið" í málalista',
  },
  active: {
    id: 'judicial.system.core:tag_case_state.active',
    defaultMessage: 'Virkt',
    description: 'Notað sem merki þegar mál í stöðu "Virkt" í málalista',
  },
  accepted: {
    id: 'judicial.system.core:tag_case_state.accepted',
    defaultMessage: 'Samþykkt',
    description: 'Notað sem merki þegar mál í stöðu "Samþykkt" í málalista',
  },
  rejected: {
    id: 'judicial.system.core:tag_case_state.rejected',
    defaultMessage: 'Hafnað',
    description: 'Notað sem merki þegar mál í stöðu "Hafnað" í málalista',
  },
  dismissed: {
    id: 'judicial.system.core:tag_case_state.dismissed',
    defaultMessage: 'Vísað frá',
    description: 'Notað sem merki þegar mál í stöðu "Vísað frá" í málalista',
  },
  unknown: {
    id: 'judicial.system.core:tag_case_state.unknown',
    defaultMessage: 'Óþekkt',
    description: 'Notað sem merki þegar mál í stöðu "Óþekkt" í málalista',
  },
  reassignment: {
    id: 'judicial.system.core:tag_case_state.reassignment',
    defaultMessage: 'Endurúthlutun',
    description:
      'Notað sem merki þegar mál í stöðu "Endurúthlutun" í málalista',
  },
  new: {
    id: 'judicial.system.core:tag_case_state.new',
    defaultMessage: 'Nýtt',
    description: 'Notað sem merki þegar mál í stöðu "Nýtt" í málalista',
  },
  received: {
    id: 'judicial.system.core:tag_case_state.received',
    defaultMessage: 'Móttekið',
    description: 'Notað sem merki þegar mál í stöðu "Móttekið" í málalista',
  },
  postponedUntilVerdict: {
    id: 'judicial.system.core:tag_case_state.postponed_until_verdict',
    defaultMessage: 'Dómtekið',
    description: 'Notað sem merki þegar mál í stöðu "Dómtekið" í málalista',
  },
  completed: {
    id: 'judicial.system.core:tag_case_state.completed_v3',
    defaultMessage:
      '{indictmentRulingDecision, select, RULING {Dómur} FINE {Viðurlagaákvörðun} DISMISSAL {Frávísun} CANCELLATION {Niðurfelling} MERGE {Sameinað} WITHDRAWAL {Afturkallað} other {Lokið}}',
    description: 'Notað sem merki þegar mál í stöðu "Dómþulur" í málalista',
  },
  recalled: {
    id: 'judicial.system.core:tag_case_state.cancelled',
    defaultMessage: 'Afturkallað',
    description: 'Notað sem merki þegar mál í stöðu "Afturkallað" í málalista',
  },
  notYetServiced: {
    id: 'judicial.system.core:tag_case_state.not_yet_serviced',
    defaultMessage: 'Óbirt',
    description: 'Notað sem merki þegar mál í stöðu "Óbirt" í málalista',
  },
})
