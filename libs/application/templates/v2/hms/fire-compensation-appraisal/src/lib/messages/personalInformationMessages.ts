import { defineMessages } from 'react-intl'

export const personalInformationMessages = defineMessages({
  title: {
    id: 'fca.application:general.name',
    defaultMessage: 'Umsækjandi',
    description: 'Personal information title',
  },
  isOwner: {
    id: 'fca.application:isOwner',
    defaultMessage: 'Umsækjandi er eigandi fasteignar',
    description: 'Is owner',
  },
  isNotOwner: {
    id: 'fca.application:isNotOwner',
    defaultMessage: 'Umsækjandi er ekki eigandi fasteignar',
    description: 'Is not owner',
  },
})
