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
        'Risus et porttitor enim vel tincidunt volutpat. Viverra cursus mattis sed lorem quis arcu laoreet.',
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
  supportingDocuments: defineMessages({
    subtitle: {
      id: 'ss.application:overview.supportingDocuments.subtitle',
      defaultMessage: 'Fylgigögn',
      description: 'Supporting documents subtitle',
    },
    description: {
      id: 'ss.application:overview.supportingDocuments.description',
      defaultMessage:
        'Risus eget mauris ut vestibulum scelerisque ac. Vivamus vitae purus.',
      description: 'Supporting documents label',
    },
  }),
  selection: defineMessages({
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
    hasDisabilityLabel: {
      id: 'ss.application:overview.extraInformation.hasDisabilityLabel',
      defaultMessage: 'Fötlunargreining',
      description: 'Has disability label',
    },
    hasDisabilityYesValue: {
      id: 'ss.application:overview.extraInformation.hasDisabilityYesValue',
      defaultMessage: 'Já',
      description: 'Has disability yes value',
    },
    disabilityDescriptionLabel: {
      id: 'ss.application:overview.extraInformation.disabilityDescriptionLabel',
      defaultMessage: 'Fötlun',
      description: 'Disability description label',
    },
    otherLabel: {
      id: 'ss.application:overview.extraInformation.otherLabel',
      defaultMessage: 'Aðrar upplýsingar',
      description: 'Other label',
    },
  }),
  confirmation: defineMessages({
    checkboxMessage: {
      id: 'ss.application:overview.confirmation.checkboxMessage',
      defaultMessage:
        'Með því að haka í þetta box samþykki ég að gangast undir skilmála þess framhaldsskóla sem ég fæ pláss í. Skilmálar eru á vefsíðum skólanna.',
      description: 'Confirm checkbox message',
    },
    confirm: {
      id: 'ss.application:overview.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Continue',
    },
  }),
}
