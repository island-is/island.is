import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

export const info = {
  general: defineMessages({
    pageTitle: {
      id: `${t}:section.info.pageTitle`,
      defaultMessage: 'Upplýsingar um þig',
      description: 'Info page title',
    },
    pageDescription: {
      id: `${t}:section.info.description`,
      defaultMessage: `Innheimtumaður þarf eftirfarandi upplýsingar til þess
      að hægt sé að hafa samband við þig á meðan málið er til meðferðar og
      upplýsa þig um niðurstöðu þess, og til þess að tryggja örugga persónugreiningu. `,
      description: 'Info page description',
    },
  }),
  labels: defineMessages({
    name: {
      id: `${t}:section.info.name`,
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: `${t}:section.info.nationalId`,
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: `${t}:section.info.address`,
      defaultMessage: 'Heimili / póstfang',
      description: 'Address',
    },
    postalCode: {
      id: `${t}:section.info.postalCode`,
      defaultMessage: 'Póstnúmer',
      description: 'Postal Code',
    },
    city: {
      id: `${t}:section.info.city`,
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    email: {
      id: `${t}:section.info.email`,
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: `${t}:section.info.tel`,
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
  }),
}
