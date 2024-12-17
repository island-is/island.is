import { defineMessages } from 'react-intl'

export const overview = {
  general: defineMessages({
    sectionTitle: {
      id: 'ss.application:overview.general.sectionTitle',
      defaultMessage: 'Yfirlit',
      description: 'Title of overview section',
    },
    pageTitle: {
      id: 'ss.application:overview.general.pageTitle',
      defaultMessage: 'Yfirlit umsóknar',
      description: 'Title of overview page',
    },
    description: {
      id: 'ss.application:overview.general.description',
      defaultMessage:
        'Vinsamlegast farðu vel yfir allar upplýsingar hér að neðan áður en umsóknin er send.',
      description: 'Description of overview page',
    },
    editMessage: {
      id: 'ss.application:overview.general.editMessage',
      defaultMessage: 'Breyta upplýsingum',
      description: 'Edit message for button',
    },
  }),
  applicant: defineMessages({
    subtitle: {
      id: 'ss.application:overview.applicant.subtitle',
      defaultMessage: 'Umsækjandi',
      description: 'Applicant subtitle',
    },
    phoneLabel: {
      id: 'ss.application:overview.applicant.phoneLabel',
      defaultMessage: 'Sími',
      description: 'Applicant phone label',
    },
  }),
  custodian: defineMessages({
    subtitle: {
      id: 'ss.application:overview.custodian.subtitle',
      defaultMessage: 'Forsjáraðili',
      description: 'Custodian subtitle',
    },
    phoneLabel: {
      id: 'ss.application:overview.custodian.phoneLabel',
      defaultMessage: 'Sími',
      description: 'Custodian phone label',
    },
  }),
  otherContact: defineMessages({
    subtitle: {
      id: 'ss.application:overview.otherContact.subtitle',
      defaultMessage: 'Aðrir tengiliðir',
      description: 'Other contact subtitle',
    },
    phoneLabel: {
      id: 'ss.application:overview.otherContact.phoneLabel',
      defaultMessage: 'Sími',
      description: 'Other contact phone label',
    },
  }),
  selection: defineMessages({
    subtitle: {
      id: 'ss.application:overview.selection.subtitle',
      defaultMessage: 'Val á skóla',
      description: 'Selection subtitle',
    },
    firstSubtitle: {
      id: 'ss.application:overview.selection.firstSubtitle',
      defaultMessage: 'Fyrsta val',
      description: 'First selection subtitle',
    },
    secondSubtitle: {
      id: 'ss.application:overview.selection.secondSubtitle',
      defaultMessage: 'Annað val',
      description: 'Second selection subtitle',
    },
    thirdSubtitle: {
      id: 'ss.application:overview.selection.thirdSubtitle',
      defaultMessage: 'Þriðja val',
      description: 'Third selection subtitle',
    },
    firstProgramLabel: {
      id: 'ss.application:overview.selection.firstProgramLabel',
      defaultMessage: 'Braut',
      description: 'Selection first program label',
    },
    secondProgramLabel: {
      id: 'ss.application:overview.selection.secondProgramLabel',
      defaultMessage: 'Braut til vara',
      description: 'Selection second program label',
    },
  }),
  extraInformation: defineMessages({
    subtitle: {
      id: 'ss.application:overview.extraInformation.subtitle',
      defaultMessage: 'Viðbótarupplýsingar',
      description: 'Extra information subtitle',
    },
    nativeLanguageLabel: {
      id: 'ss.application:overview.extraInformation.nativeLanguageLabel',
      defaultMessage: 'Móðurmál',
      description: 'Native language label',
    },
    otherLabel: {
      id: 'ss.application:overview.extraInformation.otherLabel',
      defaultMessage: 'Aðrar upplýsingar',
      description: 'Other label',
    },
    supportingDocumentsLabel: {
      id: 'ss.application:overview.extraInformation.supportingDocumentsLabel',
      defaultMessage: 'Fylgigögn',
      description: 'Supporting documents label',
    },
  }),
  buttons: defineMessages({
    confirm: {
      id: 'ss.application:overview.buttons.confirm',
      defaultMessage: 'Áfram',
      description: 'Continue',
    },
  }),
}
