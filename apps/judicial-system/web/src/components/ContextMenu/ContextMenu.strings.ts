import { defineMessages } from 'react-intl'

export const contextMenu = defineMessages({
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
  withdrawAppeal: {
    id: 'judicial.system.core:context_menu.withdraw_appeal',
    defaultMessage: 'Afturkalla kæru',
    description:
      'Notaður sem texti í "Afturkalla kæru" valmöguleika í fellilista.',
  },
})
