import { defineMessages } from 'react-intl'

export const juridicalPerson = {
  general: defineMessages({
    sectionTitle: {
      id: 'an.application:juridicalPerson.general.sectionTitle',
      defaultMessage: 'Upplýsingar um félag',
      description: 'Section title of juridical person section',
    },
    title: {
      id: 'an.application:juridicalPerson.general.title',
      defaultMessage: 'Upplýsingar um lögaðila',
      description: 'Title of juridical person screen',
    },
    description: {
      id: 'an.application:juridicalPerson.general.description',
      defaultMessage:
        'Vinsamlegast fylltu út upplýsingar um félagið sem þú ert forsvarsmaður hjá.',
      description: 'Description of juridical person screen',
    },
  }),
  labels: defineMessages({
    companyName: {
      id: 'an.application:juridicalPerson.labels.companyName',
      defaultMessage: 'Nafn félags',
      description: 'Juridical person company name label',
    },
    companyNationalId: {
      id: 'an.application:juridicalPerson.labels.companyNationalId',
      defaultMessage: 'Kennitala félags',
      description: 'Juridical person company national ID label',
    },
    confirmation: {
      id: 'an.application:juridicalPerson.labels.confirmation',
      defaultMessage:
        'Ég staðfesti að ég er forsvarsmaður hjá ofangreindu félagi',
      description: 'Juridical person confirmation label',
    },
  }),
}
