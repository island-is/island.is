import { defineMessages } from 'react-intl'

export const participants = {
  general: defineMessages({
    pageTitle: {
      id: 'aosh.sem.application:participants.general.pageTitle',
      defaultMessage: 'Þátttakendur',
      description: `Participants page title `,
    },
    sectionTitle: {
      id: 'aosh.sem.application:participants.general.sectionTitle',
      defaultMessage: 'Þátttakendur',
      description: `Participants section title `,
    },
    pageDescription: {
      id: 'aosh.sem.application:participants.general.pageDescription',
      defaultMessage:
        'Hægt er að skrá einn eða fleiri einstaklinga á námskeiðið.',
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
        'Ef þú ert að skrá marga einstaklinga í einu á námskeið geturðu hlaðið inn .csv skjali hér. Athugið að .csv skjal yfirskrifar þátttakendur í töflu',
      description: `Participants csv upload description `,
    },
    uploadHeader: {
      id: 'aosh.sem.application:participants.labels.uploadHeader',
      defaultMessage: 'Skrá marga þátttakendur í einu',
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
      defaultMessage: 'Skrá þátttakendur',
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
      defaultMessage: 'Villa við að sannreyna þátttakendur',
      description: 'participant validation error from table',
    },
    removeInvalidParticipantsButtonText: {
      id: 'aosh.sem.application:participants.labels.removeInvalidParticipantsButtonText',
      defaultMessage: 'Fjarlægja ógjaldgenga þátttakendur',
      description: 'participants remove invalid participants button text',
    },
    tableError: {
      id: 'aosh.sem.application:participants.labels.tableError',
      defaultMessage:
        'Vinsamlegast fjarlægðu ógjaldgenga þátttakendur áður en haldið er áfram',
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
      defaultMessage: 'Villa í CSV skjali fyrir línur:',
      description: 'csv upload label',
    },
    csvEmailWarningLabel: {
      id: 'aosh.sem.application:participants.labels.csvEmailWarningLabel',
      defaultMessage: 'Tvöfalt netfang',
      description: 'csv email warning label',
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
    csvDuplicateEmailError: {
      id: 'aosh.sem.application:participants.labels.csvDuplicateEmailError',
      defaultMessage:
        'netfang sem er nú þegar skráð. Ekki er hægt að skrá tvo með sama netfangi. Þú getur eytt þátttakanda út og skráð aftur með öðru netfangi. ',
      description: 'csv upload duplicate email error label',
    },
    emptyListError: {
      id: 'aosh.sem.application:participants.labels.emptyListError',
      defaultMessage: ' Vinsamlegast bættu a.m.k 1 þátttakanda við listann',
      description: 'empty participant list error label',
    },
  }),
}
