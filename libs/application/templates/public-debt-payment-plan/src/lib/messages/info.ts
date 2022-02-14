import { defineMessages } from 'react-intl'

const t = 'pdpp.application'

export const info = {
  general: defineMessages({
    pageTitle: {
      id: `pdpp.application:section.info.pageTitle`,
      defaultMessage: 'Upplýsingar um þig',
      description: 'Info page title',
    },
    pageDescription: {
      id: `pdpp.application:section.info.description`,
      defaultMessage: `Innheimtumaður þarf eftirfarandi upplýsingar til þess að hægt sé að hafa samband við þig á
       meðan málið er til meðferðar og upplýsa þig um niðurstöðuna.`,
      description: 'Info page description',
    },
  }),
  labels: defineMessages({
    name: {
      id: `pdpp.application:section.info.name`,
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    nationalId: {
      id: `pdpp.application:section.info.nationalId`,
      defaultMessage: 'Kennitala',
      description: 'National ID',
    },
    address: {
      id: `pdpp.application:section.info.address`,
      defaultMessage: 'Heimili / póstfang',
      description: 'Address',
    },
    postalCode: {
      id: `pdpp.application:section.info.postalCode`,
      defaultMessage: 'Póstnúmer',
      description: 'Postal Code',
    },
    city: {
      id: `pdpp.application:section.info.city`,
      defaultMessage: 'Sveitarfélag',
      description: 'City',
    },
    email: {
      id: `pdpp.application:section.info.email`,
      defaultMessage: 'Netfang',
      description: 'Email',
    },
    tel: {
      id: `pdpp.application:section.info.tel`,
      defaultMessage: 'Símanúmer',
      description: 'Telephone number',
    },
  }),
}
