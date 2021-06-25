import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    aboutTheComplainerTitle: {
      id: 'ctao.application:information.general.aboutTheComplainerTitle',
      defaultMessage: 'Upplýsingar um þann sem kvartar',
      description: 'Title about the complainer',
    },
  }),
  aboutTheComplainer: defineMessages({
    name: {
      id: 'ctao.application:information.aboutTheComplainer.name',
      defaultMessage: 'Nafn',
      description: 'Complainers name',
    },
    ssn: {
      id: 'ctao.application:information.aboutTheComplainer.ssn',
      defaultMessage: 'Kennitala',
      description: 'Complainers SSN',
    },
    address: {
      id: 'ctao.application:information.aboutTheComplainer.address',
      defaultMessage: 'Heimili',
      description: 'Complainers home address',
    },
    postcode: {
      id: 'ctao.application:information.aboutTheComplainer.postcode',
      defaultMessage: 'Póstnúmer',
      description: 'Complainers post code',
    },
    city: {
      id: 'ctao.application:information.aboutTheComplainer.city',
      defaultMessage: 'Staður',
      description: 'Complainers City',
    },
    email: {
      id: 'ctao.application:information.aboutTheComplainer.email',
      defaultMessage: 'Netfang',
      description: 'Complainers email ',
    },
    phone: {
      id: 'ctao.application:information.aboutTheComplainer.phone',
      defaultMessage: 'Sími',
      description: 'Complainers phone number',
    },
  }),
}
