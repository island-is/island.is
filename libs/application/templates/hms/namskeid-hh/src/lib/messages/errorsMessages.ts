import { defineMessages } from 'react-intl'

export const errorMessages = defineMessages({
  emailNeeded: {
    id: 'nhh.application:errorMessages.emailNeeded',
    defaultMessage: 'Netfang er nauðsynlegt',
    description: 'Email is required error message',
  },
  nameRequired: {
    id: 'nhh.application:errorMessages.nameRequired',
    defaultMessage: 'Nafn er nauðsynlegt',
    description: 'Name is required error message',
  },
  phoneNumberRequired: {
    id: 'nhh.application:errorMessages.phoneNumberRequired',
    defaultMessage: 'Símanúmer er nauðsynlegt',
    description: 'Phone number is required error message',
  },
})
