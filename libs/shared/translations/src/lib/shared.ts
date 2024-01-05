import { defineMessages } from 'react-intl'

export const sharedNamespace = 'global'

export const sharedMessages = defineMessages({
  edit: {
    id: 'global:edit',
    defaultMessage: 'Breyta',
  },

  nationalId: {
    id: 'global:nationalId',
    defaultMessage: 'Kennitala',
  },

  email: {
    id: 'global:email',
    defaultMessage: 'Netfang',
  },

  phoneNumber: {
    id: 'global:telephone',
    defaultMessage: 'Símanúmer',
  },

  language: {
    id: 'global:language',
    defaultMessage: 'Tungumál',
  },

  logout: {
    id: 'global:logout',
    defaultMessage: 'Útskrá',
  },

  settings: {
    id: 'global:settings',
    defaultMessage: 'Stillingar',
  },

  close: {
    id: 'global:close',
    description: 'Label to close a dropdown, dialog or pop-up.',
    defaultMessage: 'Loka',
  },
  myCategories: {
    id: 'global:my-categories',
    description: 'My categories for dashboard and sidemenu.',
    defaultMessage: 'Mínir flokkar',
  },
  switchToEnglish: {
    id: 'global:switch-to-english',
    description:
      'Icelandic translation should be on english. Button under usermenu to switch language to english.',
    defaultMessage: 'Switch to english',
  },
  switchToIcelandic: {
    id: 'global:switch-to-icelandic',
    description:
      'English translation should be on icelandic. Button under usermenu to switch language to english.',
    defaultMessage: 'Skipta á íslensku',
  },
})
