import { defineMessages } from 'react-intl'

export const m = {
  general: defineMessages({
    institutionName: {
      id: 'hh.courses.application:general.institutionName',
      defaultMessage: 'Heilsugæsla höfuðborgarsvæðisins',
      description: 'Name of institution',
    },
    applicationTitle: {
      id: 'hh.courses.application:general.applicationTitle',
      defaultMessage:
        'Skráning á námskeið hjá Heilsugæslu höfuðborgarsvæðisins',
      description: 'Title of application',
    },
    shorterApplicationTitle: {
      id: 'hh.courses.application:general.shorterApplicationTitle',
      defaultMessage: 'Skráning á námskeið',
      description: 'Shorter title of application',
    },
    confirmButtonLabel: {
      id: 'hh.courses.application:general.confirmButtonLabel',
      defaultMessage: 'Staðfesta',
      description: 'Confirm button label',
    },
  }),
  prerequisites: defineMessages({
    nationalRegistryTitle: {
      id: 'hh.courses.application:prerequisites.nationalRegistryTitle',
      defaultMessage: 'Upplýsingar úr Þjóðskrá',
      description: 'Information from the National Registry',
    },
    nationalRegistrySubTitle: {
      id: 'hh.courses.application:prerequisites.nationalRegistrySubTitle',
      defaultMessage:
        'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
      description: 'We will fetch name, national id and address',
    },
  }),
  course: defineMessages({
    sectionTitle: {
      id: 'hh.courses.application:course.sectionTitle',
      defaultMessage: 'Val á námskeiði',
      description: 'Title of course section',
    },
    courseSelectTitle: {
      id: 'hh.courses.application:course.courseSelectTitle',
      defaultMessage: 'Námskeið',
      description: 'Title of course select',
    },
    dateSelectTitle: {
      id: 'hh.courses.application:course.dateSelectTitle',
      defaultMessage: 'Upphafsdagsetning',
      description: 'Title of date select',
    },
  }),
  participant: defineMessages({
    sectionTitle: {
      id: 'hh.courses.application:participant.sectionTitle',
      defaultMessage: 'Þátttakendur',
      description: 'Title of participant section',
    },
    participantName: {
      id: 'hh.courses.application:participant.participantName',
      defaultMessage: 'Nafn',
      description: 'Title of participant name field',
    },
    participantNationalId: {
      id: 'hh.courses.application:participant.participantNationalId',
      defaultMessage: 'Kennitala',
      description: 'Title of participant national id field',
    },
    participantEmail: {
      id: 'hh.courses.application:participant.participantEmail',
      defaultMessage: 'Netfang',
      description: 'Title of participant email field',
    },
    participantPhone: {
      id: 'hh.courses.application:participant.participantPhone',
      defaultMessage: 'Símanúmer',
      description: 'Title of participant phone field',
    },
  }),
  payer: defineMessages({
    sectionTitle: {
      id: 'hh.courses.application:payer.sectionTitle',
      defaultMessage: 'Greiðsluupplýsingar',
      description: 'Title of payer section',
    },
    companyInfoTitle: {
      id: 'hh.courses.application:payer.companyInfoTitle',
      defaultMessage: 'Upplýsingar um fyrirtæki',
      description: 'Title of company info field',
    },
    companyTitle: {
      id: 'hh.courses.application:payer.companyTitle',
      defaultMessage: 'Nafn fyrirtækis',
      description: 'Title of company field',
    },
    companyNationalId: {
      id: 'hh.courses.application:payer.companyNationalId',
      defaultMessage: 'Kennitala fyrirtækis',
      description: 'Title of company national id field',
    },
    userIsPayingAsIndividualLabel: {
      id: 'hh.courses.application:payer.userIsPayingAsIndividualLabel',
      defaultMessage: 'Greiðslutilhögun',
      description: 'Label of user is paying as individual field',
    },
    userIsPayingAsIndividualYesLabel: {
      id: 'hh.courses.application:payer.userIsPayingAsIndividualYesLabel',
      defaultMessage: 'Greiða sem einstaklingur',
      description: 'Title of user is paying as individual field',
    },
    userIsPayingAsIndividualNoLabel: {
      id: 'hh.courses.application:payer.userIsPayingAsIndividualNoLabel',
      defaultMessage: 'Greiða sem fyrirtæki',
      description: 'Title of user is paying as individual field',
    },
    payerValidationError: {
      id: 'hh.courses.application:payer.payerValidationError',
      defaultMessage:
        'Þú verður að fylla út upplýsingar um fyrirtækið ef þú vilt greiða sem fyrirtæki',
      description: 'Error message when company payment information is required',
    },
  }),
  overview: defineMessages({
    sectionTitle: {
      id: 'hh.courses.application:overview.sectionTitle',
      defaultMessage: 'Yfirlit skráningar',
      description: 'Title of overview section',
    },
    participantHeading: {
      id: 'hh.courses.application:overview.participantHeading',
      defaultMessage: 'Þátttakendur',
      description: 'Heading for participants in overview section',
    },
    participantName: {
      id: 'hh.courses.application:overview.participantName',
      defaultMessage: 'Nafn',
      description: 'Heading for participant name in overview section',
    },
    participantNationalId: {
      id: 'hh.courses.application:overview.participantNationalId',
      defaultMessage: 'Kennitala',
      description: 'Heading for participant national id in overview section',
    },
    participantEmail: {
      id: 'hh.courses.application:overview.participantEmail',
      defaultMessage: 'Netfang',
      description: 'Heading for participant email in overview section',
    },
    participantPhone: {
      id: 'hh.courses.application:overview.participantPhone',
      defaultMessage: 'Símanúmer',
      description: 'Heading for participant phone in overview section',
    },
    payerName: {
      id: 'hh.courses.application:overview.payerName',
      defaultMessage: 'Nafn',
      description: 'Heading for payer name in overview section',
    },
    payerNationalId: {
      id: 'hh.courses.application:overview.payerNationalId',
      defaultMessage: 'Kennitala',
      description: 'Heading for payer national id in overview section',
    },
    payerHeading: {
      id: 'hh.courses.application:overview.payerHeading',
      defaultMessage: 'Greiðandi',
      description: 'Heading for payer in overview section',
    },
    submitTitle: {
      id: 'hh.courses.application:overview.submitTitle',
      defaultMessage: 'Staðfesta skráningu',
      description: 'Title of submit button in overview section',
    },
  }),
  completedForm: defineMessages({
    alertTitle: {
      id: 'hh.courses.application:completedForm.alertTitle',
      defaultMessage: 'Takk fyrir skráninguna',
      description: 'Title of completed form alert',
    },
    alertMessage: {
      id: 'hh.courses.application:completedForm.alertMessage',
      defaultMessage: 'Skráning þín er móttekin',
      description: 'Message of completed form alert',
    },
  }),
}
