import { defineMessages } from 'react-intl'

export const sharedMessages = defineMessages({
  radioYes: {
    id: 'cpn.application:shared.radioYes',
    defaultMessage: 'Já',
    description: 'Yes option for radio fields',
  },
  radioNo: {
    id: 'cpn.application:shared.radioNo',
    defaultMessage: 'Nei',
    description: 'No option for radio fields',
  },
  radioDoNotKnow: {
    id: 'cpn.application:shared.radioDoNotKnow',
    defaultMessage: 'Þekki ekki til',
    description: 'Unknown/do not know option for radio fields',
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
