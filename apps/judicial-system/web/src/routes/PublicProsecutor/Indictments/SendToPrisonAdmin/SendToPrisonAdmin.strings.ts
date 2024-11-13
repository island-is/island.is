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
  modalTitle: {
    id: 'judicial.system.core:send_to_fmst.modal_title',
    defaultMessage: 'Senda til fullnustu',
    description:
      'Notaður sem titill á tilkynningarglugga um að senda til fullnustu.',
  },
  modalText: {
    id: 'judicial.system.core:send_to_fmst.modal_text',
    defaultMessage:
      'Mál {courtCaseNumber} verður sent til Fangelsismálastofnunar til fullnustu.\nÁkærði: {defendant}.',
    description:
      'Notaður sem texti á tilkynningarglugga um að senda til fullnustu',
  },
  modalNextButtonText: {
    id: 'judicial.system.core:send_to_fmst.modal_next_button_text',
    defaultMessage: 'Senda núna',
    description:
      'Notaður sem texti í takka á tilkynningarglugga um að senda til fullnustu',
  },
})
