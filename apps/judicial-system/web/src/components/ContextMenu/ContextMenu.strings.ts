import { defineMessages } from 'react-intl'

export const contextMenu = defineMessages({
  openFile: {
    id: 'judicial.system.core:context_menu.open_file',
    defaultMessage: 'Opna',
    description: 'Notaður sem texti í "Opna" valmöguleika í fellilista.',
  },
  deleteFile: {
    id: 'judicial.system.core:context_menu.delete_file',
    defaultMessage: 'Eyða',
    description: 'Notaður sem texti í "Eyða" valmöguleika í fellilista.',
  },
  openInNewTab: {
    id: 'judicial.system.core:context_menu.open_in_new_tab',
    defaultMessage: 'Opna mál í nýjum flipa',
    description:
      'Notaður sem texti í "Opna mál í nýjum flipa" valmöguleika í fellilista.',
  },
  deleteCase: {
    id: 'judicial.system.core:context_menu.delete_case',
    defaultMessage: 'Afturkalla',
    description: 'Notaður sem texti í valmynd fyrir mál til að afturkalla mál',
  },
})
