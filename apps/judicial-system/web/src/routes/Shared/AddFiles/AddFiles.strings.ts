import { defineMessage } from 'react-intl'

export const strings = {
  heading: defineMessage({
    id: 'judicial.system.core:add_files.heading',
    defaultMessage: 'Gögn',
    description: 'Notaður sem titill á Bæta við gögnum síðu í ákærum.',
  }),
  uploadFilesHeading: {
    id: 'judicial.system.core:add_files.upload_files_heading',
    defaultMessage: 'Hlaða upp gögnum',
    description:
      'Notaður sem titill í Innsending gagna til dómsins hluta á Gögn síðu í ákærum.',
  },
  uploadFilesDescription: {
    id: 'judicial.system.core:add_files.upload_files_description',
    defaultMessage: 'Gögnin verða að hafa lýsandi skráarheiti.',
    description:
      'Notaður sem texti í Innsending gagna til dómsins hluta á Gögn síðu í ákærum.',
  },
  uploadFilesRepresentativeSelectionTitle: {
    id: 'judicial.system.core:add_files.upload_files_representative_selection_title',
    defaultMessage: 'Hver lagði skjölin fram?',
    description:
      'Notaður sem titill þar sem aðili sem lagði fram gögn er valinn á Gögn síðu í ákærum.',
  },
  caseRepresentativeLabel: {
    id: 'judicial.system.core:add_files.case_representative_label',
    defaultMessage: 'Hvaða aðili máls lagði skjölin fram?',
    description:
      'Notaður sem titill á innsláttarsvæði til að velja aðila sem lagði gögnin fram á Gögn síðu í ákærum.',
  },
  caseRepresentativePlaceholder: {
    id: 'judicial.system.core:add_files.case_representative_placeholder',
    defaultMessage: 'Veldu aðila',
    description:
      'Notaður sem upplýsingatexti á innsláttarsvæði til að velja aðila sem lagði gögnin fram á Gögn síðu í ákærum.',
  },
  nextButtonText: {
    id: 'judicial.system.core:add_files.next_button_text',
    defaultMessage: 'Senda gögn',
    description: 'Notaður sem texti í Senda gögn takka á Gögn síðu í ákærum',
  },
  tryUploadAgain: {
    id: 'judicial.system.core:add_files.try_upload_again',
    defaultMessage: 'Reyna aftur',
    description: 'Notaður sem texti í Reyna aftur takka á Gögn síðu í ákærum',
  },
  filesSentModalTitle: {
    id: 'judicial.system.core:add_files.files_sent_modal_title_v2',
    defaultMessage: 'Viltu hlaða upp gögnum?',
    description:
      'Notaður sem titill í modal glugga þegar gögn eru send á Gögn síðu í ákærum',
  },
  filesSentModalText: {
    id: 'judicial.system.core:add_files.files_sent_modal_text_v2',
    defaultMessage: 'Gögnin verða sýnileg aðilum máls.',
    description:
      'Notaður sem texti í modal glugga þegar gögn eru send á Gögn síðu í ákærum',
  },
  filesConfirmedModalButtonText: {
    id: 'judicial.system.core:add_files.files_confirmed_modal_button_text',
    defaultMessage: 'Já, hlaða upp',
    description:
      'Notaður sem texti í takka í modal glugga þegar gögn eru send á Gögn síðu í ákærum',
  },
  filesDismissedModalButtonText: {
    id: 'judicial.system.core:add_files.files_dismissed_modal_button_text',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti í takka í modal glugga þegar gögn eru send á Gögn síðu í ákærum',
  },
}
