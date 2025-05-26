import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  title: {
    id: 'judicial.system.core:file_not_found_modal.title',
    defaultMessage: 'Skjalið er ekki lengur aðgengilegt í Réttarvörslugátt',
    description: 'Notaður sem titill file not found modal.',
  },
  text: {
    id: 'judicial.system.core:file_not_found_modal.text',
    defaultMessage:
      'Skjöl eru geymd í takmarkaðan tíma á skráarsvæði Réttarvörslugáttar.',
    description: 'Notaður sem texti file not found modal.',
  },
  close: {
    id: 'judicial.system.core:file_not_found_modal.close',
    defaultMessage: 'Loka glugga',
    description:
      'Notaður fyrir texta í Loka glugga takka í file not found modal.',
  },
})
