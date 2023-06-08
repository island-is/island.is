import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:appeal_case_files_overview.appeal_files_title',
    defaultMessage: 'Skjöl kærumáls',
    description:
      'Titill á skjöl kærumáls hlutanum á yfirlitsskjá afgreiddra mála hjá Landsrétti',
  },
  submittedBy: {
    id: 'judicial.system.core:appeal_case_files_overview.submitted_by',
    defaultMessage:
      '{filesCategory, select, true {Sækjandi } other {Varnaraðili }} lagði fram',
    description:
      'Titill á hver lagði skjöl kærumáls á yfirlitsskjá afgreiddra mála hjá Landsrétti',
  },
})
