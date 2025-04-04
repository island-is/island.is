import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  submittedBy: {
    id: 'judicial.system.core:table.case_file_table.submitted_by_v2',
    defaultMessage:
      '{title} {initials, select, undefined {} other {({initials})}} {fileRepresentative, select, null {sendi inn} other {lagði fram}}',
    description: 'Notaður sem titill fyrir dagsetningu í töflum.',
  },
})
