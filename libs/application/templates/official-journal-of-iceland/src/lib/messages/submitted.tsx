import { defineMessages } from 'react-intl'

export const submitted = {
  general: defineMessages({
    title: {
      id: 'ojoi.application:submitted.general.title',
      defaultMessage: 'Mál hefur verið sent inn til yfirferðar',
      description: 'Title of the submitted screen',
    },
    returnToServicePortal: {
      id: 'ojoi.application:submitted.general.returnToServicePortal',
      defaultMessage: 'Fara til baka á mínar síður',
      description: 'Return to service portal button text',
    },
    newApplication: {
      id: 'ojoi.application:submitted.general.newApplication',
      defaultMessage: 'Ný umsókn',
      description: 'New application button text',
    },
    section: {
      id: 'ojoi.application:submitted.general.section',
      defaultMessage: 'Staðfesting',
      description: 'Section title of the submitted screen',
    },
  }),
  buttons: defineMessages({
    reload: {
      id: 'ojoi.application:submitted.general.reload',
      defaultMessage: 'Endurhlaða',
      description: 'Reload button text',
    },
  }),
  errors: defineMessages({
    caseErrorTitle: {
      id: 'ojoi.application:submitted.errors.caseErrorTitle',
      defaultMessage: 'Ekki tókst að sækja gögn um málið',
      description: 'Case error message',
    },
    caseErrorMessage: {
      id: 'ojoi.application:submitted.errors.caseErrorMessage',
      defaultMessage:
        'Vinsamlegast reynið aftur síðar eða hafið samband við Stjórnartíðindi',
      description: 'Case error message',
    },
    postApplicationErrorTitle: {
      id: 'ojoi.application:submitted.errors.postApplicationErrorTitle',
      defaultMessage: 'Ekki tókst að senda inn umsókn',
      description: 'Post application error message',
    },
    postApplicationErrorMessage: {
      id: 'ojoi.application:submitted.errors.postApplicationErrorMessage',
      defaultMessage:
        'Vinsamlegast reynið aftur síðar eða hafið samband við Stjórnartíðindi',
      description: 'Post application error message',
    },
  }),
  bullets: defineMessages({
    first: {
      id: 'ojoi.application:submitted.bullets.first',
      defaultMessage:
        'Starfsfólk mun fara yfir auglýsinguna og þú færð staðfestingu þegar auglýsingin þín fer í birtingu',
      description: 'First bullet of the submitted screen',
    },
    second: {
      id: 'ojoi.application:submitted.bullets.second',
      defaultMessage:
        'Ef auglýsingin þarfnast einhverra breytinga færð þú tilkynningu um það.',
      description: 'Second bullet of the submitted screen',
    },
    expectedPublishDate: {
      id: 'ojoi.application:submitted.bullets.expectedPublishDate',
      defaultMessage: 'Áætlaður birtingardagur auglýsingar:',
      description: 'expectedPublishDate bullet of the submitted screen',
    },
  }),
}
