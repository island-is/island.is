import { defineMessages } from 'react-intl'

export const unknownRelationship = {
  general: defineMessages({
    sectionTitle: {
      id: 'fa.application:section.personalInterest.unknownRelationship.sectionTitle',
      defaultMessage: 'Hjúskaparstaða',
      description: 'Relationship unknown section title',
    },
    pageTitle: {
      id: 'fa.application:section.personalInterest.unknownRelationship.pageTitle',
      defaultMessage: 'Hjúskaparstaða þín',
      description: 'Relationship unknown page title',
    },
    intro: {
      id: 'fa.application:section.personalInterest.unknownRelationship.intro',
      defaultMessage:
        'Samkvæmt upplýsingum frá Þjóðskrá ert þú ekki í staðfestri sambúð. En sért þú í óstaðfestri sambúð þarft bæði þú og maki þinn að skila inn umsókn.',
      description: 'Relationship unknown intro',
    },
    description: {
      id: 'fa.application:section.personalInterest.unknownRelationship.description#markdown',
      defaultMessage:
        'Hvað þýðir það? Þú klárar að fylla út þína umsókn um fjárhagsaðstoð hér og maki þinn notar sín rafrænu skilríki til að skila inn nauðsynlegum gögnum. \n\n\n Úrvinnsla umsóknarinnar hefst þegar öll gögn hafa borist.',
      description: 'Relationship unknown description',
    },
  }),
  form: defineMessages({
    title: {
      id: 'fa.application:section.personalInterest.unknownRelationship.form.title',
      defaultMessage: 'Ert þú í óstaðfestri sambúð?',
      description: 'Relationship unknown form title',
    },
    radioButtonNo: {
      id: 'fa.application:section.personalInterest.unknownRelationship.form.radioButtonNo',
      defaultMessage: 'Nei, ég er ekki í sambúð',
      description:
        'Relationship unknown form radio button if applicant answers no about being in a unregistered cohabitation',
    },
    radioButtonYes: {
      id: 'fa.application:section.personalInterest.unknownRelationship.form.radioButtonYes',
      defaultMessage: 'Já, ég er í óstaðfestri sambúð',
      description:
        'Relationship unknown form radio button if applicant answers yes about being in a unregistered cohabitation',
    },
  }),
  inputs: defineMessages({
    spouseNationalId: {
      id: 'fa.application:section.personalInterest.unknownRelationship.inputs.spouseNationalId',
      defaultMessage: 'Kennitala maka',
      description: 'Spouse national id input label',
    },
    spouseNationalIdPlaceholder: {
      id: 'fa.application:section.personalInterest.unknownRelationship.inputs.spouseNationalIdPlaceholder',
      defaultMessage: 'Sláðu inn netfang maka',
      description: 'Spouse national id input placeholder',
    },
    spouseEmail: {
      id: 'fa.application:section.personalInterest.unknownRelationship.inputs.spouseEmail',
      defaultMessage: 'Netfang maka',
      description: 'Spouse email input label',
    },
    spouseEmailPlaceholder: {
      id: 'fa.application:section.personalInterest.unknownRelationship.inputs.spouseEmailPlaceholder',
      defaultMessage: 'Sláðu inn netfang maka',
      description: 'Spouse email input placeholder',
    },
    checkboxLabel: {
      id: 'fa.application:section.personalInterest.unknownRelationship.inputs.checkboxLabel',
      defaultMessage:
        'Ég skil að maki minn þarf líka að skila inn umsókn áður en úrvinnsla hefst',
      description: 'Spouse checkbox label about agreeing with terms',
    },
  }),
}
