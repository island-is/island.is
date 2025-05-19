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
      defaultMessage: 'Forsjáraðili/ar',
      description: 'Custodian subtitle',
    },
    label: {
      id: 'ss.application:overview.custodian.label',
      defaultMessage: 'Forsjáraðili',
      description: 'Custodian label',
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
      defaultMessage: 'Tengiliður/ir',
      description: 'Other contact subtitle',
    },
    label: {
      id: 'ss.application:overview.otherContact.label',
      defaultMessage: 'Tengiliður',
      description: 'Other contact label',
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
    thirdLanguageLabel: {
      id: 'ss.application:overview.selection.thirdLanguageLabel',
      defaultMessage: 'Þriðja tungumál',
      description: 'Selection third language label',
    },
    nordicLanguageLabel: {
      id: 'ss.application:overview.selection.nordicLanguageLabel',
      defaultMessage: 'Norðurlandamál',
      description: 'Selection nordic language label',
    },
    requestDormitoryLabel: {
      id: 'ss.application:overview.selection.requestDormitoryLabel',
      defaultMessage: 'Heimavist',
      description: 'Selection request dormitory label',
    },
    yesValue: {
      id: 'ss.application:overview.selection.yesValue',
      defaultMessage: 'Já',
      description: 'Selection yes value',
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
    submit: {
      id: 'ss.application:overview.buttons.submit',
      defaultMessage: 'Senda umsókn',
      description: 'Submit application button',
    },
    edit: {
      id: 'ss.application:overview.buttons.edit',
      defaultMessage: 'Breyta umsókn',
      description: 'Edit application button',
    },
    reSubmit: {
      id: 'ss.application:overview.buttons.reSubmit',
      defaultMessage: 'Staðfesta breytingar',
      description: 'Re-submit application button',
    },
    abort: {
      id: 'ss.application:overview.buttons.abort',
      defaultMessage: 'Hætta við breytingar',
      description: 'Abort changes button',
    },
    withdrawn: {
      id: 'ss.application:overview.buttons.withdrawn',
      defaultMessage: 'Afturkalla rýni',
      description: 'Withdrawn application button',
    },
    received: {
      id: 'ss.application:overview.buttons.received',
      defaultMessage: 'Móttekin',
      description: 'Received application button',
    },
    dismissed: {
      id: 'ss.application:overview.buttons.dismissed',
      defaultMessage: 'Vísað frá',
      description: 'Dismissed application button',
    },
  }),
  applicationDataHasBeenPruned: defineMessages({
    submitted: {
      id: 'ss.application:overview.applicationDataHasBeenPruned.submitted',
      defaultMessage:
        'Umsókn er innsend. Ef það þarf að breyta umsókn þarf að eyða þessari og gera nýja.',
      description:
        'Overview message if application data had been pruned, and application is in submitted state',
    },
    inReview: {
      id: 'ss.application:overview.applicationDataHasBeenPruned.inReview',
      defaultMessage: 'Umsókn er í vinnslu hjá stofnun.',
      description:
        'Overview message if application data had been pruned, and application is in in review state',
    },
    completed: {
      id: 'ss.application:overview.applicationDataHasBeenPruned.completed',
      defaultMessage: 'Umsókn er afgreidd.',
      description:
        'Overview message if application data had been pruned, and application is in completed state',
    },
  }),
}
