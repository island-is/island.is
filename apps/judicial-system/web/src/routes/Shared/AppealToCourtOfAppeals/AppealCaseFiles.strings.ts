import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:appeal_case_files.title',
    defaultMessage: 'Gögn',
    description: 'Titill á Gögn ákæru síðu',
  },
  appealCaseFilesTitle: {
    id: 'judicial.system.core:appeal_case_files.appeal_case_files_title',
    defaultMessage: 'Gögn',
    description: 'Titill á upload hluta á Gögn ákæru síðu',
  },
  appealCaseFilesSubtitle: {
    id: 'judicial.system.core:appeal_case_files.appeal_case_files_subtitle',
    defaultMessage:
      'Ef ný gögn eiga að fylgja kærunni er hægt að hlaða þeim upp hér að neðan.',
    description: 'Undirtitill á Gögn ákæru síðu',
  },
  nextButtonText: {
    id: 'judicial.system.core:appeal_case_files.next_button_text',
    defaultMessage: 'Staðfesta',
    description: 'Texti á Staðfesta takka á Gögn ákæru síðu',
  },
  appealCaseFilesUpdatedModalTitle: {
    id: 'judicial.system.core:appeal_case_files.appeal_sent_modal_title',
    defaultMessage: 'Gögn hafa verið send Landsrétti',
    description: 'Titill í Gögn hafa verið send Landsrétti modal',
  },
  appealCaseFilesUpdatedModalText: {
    id: 'judicial.system.core:appeal_case_files.appeal_sent_modal_text',
    defaultMessage:
      'Tilkynning hefur verið send Landsrétti{isDefenceUser, select, true { og sækjanda} other {}}.',
    description: 'Texti í Gögn hafa verið send Landsrétti modal',
  },
})
