import { defineMessages } from 'react-intl'

export const participants = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.sem.application:participants.general.pageTitle',
      defaultMessage: 'Þáttakendur',
      description: `Participants page title `,
    },
    sectionTitle: {
      id: 'aosh.sem.application:participants.general.sectionTitle',
      defaultMessage: 'Þáttakendur',
      description: `Participants section title `,
    },
    pageDescription: {
      id: 'aosh.sem.application:participants.general.pageDescription',
      defaultMessage:
        'Et sed ut est aliquam proin elit sed. Nunc tellus lacus sed eu pulvinar. ',
      description: `Participants page description `,
    },
  }),
  labels: defineMessages({
    csvError: {
      id: 'aosh.sem.application:participants.labels.csvError',
      defaultMessage:
        'Athugið: csv sniðmátið virðist ekki vera rétt. Vinsamlegast farið yfir. Einnig er hægt að hlaða niður sniðmáti hér að ofan.',
      description: `Participants csv upload error `,
    },
    csvDescription: {
      id: 'aosh.sem.application:participants.labels.csvDescription',
      defaultMessage:
        'Ef þú ert að skrá marga einstaklinga í einu á námskeið geturðu hlaðið inn .csv skjali hér.',
      description: `Participants csv upload description `,
    },
    uploadHeader: {
      id: 'aosh.sem.application:participants.labels.uploadHeader',
      defaultMessage: 'Skrá marga þáttakendur í einu',
      description: 'participants csv upload header',
    },
    uploadButton: {
      id: 'aosh.sem.application:participants.labels.uploadButton',
      defaultMessage: 'Hlaða inn .csv skjali',
      description: 'participants csv upload button label',
    },
    name: {
      id: 'aosh.sem.application:participants.labels.name',
      defaultMessage: 'Nafn',
      description: 'participants name label',
    },
    nationalId: {
      id: 'aosh.sem.application:participants.labels.nationalId',
      defaultMessage: 'Kennitala',
      description: 'participants nationalId label',
    },
    email: {
      id: 'aosh.sem.application:participants.labels.email',
      defaultMessage: 'Netfang',
      description: 'participants email label',
    },
    phoneNumber: {
      id: 'aosh.sem.application:participants.labels.phoneNumber',
      defaultMessage: 'Símanúmer',
      description: 'participants phoneNumber label',
    },
    csvButtonText: {
      id: 'aosh.sem.application:participants.labels.csvButtonText',
      defaultMessage: 'Sækja csv sniðmát',
      description: 'participants csv button text',
    },
    addParticipantButtonText: {
      id: 'aosh.sem.application:participants.labels.addParticipantButtonText',
      defaultMessage: 'Skrá fleiri þátttakendur',
      description: 'participants add more button text',
    },
    validityError: {
      id: 'aosh.sem.application:participants.labels.validityError',
      defaultMessage:
        'Sumir þátttakendur eru ekki gjaldgengir á þetta námskeið. Vinsamlegast hafið samband við þjónustuver ef þörf er á frekari upplýsingum.',
      description: 'participants validity error text',
    },
    tableRepeaterLoadErrorMessage: {
      id: 'aosh.sem.application:participants.labels.tableRepeaterLoadErrorMessage',
      defaultMessage: 'Villa við að sannreyna þáttakendur',
      description: 'participant validation error from table',
    },
    removeInvalidParticipantsButtonText: {
      id: 'aosh.sem.application:participants.labels.removeInvalidParticipantsButtonText',
      defaultMessage: 'Fjarlægja ógjaldgenga þátttakendur',
      description: 'participants remove invalid participants button text',
    },
    tableError: {
      id: 'aosh.sem.application:participants.labels.tableError',
      defaultMessage: 'Vinsamlegast fjarlægðu ógjaldgenga þáttakendur',
      description: 'participants table error message',
    },
    seeLess: {
      id: 'aosh.sem.application:participants.labels.seeLess',
      defaultMessage: 'Sjá færri',
      description: 'participants table see less',
    },
    seeMore: {
      id: 'aosh.sem.application:participants.labels.seeMore',
      defaultMessage: 'Sjá fleiri',
      description: 'participants table see more',
    },
    csvErrorLabel: {
      id: 'aosh.sem.application:participants.labels.csvErrorLabel#markdown',
      defaultMessage: 'Villa í CSV skjali fyrir línu: ',
      description: 'csv upload label',
    },
    csvSsnInputError: {
      id: 'aosh.sem.application:participants.labels.csvSsnInputError',
      defaultMessage: 'Kennitala ekki rétt',
      description: 'csv upload ssn error label',
    },
    csvEmailInputError: {
      id: 'aosh.sem.application:participants.labels.csvEmailInputError',
      defaultMessage: 'Netfang ekki rétt',
      description: 'csv upload email error label',
    },
    csvPhoneNumberInputError: {
      id: 'aosh.sem.application:participants.labels.csvPhoneNumberInputError',
      defaultMessage: 'Símanúmer ekki rétt',
      description: 'csv upload phone number error label',
    },
  }),
}
