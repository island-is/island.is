import { defineMessages } from 'react-intl'

export const m = defineMessages({
  externalDataTitle: {
    id: 'dla.application:externalData.title',
    defaultMessage: 'Forsendur í akstursmati',
    description: 'Title for data section',
  },
  externalDataSubtitle: {
    id: 'dla.application:externalData.subtitle',
    defaultMessage:
      'Upplýsingar um núverandi ökuréttindi verða sótt í Ökuskírteinaskrá',
    description: 'Subtitle for data section',
  },
  externalDataAgreement: {
    id: 'dla.application:externalData.agreement',
    defaultMessage: 'Ég hef kynnt mér ofangreint',
    description: 'I understand',
  },
  externalDataTeachingRightsTitle: {
    id: 'dla.application:externalData.teachingRights.title',
    defaultMessage: 'Staðfesting á réttindum',
    description:
      'title of external data provider for getting teaching rights - title',
  },
  externalDataTeachingRightsSubtitle: {
    id: 'dla.application:externalData.teachingRights.subtitle',
    defaultMessage:
      'Við munum sækja skráningu þína úr ökuskírteinaskrá til að athuga hvort þú hafir sannarlega ökukennararéttindi',
    description:
      'title of external data provider for getting teaching rights - description',
  },

  conditionsSection: {
    id: 'dla.application:conditions.section',
    defaultMessage: 'Forsendur',
    description: 'Conditions',
  },
  name: {
    id: 'dla.application:name',
    defaultMessage: 'Akstursmat',
    description: `Application's name`,
  },
  draftTitle: {
    id: 'dla.application:draft.title',
    defaultMessage: 'Drög',
    description: 'First state title',
  },
  draftDescription: {
    id: 'dla.application:draft.description',
    defaultMessage: 'Staðfesting á að nemandi hafi staðist akstursmat',
    description: 'Description of the state',
  },
  introSection: {
    id: 'dla.application:intro.section',
    defaultMessage: 'Upplýsingar',
    description: 'Some description',
  },
  introField: {
    id: 'dla.application:intro.field',
    defaultMessage: 'Velkomin(n)',
    description: 'Some description',
  },
  introIntroduction: {
    id: 'dla.application:intro.introduction',
    defaultMessage:
      '*Hello*, **{name}**! [This is a link to Google!](http://google.com)',
    description: 'Some description',
  },
  about: {
    id: 'dla.application:about',
    defaultMessage: 'Um þig',
    description: 'Some description',
  },
  personName: {
    id: 'dla.application:person.name',
    defaultMessage: 'Nafn',
    description: 'Some description',
  },
  nationalId: {
    id: 'dla.application:person.nationalId',
    defaultMessage: 'Kennitala',
    description: 'Some description',
  },
  age: {
    id: 'dla.application:person.age',
    defaultMessage: 'Aldur',
    description: 'Some description',
  },
  email: {
    id: 'dla.application:person.email',
    defaultMessage: 'Netfang',
    description: 'Some description',
  },
  phoneNumber: {
    id: 'dla.application:person.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Some description',
  },
  career: {
    id: 'dla.application:career',
    defaultMessage: 'Starfsferill',
    description: 'Some description',
  },
  history: {
    id: 'dla.application:history',
    defaultMessage: 'Hvar hefur þú unnið áður?',
    description: 'Some description',
  },
  careerHistory: {
    id: 'dla.application:careerHistory',
    defaultMessage: 'Hefurðu unnið yfir höfuð einhvern tímann áður?',
    description: 'Some description',
  },
  careerHistoryCompanies: {
    id: 'dla.application:careerHistoryCompanies',
    defaultMessage: 'Hefurðu unnið fyrir eftirfarandi aðila?',
    description: 'Some description',
  },
  future: {
    id: 'dla.application:future',
    defaultMessage: 'Hvar langar þig að vinna?',
    description: 'Some description',
  },
  dreamJob: {
    id: 'dla.application:dreamJob',
    defaultMessage: 'Einhver draumavinnustaður?',
    description: 'Some description',
  },
  yesOptionLabel: {
    id: 'dla.application:yes.option.label',
    defaultMessage: 'Já',
    description: 'Some description',
  },
  noOptionLabel: {
    id: 'dla.application:no.option.label',
    defaultMessage: 'Nei',
    description: 'Some description',
  },
  governmentOptionLabel: {
    id: 'dla.application:government.option.label',
    defaultMessage: 'The government',
    description: 'Some description',
  },
  outroMessage: {
    id: 'dla.application:outro.message',
    defaultMessage: 'Akstursmat komið áleiðis',
    description: 'Some description',
  },
  error: {
    id: 'dla.application:outro.error',
    defaultMessage: 'Ekki er víst að akstursmat hafi borist',
    description: 'Some description',
  },
  dataSchemePhoneNumber: {
    id: 'dla.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
  dataSchemeNationalId: {
    id: 'dla.application:dataSchema.national.id',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'Error message when the kennitala is invalid.',
  },
  dataSchemeDrivingAssmentApprovalCheck: {
    id: 'dla.application:dataSchema.drivingAssessmentConfirmation',
    defaultMessage:
      'Vinsamlegast staðfestu að viðkomandi hafi lokið akstursmati',
    description: 'Vinsamlegast staðfestu að viðkomandi hafi lokið akstursmati',
  },
  nationalRegistryTitle: {
    id: 'dla.application:nationalRegistry.title',
    defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
    description: 'Personal information from the National Registry',
  },
  nationalRegistrySubTitle: {
    id: 'dla.application:nationalRegistry.subTitle',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út umsóknina',
    description:
      'Information from the National Registry will be used to prefill the data in the application',
  },
  userProfileInformationTitle: {
    id: 'dla.application:userprofile.title',
    defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
    description: 'Your user profile information',
  },
  userProfileInformationSubTitle: {
    id: 'dla.application:userprofile.subTitle',
    defaultMessage:
      'Til þess að auðvelda umsóknarferlið er gott að hafa fyllt út netfang og símanúmer á mínum síðum',
    description:
      'In order to apply for this application we need your email and phone number',
  },
  student: {
    id: 'dla.application:student',
    defaultMessage: 'Nemandi',
    description: 'Student driver',
  },
  errorOrNoTemporaryLicense: {
    id: 'dla.application:error.noTempLicense',
    defaultMessage:
      'Kennitala fannst ekki eða nemandi er ekki með bráðabirgðaskírteini',
    description:
      'The national ID was not found or the student does not have a valid temporary driving license.',
  },
  prereqTitle: {
    id: 'dla.application:PrerequisitesDraft.title',
    defaultMessage: 'Akstursmat',
    description: 'Driving assessment',
  },
  studentInformation: {
    id: 'dla.application:student.title',
    defaultMessage: 'Upplýsingar um nemanda',
    description: 'Information about driving student.',
  },
  infoTitle: {
    id: 'dla.application:info.title',
    defaultMessage: 'Upplýsingar um nemanda',
    description: 'Information about driving student.',
  },
  infoDescription: {
    id: 'dla.application:info.description',
    defaultMessage: 'Sláðu inn kennitölu og netfang nemanda',
    description: 'Enter the national ID and email of driving student.',
  },
  studentNationalId: {
    id: 'dla.application:student.nationalId',
    defaultMessage: 'Kennitala nemanda',
    description: 'National ID of driving student',
  },
  studentEmail: {
    id: 'dla.application:student.email',
    defaultMessage: 'Netfang',
    description: 'E-mail of driving student',
  },
  studentLookup: {
    id: 'dla.application:student.lookup',
    defaultMessage: 'Uppfletting nemanda',
    description: 'Driving student lookup',
  },
  approvalAssessment: {
    id: 'dla.application:approval.assessment',
    defaultMessage: 'Akstursmat',
    description: 'Driving assessment',
  },
  drivingAssessmentConfirmation: {
    id: 'dla.application:confirmation',
    defaultMessage: 'Staðfesting akstursmats',
    description: 'Confirmation of driving assessment',
  },
  submitConfirmation: {
    id: 'dla.application:submit.confirmation',
    defaultMessage: 'Staðfesting',
    description: 'Confirmation',
  },
  submit: {
    id: 'dla.application:submit',
    defaultMessage: 'Staðfesta',
    description: 'Confirm',
  },
  studentLookupToShow: {
    id: 'dla.application:student.lookupToShow',
    defaultMessage: 'Uppfletting nemanda',
    description: 'Lookup the driving student',
  },
  drivingAssessmentConfirmationCheck: {
    id: 'dla.application:drivingAssessment.confirmationCheck',
    defaultMessage:
      'Ég staðfesti að akstursmat hefur farið fram í samræmi við ákvæði í reglugerð um ökuskírteini og leiðbeiningar Samgöngustofu.',
    description: 'I confirm that the student has passed the driving assessment',
  },
  finalAssessmentTitle: {
    id: 'dla.application:finalAssessmentTitle',
    defaultMessage: 'Akstursmat móttekið',
    description: 'Driving assessment received.',
  },
  assessmentReceived: {
    id: 'dla.application:assessmentReceived',
    defaultMessage: 'Móttekið',
    description: 'Assessment received.',
  },
  finalAssessmentDescription: {
    id: 'dla.application:finalAssessmentDescription',
    defaultMessage:
      'Tölvupóstur hefur verið sendur á nemanda og honum tilkynnt að ökukennari hafi staðfest að akstursmat hafi farið fram. Nemandi getur nú sótt um fullnaðarskírteini.',
    description: 'Driving assessment received description.',
  },
})
