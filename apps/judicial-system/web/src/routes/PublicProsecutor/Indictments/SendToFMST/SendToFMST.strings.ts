import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:send_to_fmst.title',
    defaultMessage: 'Senda til fullnustu',
    description: 'Notaður sem titill á senda til fullnustu.',
  },
  fileUploadTitle: {
    id: 'judicial.system.core:send_to_fmst.file_upload_title',
    defaultMessage: 'Gögn sem þurfa að fylgja með til fullnustu',
    description: 'Notaður sem titill fyrir gagna upphlaðningu.',
  },
  fileUploadDescription: {
    id: 'judicial.system.core:send_to_fmst.file_upload_description',
    defaultMessage:
      'Ef dómur er sendur til fullnustu áður en áfrýjunarfrestur ákærða er liðinn þarf að fylgja með bréf frá verjanda.',
    description: 'Notaður sem texti fyrir gagna upphlaðningu.',
  },
  nextButtonText: {
    id: 'judicial.system.core:send_to_fmst.next_button_text',
    defaultMessage: 'Senda til fullnustu',
    description: 'Notaður sem texti í áfram takka.',
  },
  reviewerSubtitle: {
    id: 'judicial.system.core:send_to_fmst.title',
    defaultMessage:
      'Frestur til að áfrýja dómi rennur út {indictmentAppealDeadline}',
    description: 'Notaður sem undirtitill á yfirliti ákæru.',
  },
  reviewerAssignedModalTitle: {
    id: 'judicial.system.core:send_to_fmst.title',
    defaultMessage: 'Úthlutun tókst',
    description: 'Notaður sem titill á tilkynningaglugga um yfirlesara.',
  },
  reviewerAssignedModalText: {
    id: 'judicial.system.core:send_to_fmst.title',
    defaultMessage:
      'Máli {caseNumber} hefur verið úthlutað til yfirlestrar á {reviewer}.',
    description: 'Notaður sem texti í tilkynningaglugga um yfirlesara.',
  },
})
