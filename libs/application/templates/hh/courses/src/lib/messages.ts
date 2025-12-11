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
      defaultMessage: 'Dagsetning',
      description: 'Title of date select',
    },
  }),
  participant: defineMessages({
    sectionTitle: {
      id: 'hh.courses.application:participant.sectionTitle',
      defaultMessage: 'Upplýsingar um þátttakanda',
      description: 'Title of participant section',
    },
  }),
  payer: defineMessages({
    sectionTitle: {
      id: 'hh.courses.application:payer.sectionTitle',
      defaultMessage: 'Upplýsingar um greiðanda',
      description: 'Title of payer section',
    },
    nationalIdTitle: {
      id: 'hh.courses.application:payer.nationalIdTitle',
      defaultMessage: 'Kennitala',
      description: 'Title of national id field',
    },
    nameTitle: {
      id: 'hh.courses.application:payer.nameTitle',
      defaultMessage: 'Nafn',
      description: 'Title of name field',
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
      defaultMessage: 'Þátttakandi',
      description: 'Heading for participant in overview section',
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

// export const m = defineMessages({
//   payerSectionTitle: {
//     id: 'hh.courses.application:payerSectionTitle',
//     defaultMessage: 'Upplýsingar um greiðanda',
//     description: 'Title of payer section',
//   },
//   courseSectionTitle: {
//     id: 'hh.courses.application:courseSectionTitle',
//     defaultMessage: 'Val á námskeiði',
//     description: 'Title of course section',
//   },
//   courseSelectTitle: {
//     id: 'hh.courses.application:courseSelectTitle',
//     defaultMessage: 'Námskeið',
//     description: 'Title of course select',
//   },
//   dateSelectTitle: {
//     id: 'hh.courses.application:dateSelectTitle',
//     defaultMessage: 'Dagsetning',
//     description: 'Title of date select',
//   },
//   confirmButtonLabel: {
//     id: 'hh.courses.application:confirmButtonLabel',
//     defaultMessage: 'Staðfesta',
//     description: 'Confirm button label',
//   },
//   prerequisitesNationalRegistryTitle: {
//     id: 'hh.courses.application:prerequisitesNationalRegistryTitle',
//     defaultMessage: 'Upplýsingar úr Þjóðskrá',
//     description: 'Information from the National Registry',
//   },
//   prerequisitesNationalRegistrySubTitle: {
//     id: 'hh.courses.application:prerequisitesNationalRegistrySubTitle',
//     defaultMessage:
//       'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
//     description: 'We will fetch name, national id and address',
//   },
//   mainSectionTitle: {
//     id: 'hh.courses.application:mainSectionTitle',
//     defaultMessage: 'Skráning á námskeið',
//     description: 'Title of main section',
//   },
//   participantSectionTitle: {
//     id: 'hh.courses.application:participantSectionTitle',
//     defaultMessage: 'Upplýsingar um þátttakanda',
//     description: 'Title of participant section',
//   },
//   participantSectionParticipantEmail: {
//     id: 'hh.courses.application:participantSectionParticipantEmail',
//     defaultMessage: 'Netfang',
//     description: 'Label for participant email',
//   },
//   participantSectionParticipantPhoneNumber: {
//     id: 'hh.courses.application:participantSectionParticipantPhoneNumber',
//     defaultMessage: 'Símanúmer',
//     description: 'Label for participant phone number',
//   },
//   participantSectionPayerHeading: {
//     id: 'hh.courses.application:participantSectionPayerHeading',
//     defaultMessage: 'Greiðandi reiknings',
//     description: 'Heading for payer segment',
//   },
//   participantSectionPayerNationalId: {
//     id: 'hh.courses.application:participantSectionPayerNationalId',
//     defaultMessage: 'Kennitala',
//     description: 'Label for payer national id',
//   },
//   participantSectionPayerName: {
//     id: 'hh.courses.application:participantSectionPayerName',
//     defaultMessage: 'Nafn',
//     description: 'Label for payer name',
//   },
//   overviewSectionHeading: {
//     id: 'hh.courses.application:overviewSectionHeading',
//     defaultMessage: 'Yfirlit skráningar',
//     description: 'Heading for overview section',
//   },
//   overviewSectionParticipantHeading: {
//     id: 'hh.courses.application:overviewSectionParticipantHeading',
//     defaultMessage: 'Þátttakandi',
//     description: 'Heading for participant in overview section',
//   },
//   overviewSectionParticipantName: {
//     id: 'hh.courses.application:overviewSectionParticipantName',
//     defaultMessage: 'Nafn',
//     description: 'Label for participant name in overview section',
//   },
//   overviewSectionParticipantNationalId: {
//     id: 'hh.courses.application:overviewSectionParticipantNationalId',
//     defaultMessage: 'Kennitala',
//     description: 'Label for participant national id in overview section',
//   },
//   overviewSectionParticipantEmail: {
//     id: 'hh.courses.application:overviewSectionParticipantEmail',
//     defaultMessage: 'Netfang',
//     description: 'Label for participant email in overview section',
//   },
//   overviewSectionParticipantPhone: {
//     id: 'hh.courses.application:overviewSectionParticipantPhone',
//     defaultMessage: 'Símanúmer',
//     description: 'Label for participant phone number in overview section',
//   },
//   overviewSectionPayerHeading: {
//     id: 'hh.courses.application:overviewSectionPayerHeading',
//     defaultMessage: 'Greiðandi reiknings',
//     description: 'Heading for payer in overview section',
//   },
//   overviewSectionPayerName: {
//     id: 'hh.courses.application:overviewSectionPayerName',
//     defaultMessage: 'Nafn',
//     description: 'Label for payer name in overview section',
//   },
//   overviewSectionPayerNationalId: {
//     id: 'hh.courses.application:overviewSectionPayerNationalId',
//     defaultMessage: 'Kennitala',
//     description: 'Label for payer national id in overview section',
//   },
//   overviewSectionSubmit: {
//     id: 'hh.courses.application:overviewSectionSubmit',
//     defaultMessage: 'Staðfesta skráningu',
//     description: 'Label for submit button in overview section',
//   },
//   completedFormAlertTitle: {
//     id: 'hh.courses.application:completedFormAlertTitle',
//     defaultMessage: 'Takk fyrir skráninguna',
//     description: 'Title of completed form alert',
//   },
//   completedFormAlertMessage: {
//     id: 'hh.courses.application:completedFormAlertMessage',
//     defaultMessage: 'Skráning þín er móttekin',
//     description: 'Message of completed form alert',
//   },
// })
