import { defineMessages } from 'react-intl'

export const m = defineMessages({
  /* PREREQUISITES SECTION */
  introTitle: {
    id: 'dlp.application:introTitle',
    defaultMessage: 'Inngangur',
    description: 'Title for the introduction section',
  },
  introBody: {
    id: 'dlp.application:introBody#markdown',
    defaultMessage:
      '#Leyfi fyrir leiðbeinendur\n\nÁður en æfingaakstur með leiðbeinanda má hefjast, þarf ökukennari að hafa staðfest að lágmarki 10 verklega ökutíma í stafræna ökunámsbók og ökunemi þarf einnig að hafa lokið Ökuskóla 1.\n\nEftirfarandi skilyrði þarf að uppfylla til að geta sótt um að vera leiðbeinandi.\n* Hafa náð 24 ára aldri\n* Hafa gild ökuréttindi\n* 5 ára reynslu af akstri frá fyrsta ökuprófi í B flokki\n* Hafa ekki verið sviptur ökuréttindum eða refsað fyrir vítaverðan akstur síðustu 12 mánuði',
    description: 'Body for the introduction section',
  },
  externalDataSectionTitle: {
    id: 'dlp.application:externalDataSectionTitle',
    defaultMessage: 'Gagnaöflun',
    description: 'Title for external data acquisition',
  },
  externalDataSectionCheckboxLabel: {
    id: 'dlp.application:externalDataSectionCheckboxLabel',
    defaultMessage: 'Ég hef kynnt mér ofangreint',
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

  /* National Registry Provider */
  titleNationalRegistryProvider: {
    id: 'dlp.application:titleNationalRegistryProvider',
    defaultMessage: 'Persónuupplýsingar úr Þjóðskrá',
    description: 'National Registry Provider Title',
  },
  descriptionNationalRegistryProvider: {
    id: 'dlp.application:descriptionNationalRegistryProvider',
    defaultMessage:
      'Til þess að auðvelda fyrir sækjum við persónuupplýsingar úr Þjóðskrá til þess að fylla út í umsóknina.',
    description: 'National Registry Provider Description',
  },

  /* Personal Info Provider */
  titlePersonalInfoProvider: {
    id: 'dlp.application:titlePersonalInfoProvider',
    defaultMessage: 'Netfang og símanúmer úr þínum stillingum',
    description: 'Personal Info Provider Title',
  },
  descriptionPersonalInfoProvider: {
    id: 'dlp.application:descriptionPersonalInfoProvider',
    defaultMessage:
      'Til þess að geta sent þér mikilvæg skilaboð um umsóknir þínar er mikilvægt að hafa fyllt út netfang og símanúmer á Mínum síðum.',
    description: 'Personal Info Provider Description',
  },

  /* Requirements Subsection */
  applicationEligibilityTitle: {
    id: 'dlp.application:applicationEligibilityTitle',
    defaultMessage: 'Uppfletting leiðbeinanda',
    description: 'title for requirement section of mentor',
  },
  applicationStudentRequirementsTitle: {
    id: 'dlp.application:applicationStudentRequirementsTitle',
    defaultMessage: 'Uppfletting nemanda',
    description: 'title for requirement section of learner driver',
  },
  applicationEligibilityRequirementDescription: {
    id: 'dlp.application:applicationEligibilityDescription',
    defaultMessage: 'Skilyrði sem leiðbeinandi þarf að uppfylla:',
    description: 'description for requirement section of mentor',
  },
  applicationEligibilitySuccess: {
    id: 'dlp.application:applicationEligibilitySuccess',
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
    defaultMessage: 'Nafn nemanda',
    description: 'Label for student lookup name',
  },
  studentInfoHeading: {
    id: 'dlp.application:studentInfoHeading',
    defaultMessage:
      'Vinsamlegast sláðu inn kennitölu þess nemanda sem þú hyggst leiðbeina.',
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
      'Kröfur sem gerðar eru til þess að mega byrja æfingaakstur ekki uppfylltar',
    description: 'Description text for a who is not mentorable',
  },
  studentIsMentorableLoadingHeader: {
    id: 'dlp.application:studentIsMentorableLoadingHeader',
    defaultMessage: 'Sæki upplýsingar',
    description: 'Informing user that we are loading data',
  },
  studentIsMentorableLoadingDescription: {
    id: 'dlp.application:studentIsMentorableLoadingDescription',
    defaultMessage: 'Vinsamlegast bíðið á meðan upplýsingar eru sóttar...',
    description: 'Informing user that we are loading data',
  },
  studentNoLicenseBookDescription: {
    id: 'dlp.application:studentNoLicenseBookDescription',
    defaultMessage: 'Ökubók finnst ekki fyrir nemanda',
    description: 'Informing user that no license book was found for student',
  },

  /* Overview Section */
  overviewDescription: {
    id: 'dlp.application:overviewDescription',
    defaultMessage:
      'Vinsamlegast farðu yfir upplýsingarnar hér að neðan og staðfestu að þær séu réttar.',
    description: 'Description for overview section',
  },
  overviewSectionTitle: {
    id: 'dlp.application:overviewSectionTitle',
    defaultMessage: 'Yfirlit',
    description: 'Overview section title',
  },
  overviewStudentTitle: {
    id: 'dlp.application:overviewStudentTitle',
    defaultMessage: 'Upplýsingar um nemanda',
    description: 'Student title for overview section',
  },
  overviewStudentName: {
    id: 'dlp.application:overviewStudentName',
    defaultMessage: 'Nafn',
    description: 'Student name for overview section',
  },
  overviewStudentNationalId: {
    id: 'dlp.application:overviewStudentNationalId',
    defaultMessage: 'Kennitala',
    description: 'Student national id for overview section',
  },
  overviewSubmitButton: {
    id: 'dlp.application:overviewSubmitButton',
    defaultMessage: 'Senda inn umsókn',
    description: '',
  },

  /* DONE SECTION */
  doneTitle: {
    id: 'dlp.application:doneTitle',
    defaultMessage: 'Umsókn móttekin',
    description: 'Application received/done section title',
  },
  doneInfo: {
    id: 'dlp.application:doneInfo',
    defaultMessage:
      'Umsókn þín um að gerast leiðbeinandi nemanda hefur verið móttekin.',
    description: 'Info displayed to applicant upon application completion',
  },
  doneDescriptionBody: {
    id: 'dlp.application:doneDescriptionBody#markdown',
    defaultMessage:
      '## Leyfisbréf leiðbeinanda verður sent í pósthólf þitt á Ísland.is\nAlltaf skal hafa leyfið meðferðis við æfingaakstur. Óheimilt er að taka endurgjald fyrir að leiðbeina ökunema. Fylgi leiðbeinandi ekki reglum um æfingaakstur eða fullnægi ekki lengur skilyrðum getur sýslumaður afturkallað leyfið.\n\nSamgöngustofa gefur út leiðbeiningar um æfingaakstur og skal ökukennari veita leiðbeinanda aðstoð við skipulagningu akstursins og gefa leiðbeinanda kost á að fylgjast með a.m.k. einni klukkustund í akstri. Auðkenna skal bifreið sem nota á til æfingaaksturs samkvæmt reglum Samgöngustofu.',
    description: 'Description of what happens next',
  },

  /* OTHER */
  name: {
    id: 'dlp.application:name',
    defaultMessage: 'Umsókn um að gerast leiðbeinandi í æfingaakstri B-flokk',
    description: 'Name of application',
  },
  institutionName: {
    id: 'dlp.application:institutionName',
    defaultMessage: 'Ökunámsbók',
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
    id: 'dlp.application:requirementunmet.ageRequirementDescription',
    defaultMessage:
      'Leiðbeinandi þarf að hafa náð 24 ára aldri a.m.k til að gerast leiðbeinandi',
    description: 'Learner age requirement description',
  },
  notFulfilled: {
    id: 'dlp.application:requirementunmet.notFulfilled',
    defaultMessage: 'Kröfur ekki uppfylltar',
    description: 'Requirements not fulfilled',
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
      'Leiðbeinandi þarf að hafa haft gild ökuréttindi fyrir B-flokk í að minnsta kosti 5 ár',
    description:
      'requirement unmet valid license for five years or more description',
  },
})
