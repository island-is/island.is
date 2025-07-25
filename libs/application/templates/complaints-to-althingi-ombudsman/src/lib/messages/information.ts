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
      defaultMessage: 'Fullt nafn',
      description: 'Complainers name',
    },
    nationalId: {
      id: 'ctao.application:information.aboutTheComplainer.nationalId',
      defaultMessage: 'Kennitala',
      description: 'Complainers nationalId',
    },
    address: {
      id: 'ctao.application:information.aboutTheComplainer.address',
      defaultMessage: 'Lögheimili',
      description: 'Complainers home address',
    },
    postalCode: {
      id: 'ctao.application:information.aboutTheComplainer.postalCode',
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
    phoneNumber: {
      id: 'ctao.application:information.aboutTheComplainer.phoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'Complainers phone number',
    },
  }),
}
