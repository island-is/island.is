import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  submittedBy: {
    id: 'judicial.system.core:appeal_case_files_overview.submitted_by',
    defaultMessage:
      '{filesCategory, select, true {Sækjandi } other {Varnaraðili }} lagði fram',
    description:
      'Titill á hver lagði skjöl kærumáls á yfirlitsskjá afgreiddra mála hjá Landsrétti',
  },
  addFiles: {
    id: 'judicial.system.core:appeal_case_files_overview.add_files',
    defaultMessage: 'Bæta við gögnum',
    description:
      'Takkinn til að bæta við gögnum kærumáls á yfirlitsskjá kærumála',
  },
})
