import { defineMessages } from 'react-intl'

export const sharedMessages = defineMessages({
  nextButton: {
    id: 'cpn.application:shared.nextButton',
    defaultMessage: 'Áfram',
    description: 'Next button label used on all draft form screens',
  },
  applicationName: {
    id: 'cpn.application:shared.applicationName',
    defaultMessage: 'Tilkynning til barnaverndar',
    description: 'Notification to child protection',
  },
  institution: {
    id: 'cpn.application:shared.institution',
    defaultMessage: 'Barna- og fjölskyldustofa',
    description: 'The National Agency for Children and Families',
  },
  address: {
    id: 'cpn.application:shared.address',
    defaultMessage: 'Heimilisfang',
    description: 'Address',
  },
  postalCode: {
    id: 'cpn.application:shared.postalCode',
    defaultMessage: 'Póstnúmer',
    description: 'Postal code',
  },
  municipality: {
    id: 'cpn.application:shared.municipality',
    defaultMessage: 'Sveitarfélag',
    description: 'Municipality',
  },
})
