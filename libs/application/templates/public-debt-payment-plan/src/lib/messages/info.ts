import { defineMessages } from 'react-intl'

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
    companyPageTitle: {
      id: `pdpp.application:section.info.companyPageTitle`,
      defaultMessage: 'Upplýsingar um fyrirtæki',
      description: 'Info page title for companies',
    },
    companyPageDescription: {
      id: `pdpp.application:section.info.companyDescription`,
      defaultMessage: `Vinsamlegast farið yfir eftirfarandi skráningu til að tryggja að allar upplýsingar séu réttar.  Innheimtumaður notar upplýsingarnar til að hafa samband við þig við úrvinnslu málsins.`,
      description: 'Info page description for companies',
    },
  }),
  labels: defineMessages({
    name: {
      id: `pdpp.application:section.info.name`,
      defaultMessage: 'Fullt nafn',
      description: 'Full name',
    },
    companyName: {
      id: `pdpp.application:section.info.companyName`,
      defaultMessage: 'Heiti fyrirtækis',
      description: 'Company name',
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
