import { defineMessages } from 'react-intl'

export const m = defineMessages({
  /* --------------------- */
  /* PREREQUISITES SECTION */
  /* --------------------- */

  /* Current License Provider */
  titleCurrentLicenseProvider: {
    id: 'dlp.application:titleCurrentLicenseProvider',
    defaultMessage: 'Upplýsingar úr Ökuskírteinaskrá',
    description: 'Current License Provider Title',
  },
  descriptionCurrentLicenseProvider: {
    id: 'dlp.application:descriptionCurrentLicenseProvider',
    defaultMessage:
      'Sóttar eru almennar upplýsingar um núverandi réttindi, sviptingar, punktastöðu og akstursmat ef við á.',
    description: 'Current License Provider Title',
  },
  errorCurrentLicenseProvider: {
    id: 'dlp.application:errorCurrentLicenseProvider',
    defaultMessage:
      'Tókst ekki að sækja upplýsingar um núgildandi ökuskírteini',
    description:
      "Message to display when user's Driver License Data cannot be retrieved",
  },

  /* Requirements Subsection */
  applicationEligibilityTitle: {
    id: 'dlp.application:applicationEligibilityTitle',
    defaultMessage: 'Skilyrði umsóknar',
    description: 'title for requirement section',
  },
  eligibilityRequirementTitle: {
    id: 'dlp.application:eligibilityTitle',
    defaultMessage: 'Skilyrði sem umsækjandi þarf að uppfylla',
    description: 'title for requirement component',
  },
  externalDataComplete: {
    id: 'dlp.application:externalData.complete',
    defaultMessage: 'Uppfletting í lagi',
    description: 'Information',
  },

  /* Lookup Student Subsection */
  applicationStudentLookupTitle: {
    id: 'dlp.application:applicationStudentLookupTitle',
    defaultMessage: 'Uppfletting nemanda',
    description: 'Application title for student lookup subssection',
  },
  errorNationalIdNoName: {
    id: 'dlp.application:error.errorNationalIdNoName',
    defaultMessage:
      'Villa kom upp við að sækja nafn útfrá kennitölu. Vinsamlegast prófaðu aftur síðar',
    description: 'No name found for national id in national registry',
  },
  errorNationalIdMentorableLookup: {
    id: 'dlp.application:error.errorNationalIdMentorableLookup',
    defaultMessage:
      'Ekki tókst að sækja upplýsingar um hvort nemandi eigi rétt á að hefja æfingaakstur',
    description: "Error: Student learner's driving eligibility lookup error",
  },
  studentNationalIdLabel: {
    id: 'dlp.application:studentNationalIdLabel',
    defaultMessage: 'Kennitala nemanda',
    description: 'Label for student national id input',
  },
  studentNameLabel: {
    id: 'dlp.application:studentNameLabel',
    defaultMessage: 'Nafn',
    description: 'Label for student lookup name',
  },
  studentInfoHeading: {
    id: 'dlp.application:studentInfoHeading',
    defaultMessage: 'Upplýsingar nemanda',
    description: 'Heading text for student info',
  },

  /* ----- */
  /* OTHER */
  /* ----- */
  conditionsSection: {
    id: 'example.application:conditions.section',
    defaultMessage: 'Skilyrði',
    description: 'Some description',
  },
  institutionName: {
    id: 'example.application.institution',
    defaultMessage: 'Institution reference',
    description: `Institution's name`,
  },
  name: {
    id: 'example.application:name',
    defaultMessage: 'Umsókn',
    description: `Application's name`,
  },
  draftTitle: {
    id: 'example.application:draft.title',
    defaultMessage: 'Drög',
    description: 'First state title',
  },
  draftDescription: {
    id: 'example.application:draft.description',
    defaultMessage: 'Notendur hafa ekkert að gera á þessu stigi',
    description: 'Description of the state',
  },
  introSection: {
    id: 'example.application:intro.section',
    defaultMessage: 'Upplýsingar',
    description: 'Some description',
  },
  introField: {
    id: 'example.application:intro.field',
    defaultMessage: 'Velkomin(n)',
    description: 'Some description',
  },
  introIntroduction: {
    id: 'example.application:intro.introduction',
    defaultMessage:
      '*Hello*, **{name}**! [This is a link to Google!](http://google.com)',
    description: 'Some description',
  },
  about: {
    id: 'example.application:about',
    defaultMessage: 'Um þig',
    description: 'Some description',
  },
  personName: {
    id: 'example.application:person.name',
    defaultMessage: 'Nafn',
    description: 'Some description',
  },
  nationalId: {
    id: 'example.application:person.nationalId',
    defaultMessage: 'Kennitala',
    description: 'Some description',
  },
  age: {
    id: 'example.application:person.age',
    defaultMessage: 'Aldur',
    description: 'Some description',
  },
  email: {
    id: 'example.application:person.email',
    defaultMessage: 'Netfang',
    description: 'Some description',
  },
  phoneNumber: {
    id: 'example.application:person.phoneNumber',
    defaultMessage: 'Símanúmer',
    description: 'Some description',
  },
  career: {
    id: 'example.application:career',
    defaultMessage: 'Starfsferill',
    description: 'Some description',
  },
  history: {
    id: 'example.application:history',
    defaultMessage: 'Hvar hefur þú unnið áður?',
    description: 'Some description',
  },
  careerHistory: {
    id: 'example.application:careerHistory',
    defaultMessage: 'Hefurðu unnið yfir höfuð einhvern tímann áður?',
    description: 'Some description',
  },
  careerHistoryCompanies: {
    id: 'example.application:careerHistoryCompanies',
    defaultMessage: 'Hefurðu unnið fyrir eftirfarandi aðila?',
    description: 'Some description',
  },
  future: {
    id: 'example.application:future',
    defaultMessage: 'Hvar langar þig að vinna?',
    description: 'Some description',
  },
  dreamJob: {
    id: 'example.application:dreamJob',
    defaultMessage: 'Einhver draumavinnustaður?',
    description: 'Some description',
  },
  assigneeTitle: {
    id: 'example.application:assigneeTitle',
    defaultMessage: 'Hver á að fara yfir?',
    description: 'Some description',
  },
  assignee: {
    id: 'example.application:assignee',
    defaultMessage: 'Assignee email',
    description: 'Some description',
  },
  yesOptionLabel: {
    id: 'example.application:yes.option.label',
    defaultMessage: 'Já',
    description: 'Some description',
  },
  noOptionLabel: {
    id: 'example.application:no.option.label',
    defaultMessage: 'Nei',
    description: 'Some description',
  },
  governmentOptionLabel: {
    id: 'example.application:government.option.label',
    defaultMessage: 'The government',
    description: 'Some description',
  },
  outroMessage: {
    id: 'example.application:outro.message',
    defaultMessage:
      'Your application #{id} is now in review. The ID of the application is returned by the createApplication API action and read from application.externalData',
    description: 'Some description',
  },
  dataSchemePhoneNumber: {
    id: 'example.application:dataSchema.phoneNumber',
    defaultMessage: 'Símanúmerið þarf að vera gilt.',
    description: 'Error message when phone number is invalid.',
  },
  dataSchemeNationalId: {
    id: 'example.application:dataSchema.national.id',
    defaultMessage: 'Kennitala þarf að vera gild.',
    description: 'Error message when the kennitala is invalid.',
  },
})

export const requirementsMessages = defineMessages({
  ageRequirementTitle: {
    id: 'dlp.application:requirementunmet.ageRequirementTitle',
    defaultMessage: 'Leiðbeinandi 24 ára eða eldri',
    description: 'Learner age requirement title',
  },
  ageRequirementDescription: {
    id: 'dlp.application:requirementunmet.ageRequirementTitle',
    defaultMessage:
      'Leiðbeinandi þarf að hafa náð 24 ára aldri a.m.k til að gerast leiðbeinandi',
    description: 'Learner age requirement description',
  },
  rlsAcceptedDescription: {
    id: 'dlp.application:requirementunmet.accepted',
    defaultMessage: 'Þú uppfyllir þær kröfur sem gerðar eru',
    description: 'RLS / driving license api approves of the applicant',
  },
  rlsDefaultDeniedDescription: {
    id: 'dlp.application:requirementunmet.deniedbyservicedescription',
    defaultMessage:
      'Vinsamlega hafðu samband við næsta sýslumannsembætti til að fá frekari upplýsingar.',
    description:
      'requirement unmet api returned false for an unspecified reason',
  },
  invalidLicense: {
    id: 'dlp.application:requirementunmet.invalidlicense',
    defaultMessage:
      'Bráðabirgðaskírteini er ekki til staðar. Vinsamlega hafðu samband við næsta sýslumannsembætti til að fá frekari upplýsingar.',
    description:
      'requirement unmet api returned NO_TEMP_LICENSE / NO_LICENSE_FOUND',
  },
  hasPointsOrDeprivation: {
    id: 'dlp.application:requirementunmet.haspointsordeprivation',
    defaultMessage:
      'Þú ert með punkta eða sviptingu. Vinsamlega hafðu samband við næsta sýslumannsembætti til að fá frekari upplýsingar.',
    description: 'requirement unmet api returned HAS_DEPRIVATION / HAS_POINTS',
  },
  drivingAssessmentTitle: {
    id: 'dlp.application:requirementunmet.drivingassessmenttitle',
    defaultMessage: 'Akstursmat',
    description: 'requirement unmet assessment',
  },
  drivingAssessmentDescription: {
    id: 'dlp.application:requirementunmet.drivingassessmentdescription',
    defaultMessage:
      'Ef þú ert búinn að fara í akstursmat hjá ökukennara biddu hann um að staðfesta það rafrænt.',
    description: 'requirement unmet assessment',
  },
  drivingSchoolTitle: {
    id: 'dlp.application:requirementunmet.drivingschooltitle',
    defaultMessage: 'Ökuskóli 3',
    description: 'requirement unmet driving school',
  },
  drivingSchoolDescription: {
    id: 'dlp.application:requirementunmet.drivingschooldescription',
    defaultMessage:
      'Umsækjandi þarf að hafa klárað Ökuskóla 3 til að fá fullnaðarskírteini.',
    description: 'requirement unmet driving school',
  },
  rlsTitle: {
    id: 'dlp.application:requirementunmet.deniedbyservicetitle',
    defaultMessage: 'Ökuskírteinaskrá',
    description: 'requirement unmet api returned false',
  },
  localResidencyTitle: {
    id: 'dlp.application:requirementunmet.localResidencyTitle',
    defaultMessage: 'Búseta á Íslandi',
    description: 'requirement unmet api returned false',
  },
  localResidencyDescription: {
    id: 'dlp.application:requirementunmet.localResidencyDescription',
    defaultMessage:
      'Þú þarft að hafa búið að minnsta kosti 180 daga af síðustu 365 dögum á Íslandi til að geta sótt um ökuskírteini.',
    description: 'requirement unmet api returned false',
  },
  currentLocalResidencyDescription: {
    id: 'dlp.application:requirementunmet.currentLocalResidencyDescription',
    defaultMessage:
      'Þú þarft að hafa búsetu á Íslandi til að geta sótt um fullnaðarskírteini.',
    description: 'requirement unmet api returned false',
  },
  validForFiveYearsTitle: {
    id: 'dlp.application:requirementunmet.validForFiveYearsTitle',
    defaultMessage: 'Gilt skírteini í a.m.k 5 ár',
    description: 'requirement unmet valid license for five years or more title',
  },
  validForFiveYearsDescription: {
    id: 'dlp.application:requirementunmet.validForFiveYearsDescription',
    defaultMessage:
      'Leiðbeinandi þarf að hafa haft gild ökuréttindi fyrir bifreiðar, ekki bifhjól, í að minnsta kosti 5 ár',
    description:
      'requirement unmet valid license for five years or more description',
  },
})
