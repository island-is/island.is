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

  close: {
    id: 'global:close',
    description: 'Label to close a dropdown, dialog or pop-up.',
    defaultMessage: 'Loka',
  },
})
