import { defineMessages } from 'react-intl'

export const m = defineMessages({
  conditionsSection: {
    id: 'pay.application:conditions.section',
    defaultMessage: 'Skilyrði',
    description: 'Some description',
  },
  institutionName: {
    id: 'pay.application.institution',
    defaultMessage: 'Institution reference',
    description: `Institution's name`,
  },
  name: {
    id: 'pay.application:name',
    defaultMessage: 'Umsókn um greiðslu',
    description: `Application's name`,
  },
  draftTitle: {
    id: 'pay.application:draft.title',
    defaultMessage: 'Umsókn um greiðslu',
    description: 'First state title',
  },
  draftDescription: {
    id: 'pay.application:draft.description',
    defaultMessage: 'Umsókn um að greiða gjald hjá TBR / Greiðsluveitu',
    description: 'Description of the state',
  },
  introSection: {
    id: 'pay.application:intro.section',
    defaultMessage: 'Upplýsingar',
    description: 'Some description',
  },
  introField: {
    id: 'pay.application:intro.field',
    defaultMessage: 'Velkomin(n)',
    description: 'Some description',
  },
  introIntroduction: {
    id: 'pay.application:intro.introduction',
    defaultMessage:
      '*Hello*, **{name}**! [This is a link to Google!](http://google.com)',
    description: 'Some description',
  },
  about: {
    id: 'pay.application:about',
    defaultMessage: 'Um þig',
    description: 'Some description',
  },
  personName: {
    id: 'pay.application:person.name',
    defaultMessage: 'Nafn',
    description: 'Some description',
  },
  nationalId: {
    id: 'pay.application:person.nationalId',
    defaultMessage: 'Kennitala',
    description: 'Some description',
  },
  age: {
    id: 'pay.application:person.age',
    defaultMessage: 'Aldur',
    description: 'Some description',
  },
  email: {
    id: 'pay.application:person.email',
    defaultMessage: 'Netfang',
    description: 'Some description',
  },
  phoneNumber: {
    id: 'pay.application:person.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Some description',
  },
  career: {
    id: 'pay.application:career',
    defaultMessage: 'Starfsferill',
    description: 'Some description',
  },
  history: {
    id: 'pay.application:history',
    defaultMessage: 'Hvar hefur þú unnið áður?',
    description: 'Some description',
  },
  careerHistory: {
    id: 'pay.application:careerHistory',
    defaultMessage: 'Hefurðu unnið yfir höfuð einhvern tímann áður?',
    description: 'Some description',
  },
  careerHistoryCompanies: {
    id: 'pay.application:careerHistoryCompanies',
    defaultMessage: 'Hefurðu unnið fyrir eftirfarandi aðila?',
    description: 'Some description',
  },
  future: {
    id: 'pay.application:future',
    defaultMessage: 'Hvar langar þig að vinna?',
    description: 'Some description',
  },
  dreamJob: {
    id: 'pay.application:dreamJob',
    defaultMessage: 'Einhver draumavinnustaður?',
    description: 'Some description',
  },
  yesOptionLabel: {
    id: 'pay.application:yes.option.label',
    defaultMessage: 'Já',
    description: 'Some description',
  },
  noOptionLabel: {
    id: 'pay.application:no.option.label',
    defaultMessage: 'Nei',
    description: 'Some description',
  },
  governmentOptionLabel: {
    id: 'pay.application:government.option.label',
    defaultMessage: 'The government',
    description: 'Some description',
  },
  outroMessage: {
    id: 'pay.application:outro.message',
    defaultMessage:
      'Your application #{id} is now in review. The ID of the application is returned by the createApplication API action and read from application.externalData',
    description: 'Some description',
  },
  dataSchemePhoneNumber: {
    id: 'pay.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
  dataSchemeNationalId: {
    id: 'pay.application:dataSchema.national.id',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'Error message when the kennitala is invalid.',
  },
})
