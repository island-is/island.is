import { defineMessages } from 'react-intl'

export const inRelationship = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.personalInterest.inRelationship.sectionTitle',
      defaultMessage: 'Hjúskaparstaða',
      description: 'In relationship section title',
    },
    pageTitle: {
      id: 'fa.application:section.personalInterest.inRelationship.pageTitle',
      defaultMessage: 'Hjúskaparstaða þín',
      description: 'In relationship page title',
    },
    intro: {
      id: 'fa.application:section.personalInterest.inRelationship.intro',
      defaultMessage:
        'Þar sem þú ert í sambúð þarft þú að skila inn umsókn um fjárhagsaðstoð og maki þinn að skila inn upplýsingum um tekjur.',
      description: 'In relationship intro',
    },
    description: {
      id: 'fa.application:section.personalInterest.inRelationship.description#markdown',
      defaultMessage:
        'Hvað þýðir það? Þú klárar að fylla út þína umsókn um fjárhagsaðstoð hér og maki þinn notar sín rafrænu skilríki til að skila inn nauðsynlegum gögnum. \n\n\n Úrvinnsla umsóknarinnar hefst þegar öll gögn hafa borist.',
      description: 'In relationship description',
    },
  }),
  inputs: defineMessages({
    spouseEmail: {
      id: 'fa.application:section.personalInterest.inRelationship.inputs.spouseEmail',
      defaultMessage: 'Netfang maka',
      description: 'Spouse email input label',
    },
    spouseEmailPlaceholder: {
      id: 'fa.application:section.personalInterest.inRelationship.inputs.spouseEmailPlaceholder',
      defaultMessage: 'Sláðu inn netfang maka',
      description: 'Spouse email input placeholder',
    },
    checkboxLabel: {
      id: 'fa.application:section.personalInterest.inRelationship.inputs.checkboxLabel',
      defaultMessage:
        'Ég skil að maki minn þarf líka að skila inn umsókn áður en úrvinnsla hefst',
      description: 'Spouse checkbox label',
    },
  }),
}
