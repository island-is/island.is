import { defineMessages } from 'react-intl'

export const m = defineMessages({
  conditionsSection: {
    id: 'es.application:conditions.section',
    defaultMessage: 'Skilyrði',
    description: 'Some description',
  },
  institutionName: {
    id: 'es.application:institution',
    defaultMessage: 'Institution reference',
    description: `Institution's name`,
  },
  name: {
    id: 'es.application:name',
    defaultMessage: 'Umsókn',
    description: `Application's name`,
  },
  draftTitle: {
    id: 'es.application:draft.title',
    defaultMessage: 'Drög',
    description: 'First state title',
  },
  draftDescription: {
    id: 'es.application:draft.description',
    defaultMessage: 'Notendur hafa ekkert að gera á þessu stigi',
    description: 'Description of the state',
  },
  introSection: {
    id: 'es.application:intro.section',
    defaultMessage: 'Upplýsingar',
    description: 'Some description',
  },
  introField: {
    id: 'es.application:intro.field',
    defaultMessage: 'Velkomin(n)',
    description: 'Some description',
  },
  introIntroduction: {
    id: 'es.application:intro.introduction',
    defaultMessage:
      '*Hello*, **{name}**! [This is a link to Google!](http://google.com)',
    description: 'Some description',
  },
  about: {
    id: 'es.application:about',
    defaultMessage: 'Um þig',
    description: 'Some description',
  },
  personName: {
    id: 'es.application:person.name',
    defaultMessage: 'Nafn',
    description: 'Some description',
  },
  nationalId: {
    id: 'es.application:person.nationalId',
    defaultMessage: 'Kennitala',
    description: 'Some description',
  },
  age: {
    id: 'es.application:person.age',
    defaultMessage: 'Aldur',
    description: 'Some description',
  },
  email: {
    id: 'es.application:person.email',
    defaultMessage: 'Netfang',
    description: 'Some description',
  },
  phoneNumber: {
    id: 'es.application:person.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Some description',
  },
  career: {
    id: 'es.application:career',
    defaultMessage: 'Starfsferill',
    description: 'Some description',
  },
  history: {
    id: 'es.application:history',
    defaultMessage: 'Hvar hefur þú unnið áður?',
    description: 'Some description',
  },
  careerHistory: {
    id: 'es.application:careerHistory',
    defaultMessage: 'Hefurðu unnið yfir höfuð einhvern tímann áður?',
    description: 'Some description',
  },
  careerHistoryCompanies: {
    id: 'es.application:careerHistoryCompanies',
    defaultMessage: 'Hefurðu unnið fyrir eftirfarandi aðila?',
    description: 'Some description',
  },
  future: {
    id: 'es.application:future',
    defaultMessage: 'Hvar langar þig að vinna?',
    description: 'Some description',
  },
  dreamJob: {
    id: 'es.application:dreamJob',
    defaultMessage: 'Einhver draumavinnustaður?',
    description: 'Some description',
  },
  assigneeTitle: {
    id: 'es.application:assigneeTitle',
    defaultMessage: 'Hver á að fara yfir?',
    description: 'Some description',
  },
  assignee: {
    id: 'es.application:assignee',
    defaultMessage: 'Assignee email',
    description: 'Some description',
  },
  yesOptionLabel: {
    id: 'es.application:yes.option.label',
    defaultMessage: 'Já',
    description: 'Some description',
  },
  noOptionLabel: {
    id: 'es.application:no.option.label',
    defaultMessage: 'Nei',
    description: 'Some description',
  },
  governmentOptionLabel: {
    id: 'es.application:government.option.label',
    defaultMessage: 'The government',
    description: 'Some description',
  },
  outroMessage: {
    id: 'es.application:outro.message',
    defaultMessage:
      'Your application #{id} is now in review. The ID of the application is returned by the createApplication API action and read from application.externalData',
    description: 'Some description',
  },
  dataSchemePhoneNumber: {
    id: 'es.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
  dataSchemeNationalId: {
    id: 'es.application:dataSchema.national.id',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'Error message when the kennitala is invalid.',
  },
})
