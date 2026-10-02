import { defineMessages } from 'react-intl'

export const edMessage = defineMessages({
  courseName: {
    id: 'sp.education-secondary-school:course-name',
    defaultMessage: 'Námsgrein',
  },
  courseId: {
    id: 'sp.education-secondary-school:course-id',
    defaultMessage: 'Brautarheiti',
  },
  units: {
    id: 'sp.education-secondary-school:units',
    defaultMessage: 'Einingar',
  },
  grade: {
    id: 'sp.education-secondary-school:grade',
    defaultMessage: 'Einkunn',
  },
  dateShort: {
    id: 'sp.education-secondary-school:date-short',
    defaultMessage: 'Dags.',
  },
  status: {
    id: 'sp.education-secondary-school:status',
    defaultMessage: 'Staða',
  },
  total: {
    id: 'sp.education-secondary-school:total',
    defaultMessage: 'Samtals',
  },
  view: {
    id: 'sp.education-secondary-school:view',
    defaultMessage: 'Skoða',
  },
  viewCareer: {
    id: 'sp.education-secondary-school:view-career',
    defaultMessage: 'Skoða námsferil',
  },
  graduations: {
    id: 'sp.education-secondary-school:graduations',
    defaultMessage: 'Útskriftir',
  },
  graduationData: {
    id: 'sp.education-secondary-school:graduation-data',
    defaultMessage: 'Útskriftargögn nemanda.',
  },
  graduationPath: {
    id: 'sp.education-secondary-school:graduation-path',
    defaultMessage: 'Námsbraut.',
  },
  school: {
    id: 'sp.education-secondary-school:school',
    defaultMessage: 'Skóli',
  },
  graduationDate: {
    id: 'sp.education-secondary-school:graduation-date',
    defaultMessage: 'Dagsetning úskriftar',
  },
  overview: {
    id: 'sp.education-secondary-school:overview',
    defaultMessage: 'Yfirlit',
  },
  gradFooter: {
    id: 'sp.education-secondary-school:grad-footer',
    defaultMessage:
      'Ef upplýsingar hér eru ekki réttar er bent á að hafa samband við þjónustuaðila, MMS.',
  },
  careerIntro: {
    id: 'sp.education-secondary-school:career-intro',
    defaultMessage:
      'Hér getur þú séð yfirlit yfir námsferil þinn úr framhaldsskóla',
  },
})

export const primarySchoolMessages = defineMessages({
  studentListIntro: {
    id: 'sp.education-primary-school:student-list-intro',
    defaultMessage:
      'Hér getur þú fundið yfirlit yfir grunnskólanám barna þinna.',
  },
  studentListCta: {
    id: 'sp.education-primary-school:student-list-cta',
    defaultMessage: 'Skoða upplýsingar',
  },
  studentHubIntro: {
    id: 'sp.education-primary-school:student-hub-intro',
    defaultMessage: 'Hér getur þú fundið yfirlit, námsmat og heimildir',
  },
  assessmentTitle: {
    id: 'sp.education-primary-school:assessment-title',
    defaultMessage: 'Námsmat',
  },
  // Overview screen
  studentLabel: {
    id: 'sp.education-primary-school:student-label',
    defaultMessage: 'Nemandi',
  },
  schoolLabel: {
    id: 'sp.education-primary-school:school-label',
    defaultMessage: 'Grunnskóli',
  },
  changeSchool: {
    id: 'sp.education-primary-school:change-school',
    defaultMessage: 'Breyta skólavist',
  },
  contactTeacher: {
    id: 'sp.education-primary-school:contact-teacher',
    defaultMessage: 'Umsjónarkennari',
  },
  homeRoom: {
    id: 'sp.education-primary-school:home-room',
    defaultMessage: 'Umsjónarbekkur',
  },
  // Assessment screen
  schoolYear: {
    id: 'sp.education-primary-school:school-year',
    defaultMessage: 'Skólaár',
  },
  gradeLevel: {
    id: 'sp.education-primary-school:grade-level',
    defaultMessage: 'Bekkur',
  },
  gradeLevelFormatted: {
    id: 'sp.education-primary-school:grade-level-formatted',
    defaultMessage: '{grade}. bekkur',
  },
  examSitting: {
    id: 'sp.education-primary-school:exam-sitting',
    defaultMessage: 'Lagt fyrir',
  },
  viewResults: {
    id: 'sp.education-primary-school:view-results',
    defaultMessage: 'Sjá niðurstöður',
  },
  downloadResults: {
    id: 'sp.education-primary-school:download-results',
    defaultMessage: 'Niðurstöður',
  },
  child: {
    id: 'sp.education-primary-school:child',
    defaultMessage: 'Barn',
  },
  assessmentNoData: {
    id: 'sp.education-primary-school:assessment-no-data',
    defaultMessage:
      'Ef þú telur þig eiga gögn sem ættu að birtast hér, vinsamlegast hafðu samband við þjónustuaðila.',
  },
})

/**
 * Lykilupplýsingar skólabarns — Aðstandendur, Tungumálaumhverfi,
 * Heilsufarsupplýsingar. Labels follow the MMS contract v0.2 ticket; final copy
 * to be confirmed against Figma.
 */
export const primarySchoolKeyInfoMessages = defineMessages({
  // Shared
  saveSuccess: {
    id: 'sp.education-primary-school:key-info-save-success',
    defaultMessage: 'Skólinn sér þessa breytingu.',
  },
  requestId: {
    id: 'sp.education-primary-school:key-info-request-id',
    defaultMessage: 'Villunúmer: {requestId}',
  },
  add: {
    id: 'sp.education-primary-school:key-info-add',
    defaultMessage: 'Bæta við',
  },
  remove: {
    id: 'sp.education-primary-school:key-info-remove',
    defaultMessage: 'Fjarlægja',
  },
  save: {
    id: 'sp.education-primary-school:key-info-save',
    defaultMessage: 'Vista',
  },
  cancel: {
    id: 'sp.education-primary-school:key-info-cancel',
    defaultMessage: 'Hætta við',
  },
  confirm: {
    id: 'sp.education-primary-school:key-info-confirm',
    defaultMessage: 'Staðfesta',
  },
  yes: {
    id: 'sp.education-primary-school:key-info-yes',
    defaultMessage: 'Já',
  },
  no: {
    id: 'sp.education-primary-school:key-info-no',
    defaultMessage: 'Nei',
  },

  // 1. Aðstandendur
  emergencyContactsTitle: {
    id: 'sp.education-primary-school:key-info-emergency-contacts-title',
    defaultMessage: 'Aðstandendur',
  },
  contactAdd: {
    id: 'sp.education-primary-school:key-info-contact-add',
    defaultMessage: 'Bæta við aðstandanda',
  },
  contactAddTitle: {
    id: 'sp.education-primary-school:key-info-contact-add-title',
    defaultMessage: 'Bæta við aðstandendum barns',
  },
  contactAddIntro: {
    id: 'sp.education-primary-school:key-info-contact-add-intro',
    defaultMessage: 'Leitaðu eftir aðstandenda með kennitölu',
  },
  contactEditTitle: {
    id: 'sp.education-primary-school:key-info-contact-edit-title',
    defaultMessage: 'Breyta tengslum',
  },
  contactEditIntro: {
    id: 'sp.education-primary-school:key-info-contact-edit-intro',
    defaultMessage: 'Hér getur þú uppfært tengsl aðstandanda við barnið.',
  },
  contactName: {
    id: 'sp.education-primary-school:key-info-contact-name',
    defaultMessage: 'Nafn',
  },
  contactFullName: {
    id: 'sp.education-primary-school:key-info-contact-full-name',
    defaultMessage: 'Fullt nafn',
  },
  contactNationalId: {
    id: 'sp.education-primary-school:key-info-contact-national-id',
    defaultMessage: 'Kennitala',
  },
  contactNationalIdInvalid: {
    id: 'sp.education-primary-school:key-info-contact-national-id-invalid',
    defaultMessage: 'Ógild kennitala',
  },
  contactPersonNotFound: {
    id: 'sp.education-primary-school:key-info-contact-person-not-found',
    defaultMessage: 'Einstaklingur fannst ekki í þjóðskrá',
  },
  contactRelationType: {
    id: 'sp.education-primary-school:key-info-contact-relation-type',
    defaultMessage: 'Tengsl',
  },
  contactRelationPrompt: {
    id: 'sp.education-primary-school:key-info-contact-relation-prompt',
    defaultMessage: 'Skráðu tengsl við barn',
  },
  contactRegisteredBy: {
    id: 'sp.education-primary-school:key-info-contact-registered-by',
    defaultMessage: 'Skráð af',
  },
  contactRegisteredDate: {
    id: 'sp.education-primary-school:key-info-contact-registered-date',
    defaultMessage: 'Skráð þann',
  },
  contactRegisteredNote: {
    id: 'sp.education-primary-school:key-info-contact-registered-note',
    defaultMessage:
      'Skráð af hinum forsjáraðila. Aðeins sá sem skráði getur breytt.',
  },
  contactEditableNote: {
    id: 'sp.education-primary-school:key-info-contact-editable-note',
    defaultMessage:
      'Þú skráðir þennan aðstandanda og getur breytt eða fjarlægt.',
  },
  contactsEmpty: {
    id: 'sp.education-primary-school:key-info-contacts-empty',
    defaultMessage: 'Engir aðstandendur eru skráðir.',
  },
  contactMailboxNotice: {
    id: 'sp.education-primary-school:key-info-contact-mailbox-notice',
    defaultMessage:
      'Aðstandandinn fær skjal í pósthólf og getur þar uppfært eigin tengiliðaupplýsingar.',
  },
  contactInfoNotice: {
    id: 'sp.education-primary-school:key-info-contact-info-notice',
    defaultMessage:
      'Aðstandendur uppfæra sjálfir símanúmer og netfang á Mínum síðum.',
  },
  contactRemoveTitle: {
    id: 'sp.education-primary-school:key-info-contact-remove-title',
    defaultMessage: 'Fjarlægja aðstandanda',
  },
  contactRemoveText: {
    id: 'sp.education-primary-school:key-info-contact-remove-text',
    defaultMessage:
      'Ertu viss um að þú viljir fjarlægja {name} sem aðstandanda? Þú getur bætt honum við aftur ef þörf er á.',
  },

  // 2. Tungumálaumhverfi
  languageProfileTitle: {
    id: 'sp.education-primary-school:key-info-language-title',
    defaultMessage: 'Tungumálaumhverfi',
  },
  languageEditTitle: {
    id: 'sp.education-primary-school:key-info-language-edit-title',
    defaultMessage: 'Breyta tungumálaumhverfi',
  },
  languageEditIntro: {
    id: 'sp.education-primary-school:key-info-language-edit-intro',
    defaultMessage: 'Skráðu tungumálaumhverfi fyrir barn',
  },
  languageEnvironment: {
    id: 'sp.education-primary-school:key-info-language-environment',
    defaultMessage: 'Tungumálaumhverfi',
  },
  childLanguages: {
    id: 'sp.education-primary-school:key-info-child-languages',
    defaultMessage: 'Tungumál barns',
  },
  preferredLanguage: {
    id: 'sp.education-primary-school:key-info-preferred-language',
    defaultMessage: 'Aðaltungumál barns',
  },
  interpreter: {
    id: 'sp.education-primary-school:key-info-interpreter',
    defaultMessage: 'Túlkur í samskiptum við skóla',
  },
  interpreterInfo: {
    id: 'sp.education-primary-school:key-info-interpreter-info',
    defaultMessage: 'Forsjáaraðili þarf túlk í samskiptum við skóla',
  },
  signLanguage: {
    id: 'sp.education-primary-school:key-info-sign-language',
    defaultMessage: 'Táknmál',
  },
  signLanguageInfo: {
    id: 'sp.education-primary-school:key-info-sign-language-info',
    defaultMessage: 'Barn notar táknmál',
  },

  // 3. Heilsufarsupplýsingar
  healthProfileTitle: {
    id: 'sp.education-primary-school:key-info-health-title',
    defaultMessage: 'Heilsufarsupplýsingar',
  },
  healthEditTitle: {
    id: 'sp.education-primary-school:key-info-health-edit-title',
    defaultMessage: 'Breyta heilsufarsupplýsingum',
  },
  healthEditIntro: {
    id: 'sp.education-primary-school:key-info-health-edit-intro',
    defaultMessage: 'Skráðu heilsufarsupplýsingar fyrir barn',
  },
  foodAllergies: {
    id: 'sp.education-primary-school:key-info-food-allergies',
    defaultMessage: 'Fæðuofnæmi og óþol',
  },
  medicineAllergies: {
    id: 'sp.education-primary-school:key-info-medicine-allergies',
    defaultMessage: 'Lyfjaofnæmi',
  },
  environmentalAllergies: {
    id: 'sp.education-primary-school:key-info-environmental-allergies',
    defaultMessage: 'Umhverfisofnæmi',
  },
  foodAllergyChoose: {
    id: 'sp.education-primary-school:key-info-allergy-choose',
    defaultMessage: 'Veldu ofnæmi og óþol',
  },
  medicineAllergyChoose: {
    id: 'sp.education-primary-school:key-info-medicine-allergy-choose',
    defaultMessage: 'Veldu lyfjaofnæmi',
  },
  environmentalAllergyChoose: {
    id: 'sp.education-primary-school:key-info-environmental-allergy-choose',
    defaultMessage: 'Veldu umhverfisofnæmi',
  },
  epipen: {
    id: 'sp.education-primary-school:key-info-epipen',
    defaultMessage: 'Adrenalínpenni',
  },
  medicalDiagnoses: {
    id: 'sp.education-primary-school:key-info-medical-diagnoses',
    defaultMessage: 'Sjúkdómsgreiningar sem skipta máli í skóla',
  },
  medicationAssistance: {
    id: 'sp.education-primary-school:key-info-medication-assistance',
    defaultMessage: 'Aðstoð við lyfjagjöf á skólatíma',
  },
  healthEditDisabledNotice: {
    id: 'sp.education-primary-school:key-info-health-edit-disabled',
    defaultMessage:
      'Ekki er hægt að breyta heilsufarsupplýsingum að svo stöddu.',
  },
  saveError: {
    id: 'sp.education-primary-school:key-info-save-error',
    defaultMessage: 'Ekki tókst að vista breytingar. Reyndu aftur.',
  },
})

export const uniMessages = defineMessages({
  degree: {
    id: 'sp.education-graduation:education-grad-detail-degree',
    defaultMessage: 'Gráða',
  },
  graduationIntro: {
    id: 'sp.education-graduation:education-graduation-intro',
    defaultMessage:
      'Hér getur þú fundið yfirlit yfir brautskráningar frá háskólanámi',
    description: 'education graduation intro',
  },
  seeDetails: {
    id: 'sp.education-graduation:details',
    defaultMessage: 'Skoða',
  },
  program: {
    id: 'sp.education-graduation:education-grad-detail-program',
    defaultMessage: 'Námsleið',
  },
  faculty: {
    id: 'sp.education-graduation:education-grad-detail-faculty',
    defaultMessage: 'Deild',
  },
  school: {
    id: 'sp.education-graduation:education-grad-detail-school',
    defaultMessage: 'Svið',
  },
  institution: {
    id: 'sp.education-graduation:education-grad-detail-institution',
    defaultMessage: 'Stofnun',
  },
  graduationFiles: {
    id: 'sp.education-graduation:graduation-files',
    defaultMessage: 'Brautskráningargögn',
  },
  microCredentialsIntro: {
    id: 'sp.education-graduation:micro-credentials-intro',
    defaultMessage: 'Hér getur þú fundið yfirlit yfir örnám frá háskólanámi',
    description: 'Micro-credentials list intro',
  },
  studyLevel: {
    id: 'sp.education-graduation:study-level',
    defaultMessage: 'Námsstig',
    description:
      'Level of study label (used instead of degree for micro-credentials)',
  },
})
