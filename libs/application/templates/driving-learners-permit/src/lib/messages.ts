import { defineMessages } from 'react-intl'

export const m = defineMessages({
  /* --------------------- */
  /* PREREQUISITES SECTION */
  /* --------------------- */

  /* External Data Section */
  externalDataSectionTitle: {
    id: 'dlp.application:externalDataSectionTitle',
    defaultMessage: 'Gagnaöflun fyrir umsókn',
    description: 'Title for external data acquisition',
  },

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
    defaultMessage: 'Skilyrði leiðbeinanda',
    description: 'title for requirement section of mentor',
  },
  applicationStudentRequirementsTitle: {
    id: 'dlp.application:applicationStudentRequirementsTitle',
    defaultMessage: 'Skilyrði nemanda',
    description: 'title for requirement section of learner driver',
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
  studentIsMentorableHeader: {
    id: 'dlp.application:studentIsMentorableHeader',
    defaultMessage: 'Æfingarleyfi gilt',
    description: 'Heading text for a student who is mentorable',
  },
  studentIsMentorableDescription: {
    id: 'dlp.application:studentIsMentorableDescription',
    defaultMessage:
      'Nemandi uppfyllir þær kröfur sem gerðar eru til þess að mega byrja æfingaakstur',
    description: 'Description text for a student who is mentorable',
  },
  studentIsNotMentorableHeader: {
    id: 'dlp.application:studentIsNotMentorableHeader',
    defaultMessage: 'Æfingarleyfi ógilt',
    description: 'Heading text for a student who is not mentorable',
  },
  studentIsNotMentorableDescription: {
    id: 'dlp.application:studentIsNotMentorableDescription',
    defaultMessage:
      'Nemandi uppfyllir ekki þær kröfur sem gerðar eru til þess að mega byrja æfingaakstur',
    description: 'Description text for a student who is not mentorable',
  },

  /* ------------ */
  /* DONE SECTION */
  /* ------------ */
  doneTitle: {
    id: 'dlp.application:doneTitle',
    defaultMessage: 'Umsókn móttekin',
    description: 'Application received/done section title',
  },
  doneInfo: {
    id: 'dlp.application:doneInfo',
    defaultMessage:
      'Umsókn hefur verið móttekin. Leiðbeinendaréttindi munu berast í pósti lorem ipsum dolor ist amet...',
    description: 'Info displayed to applicant upon application completion',
  },

  /* ----- */
  /* OTHER */
  /* ----- */
  name: {
    id: 'dlp.application:name',
    defaultMessage: 'Umsókn um leiðbeinendaréttindi æfingaaksturs',
    description: 'Name of application',
  },
  institutionName: {
    id: 'dlp.application:institutionName',
    defaultMessage: 'Ökubók',
    description: 'Name of institution for the application',
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
