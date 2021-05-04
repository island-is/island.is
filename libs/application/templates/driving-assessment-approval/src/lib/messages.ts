import { defineMessages } from 'react-intl'

export const m = defineMessages({
  externalDataAgreement: {
    id: 'dl.application:externalData.agreement',
    defaultMessage: 'Ég hef kynnt mér ofangreint',
    description: 'I understand',
  },
  conditionsSection: {
    id: 'dl.application:conditions.section',
    defaultMessage: 'Forsendur',
    description: 'Conditions',
  },
  name: {
    id: 'dl.application:name',
    defaultMessage: 'Akstursmat',
    description: `Application's name`,
  },
  draftTitle: {
    id: 'dl.application:draft.title',
    defaultMessage: 'Drög',
    description: 'First state title',
  },
  draftDescription: {
    id: 'dl.application:draft.description',
    defaultMessage: 'Staðfesting á að nemandi hafi staðist akstursmat',
    description: 'Description of the state',
  },
  introSection: {
    id: 'dl.application:intro.section',
    defaultMessage: 'Upplýsingar',
    description: 'Some description',
  },
  introField: {
    id: 'dl.application:intro.field',
    defaultMessage: 'Velkomin(n)',
    description: 'Some description',
  },
  introIntroduction: {
    id: 'dl.application:intro.introduction',
    defaultMessage:
      '*Hello*, **{name}**! [This is a link to Google!](http://google.com)',
    description: 'Some description',
  },
  about: {
    id: 'dl.application:about',
    defaultMessage: 'Um þig',
    description: 'Some description',
  },
  personName: {
    id: 'dl.application:person.name',
    defaultMessage: 'Nafn',
    description: 'Some description',
  },
  nationalId: {
    id: 'dl.application:person.nationalId',
    defaultMessage: 'Kennitala',
    description: 'Some description',
  },
  age: {
    id: 'dl.application:person.age',
    defaultMessage: 'Aldur',
    description: 'Some description',
  },
  email: {
    id: 'dl.application:person.email',
    defaultMessage: 'Netfang',
    description: 'Some description',
  },
  phoneNumber: {
    id: 'dl.application:person.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Some description',
  },
  career: {
    id: 'dl.application:career',
    defaultMessage: 'Starfsferill',
    description: 'Some description',
  },
  history: {
    id: 'dl.application:history',
    defaultMessage: 'Hvar hefur þú unnið áður?',
    description: 'Some description',
  },
  careerHistory: {
    id: 'dl.application:careerHistory',
    defaultMessage: 'Hefurðu unnið yfir höfuð einhvern tímann áður?',
    description: 'Some description',
  },
  careerHistoryCompanies: {
    id: 'dl.application:careerHistoryCompanies',
    defaultMessage: 'Hefurðu unnið fyrir eftirfarandi aðila?',
    description: 'Some description',
  },
  future: {
    id: 'dl.application:future',
    defaultMessage: 'Hvar langar þig að vinna?',
    description: 'Some description',
  },
  dreamJob: {
    id: 'dl.application:dreamJob',
    defaultMessage: 'Einhver draumavinnustaður?',
    description: 'Some description',
  },
  yesOptionLabel: {
    id: 'dl.application:yes.option.label',
    defaultMessage: 'Já',
    description: 'Some description',
  },
  noOptionLabel: {
    id: 'dl.application:no.option.label',
    defaultMessage: 'Nei',
    description: 'Some description',
  },
  governmentOptionLabel: {
    id: 'dl.application:government.option.label',
    defaultMessage: 'The government',
    description: 'Some description',
  },
  outroMessage: {
    id: 'dl.application:outro.message',
    defaultMessage:
      'Your application #{id} is now in review. The ID of the application is returned by the createApplication API action and read from application.externalData',
    description: 'Some description',
  },
  dataSchemePhoneNumber: {
    id: 'dl.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
  dataSchemeNationalId: {
    id: 'dl.application:dataSchema.national.id',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'Error message when the kennitala is invalid.',
  },
  dataSchemeDrivingAssmentApprovalCheck: {
    id: 'dl.application:dataSchema.drivingAssessmentConfirmation',
    defaultMessage: 'Vinsamlegast staðfestu að viðkomandi hafi lokið akstursmati',
    description: 'Vinsamlegast staðfestu að viðkomandi hafi lokið akstursmati',
  },
  nationalRegistryTitle: {
    id: 'dl.application:nationalRegistry.title',
    defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
    description: 'Personal information from the National Registry',
  },
  nationalRegistrySubTitle: {
    id: 'dl.application:nationalRegistry.subTitle',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
    description:
      'Information from the National Registry will be used to prefill the data in the application',
  },
  userProfileInformationTitle: {
    id: 'pl.application:userprofile.title',
    defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
    description: 'Your user profile information',
  },
  userProfileInformationSubTitle: {
    id: 'pl.application:userprofile.subTitle',
    defaultMessage:
      'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
    description:
      'In order to apply for this application we need your email and phone number',
  },
})
