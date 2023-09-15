import { defineMessages } from 'react-intl'

export const tagCaseState = defineMessages({
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
})
