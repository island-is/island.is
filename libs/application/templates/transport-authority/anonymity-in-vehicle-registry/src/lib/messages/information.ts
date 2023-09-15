import { defineMessages } from 'react-intl'

export const information = {
  general: defineMessages({
    sectionTitle: {
      id: 'ta.avr.application:information.general.sectionTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information section',
    },
    pageTitle: {
      id: 'ta.avr.application:information.general.pageTitle',
      defaultMessage: 'Upplýsingar',
      description: 'Title of information page',
    },
  }),
  labels: {
    anonymityStatus: defineMessages({
      pageTitle: {
        id: 'ta.avr.application:information.labels.anonymityStatus.pageTitle',
        defaultMessage: 'Nafnleynd',
        description: 'Anonymity status page title',
      },
      checkboxTitle: {
        id: 'ta.avr.application:information.labels.anonymityStatus.checkboxTitle',
        defaultMessage: 'Nafnleynd í ökutækjaskrá',
        description: 'Anonymity status checkbox title',
      },
      checkboxSubTitle: {
        id: 'ta.avr.application:information.labels.anonymityStatus.checkboxSubTitle',
        defaultMessage:
          'Nafnleynd í ökutækjaskrá nær einungis til þeirra upplýsinga sem veittar eru hjá Samgöngustofu.',
        description: 'Anonymity status checkbox sub title',
      },
      noteTitle: {
        id: 'ta.avr.application:information.labels.anonymityStatus.noteTitle',
        defaultMessage: 'Til athugunar! ',
        description: 'Anonymity status note title',
      },
      noteText1: {
        id: 'ta.avr.application:information.labels.anonymityStatus.noteText1',
        defaultMessage:
          'Nafnleynd í ökutækjaskrá tekur einungis til þeirra upplýsinga sem veittar eru hjá Samgöngustofu, þ.e. ekki til annarra aðila sem hafa aðgang að ökutækjaskránni.',
        description: 'Anonymity status note text 1',
      },
      noteText2: {
        id: 'ta.avr.application:information.labels.anonymityStatus.noteText2',
        defaultMessage: 'Leyndin tekur til tveggja þátta:',
        description: 'Anonymity status note text 2',
      },
      noteText3: {
        id: 'ta.avr.application:information.labels.anonymityStatus.noteText3',
        defaultMessage:
          'Gagnvart uppflettingu í ökutækjaskrá á Mínu svæði Samgöngustofu. Ekkert er gefið upp um núverandi eiganda / umráðamann sem óskað hefur nafnleyndar.',
        description: 'Anonymity status note text 3',
      },
      noteText4: {
        id: 'ta.avr.application:information.labels.anonymityStatus.noteText4',
        defaultMessage:
          'Nafn viðkomandi fer ekki á póstlista (auglýsingar, kynningar, happadrætti, o.þ.h.).',
        description: 'Anonymity status note text 4',
      },
    }),
  },
  confirmation: defineMessages({
    confirm: {
      id: 'ta.avr.application:information.confirmation.confirm',
      defaultMessage: 'Áfram',
      description: 'Continue',
    },
  }),
}
