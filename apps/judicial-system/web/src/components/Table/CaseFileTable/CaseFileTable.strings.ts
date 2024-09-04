import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  submittedBy: {
    id: 'judicial.system.core:table.case_file_table.submitted_by',
    defaultMessage:
      '{category, select, PROSECUTOR_CASE_FILE {Sækjandi} other {Verjandi}} {initials, select, undefined {} other {({initials})}} lagði fram',
    description: 'Notaður sem titill fyrir dagsetningu í töflum.',
  },
})
