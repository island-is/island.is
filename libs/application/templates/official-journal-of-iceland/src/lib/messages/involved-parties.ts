import { defineMessages } from 'react-intl'

export const involvedParty = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:original.general.title',
      defaultMessage: 'Stofnun ',
      description: 'Title of the involved party screen',
    },
    intro: {
      id: 'ojoi.application:original.general.intro',
      defaultMessage:
        'Þú hefur aðgang að fleiri en einum lögaðila, veldu þann sem þú vilt senda auglýsingu fyrir.',
      description: 'Intro of the involved party form',
    },
    section: {
      id: 'ojoi.application:original.general.section',
      defaultMessage: 'Stofnanir',
      description: 'Title of the involved party section',
    },
  }),
  inputs: {
    select: defineMessages({
      placeholder: {
        id: 'ojoi.application:original.inputs.select.placeholder',
        defaultMessage: 'Veldu stofnun',
        description: 'Placeholder for the select input',
      },
    }),
  },

  errors: defineMessages({
    title: {
      id: 'ojoi.application:original.error.title',
      defaultMessage: 'Þú hefur ekki aðgang',
      description: 'Title of the error message',
    },
    message: {
      id: 'ojoi.application:original.error.message',
      defaultMessage:
        'Ekki tókst að sækja stofnanir fyrir aðganginn þinn, ef þú telur þig eiga að hafa aðgang, vinsamlegast hafðu samband við ritstjóra Stjórnartíðnda.',
      description: 'Error message',
    },
    messageForbidden: {
      id: 'ojoi.application:original.error.messageForbidden',
      defaultMessage:
        'Innskráður notandi hefur ekki aðgang að umsókn, ef þú telur þig eiga að hafa aðgang, vinsamlegast hafðu samband við ritstjóra Stjórnartíðnda.',
      description: 'Error message forbidden',
    },
    noDataTitle: {
      id: 'ojoi.application:original.error.noDataTitle',
      defaultMessage: 'Engar stofnanir',
      description: 'Title of the no data message',
    },
    noDataMessage: {
      id: 'ojoi.application:original.error.noDataMessage',
      defaultMessage:
        'Notandinn er ekki tengdur neinum stofnunum, vinsamlegast hafðu samband við ritstjóra Stjórnartíðnda.',
      description: 'No data message',
    },
  }),
}
