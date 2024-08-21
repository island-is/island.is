import { defineMessage } from 'react-intl'

export const strings = {
  heading: defineMessage({
    id: 'judicial.system.core:add_files.heading',
    defaultMessage: 'Gögn',
    description: 'Notaður sem titill á Bæta við gögnum síðu í ákærum.',
  }),
  uploadFilesHeading: {
    id: 'judicial.system.core:add_files.upload_files_heading',
    defaultMessage: 'Innsending gagna til dómsins',
    description:
      'Notaður sem titill í Innsending gagna til dómsins hluta á Gögn síðu í ákærum.',
  },
  uploadFilesDescription: {
    id: 'judicial.system.core:add_files.upload_files_description',
    defaultMessage: 'Gögnin verða að hafa lýsandi skráarheiti.',
    description:
      'Notaður sem texti í Innsending gagna til dómsins hluta á Gögn síðu í ákærum.',
  },
}
