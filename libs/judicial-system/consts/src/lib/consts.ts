import { CaseType } from '@island.is/judicial-system/types'

export const EXPIRES_IN_SECONDS = 4 * 60 * 60
export const EXPIRES_IN_MILLISECONDS = EXPIRES_IN_SECONDS * 1000
export const CSRF_COOKIE_NAME = 'judicial-system.csrf'
export const ACCESS_TOKEN_COOKIE_NAME = 'judicial-system.token'
export const CODE_VERIFIER_COOKIE_NAME = 'judicial-system.code_verifier'
export const IDS_ID_TOKEN = 'judicial-system.ids.id_token'

export const InvestigationCaseTypes = [
  {
    label: 'Húsleit',
    value: CaseType.SEARCH_WARRANT,
  },
  {
    label: 'Rof bankaleyndar',
    value: CaseType.BANKING_SECRECY_WAIVER,
  },
  {
    label: 'Símhlustun',
    value: CaseType.PHONE_TAPPING,
  },
  {
    label: 'Upplýsingar um fjarskiptasamskipti',
    value: CaseType.TELECOMMUNICATIONS,
  },
  {
    label: 'Eftirfararbúnaður',
    value: CaseType.TRACKING_EQUIPMENT,
  },
  {
    label: '',
    options: [
      {
        label: 'Geðrannsókn',
        value: CaseType.PSYCHIATRIC_EXAMINATION,
      },
      {
        label: 'Hljóðupptökubúnaði komið fyrir',
        value: CaseType.SOUND_RECORDING_EQUIPMENT,
      },
      {
        label: 'Krufning',
        value: CaseType.AUTOPSY,
      },
      {
        label: 'Leit og líkamsrannsókn',
        value: CaseType.BODY_SEARCH,
      },
      {
        label: 'Myndupptökubúnaði komið fyrir',
        value: CaseType.VIDEO_RECORDING_EQUIPMENT,
      },
      {
        label: 'Nálgunarbann',
        value: CaseType.RESTRAINING_ORDER,
      },
      {
        label: 'Nálgunarbann og brottvísun af heimili',
        value: CaseType.RESTRAINING_ORDER_AND_EXPULSION_FROM_HOME,
      },
      {
        label: 'Brottvísun af heimili',
        value: CaseType.EXPULSION_FROM_HOME,
      },
      {
        label: 'Rannsókn á rafrænum gögnum',
        value: CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
      },
      {
        label: 'Rof á reynslulausn',
        value: CaseType.PAROLE_REVOCATION,
      },
      {
        label: 'Upplýsingar um vefnotkun',
        value: CaseType.INTERNET_USAGE,
      },
      {
        label: 'Annað',
        value: CaseType.OTHER,
      },
    ],
  },
]

// Date/time formats
export const TIME_FORMAT = 'HH:mm'

// Routes
export const CASES_ROUTE = '/krofur'
export const USERS_ROUTE = '/notendur'
export const CREATE_USER_ROUTE = '/notendur/nyr'
export const CHANGE_USER_ROUTE = '/notendur/breyta'
export const SIGNED_VERDICT_OVERVIEW_ROUTE = '/krafa/yfirlit'
export const CLOSED_INDICTMENT_OVERVIEW_ROUTE = '/akaera/yfirlit'

export const CREATE_RESTRICTION_CASE_ROUTE = '/krafa/ny/gaesluvardhald'
export const CREATE_TRAVEL_BAN_ROUTE = '/krafa/ny/farbann'
export const CREATE_INVESTIGATION_CASE_ROUTE = '/krafa/ny/rannsoknarheimild'
export const CREATE_INDICTMENT_ROUTE = '/akaera/ny'

export const DEFENDER_ROUTE = '/verjandi/krafa'
export const DEFENDER_INDICTMENT_ROUTE = '/verjandi/akaera'
export const DEFENDER_APPEAL_ROUTE = '/verjandi/kaera'
export const DEFENDER_STATEMENT_ROUTE = '/verjandi/greinargerd'
export const DEFENDER_CASES_ROUTE = '/verjandi/krofur'

export const APPEAL_ROUTE = '/kaera'
export const STATEMENT_ROUTE = '/greinargerd'

/* PROSECUTOR ROUTES START */
export const RESTRICTION_CASE_DEFENDANT_ROUTE = '/krafa/sakborningur'
export const RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE = '/krafa/fyrirtaka'
export const RESTRICTION_CASE_POLICE_DEMANDS_ROUTE =
  '/krafa/domkrofur-og-lagagrundvollur'
export const RESTRICTION_CASE_POLICE_REPORT_ROUTE = '/krafa/greinargerd'
export const RESTRICTION_CASE_CASE_FILES_ROUTE = '/krafa/rannsoknargogn'
export const RESTRICTION_CASE_OVERVIEW_ROUTE = '/krafa/stadfesta'

export const INVESTIGATION_CASE_DEFENDANT_ROUTE =
  '/krafa/rannsoknarheimild/varnaradili'
export const INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE =
  '/krafa/rannsoknarheimild/fyrirtaka'
export const INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE =
  '/krafa/rannsoknarheimild/domkrofur-og-lagagrundvollur'
export const INVESTIGATION_CASE_POLICE_REPORT_ROUTE =
  '/krafa/rannsoknarheimild/greinargerd'
export const INVESTIGATION_CASE_CASE_FILES_ROUTE =
  '/krafa/rannsoknarheimild/rannsoknargogn'
export const INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE =
  '/krafa/rannsoknarheimild/stadfesta'

export const INDICTMENTS_DEFENDANT_ROUTE = '/akaera/akaerdi'
export const INDICTMENTS_POLICE_CASE_FILES_ROUTE = '/akaera/malsgogn'
export const INDICTMENTS_CASE_FILE_ROUTE = '/akaera/skjalaskra'
export const INDICTMENTS_PROCESSING_ROUTE = '/akaera/malsmedferd'
export const INDICTMENTS_TRAFFIC_VIOLATION_ROUTE = '/akaera/akaera'
export const INDICTMENTS_CASE_FILES_ROUTE = '/akaera/domskjol'
export const INDICTMENTS_OVERVIEW_ROUTE = '/akaera/stadfesta'
/* PROSECUTOR ROUTES END */

/* DISTRICT COURT ROUTES START */
export const RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE = '/domur/mottaka'
export const RESTRICTION_CASE_COURT_OVERVIEW_ROUTE = '/domur/krafa'
export const RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE =
  '/domur/fyrirtokutimi'
export const RESTRICTION_CASE_RULING_ROUTE = '/domur/urskurdur'
export const RESTRICTION_CASE_COURT_RECORD_ROUTE = '/domur/thingbok'
export const RESTRICTION_CASE_CONFIRMATION_ROUTE = '/domur/stadfesta'

export const INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE =
  '/domur/rannsoknarheimild/mottaka'
export const INVESTIGATION_CASE_OVERVIEW_ROUTE =
  '/domur/rannsoknarheimild/yfirlit'
export const INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE =
  '/domur/rannsoknarheimild/fyrirtaka'
export const INVESTIGATION_CASE_COURT_RECORD_ROUTE =
  '/domur/rannsoknarheimild/thingbok'
export const INVESTIGATION_CASE_RULING_ROUTE =
  '/domur/rannsoknarheimild/urskurdur'
export const INVESTIGATION_CASE_CONFIRMATION_ROUTE =
  '/domur/rannsoknarheimild/stadfesta'

export const INDICTMENTS_COURT_OVERVIEW_ROUTE = '/domur/akaera/yfirlit'
export const INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE =
  '/domur/akaera/mottaka'
export const INDICTMENTS_SUBPOENA_ROUTE = '/domur/akaera/fyrirkall'
export const INDICTMENTS_DEFENDER_ROUTE = '/domur/akaera/malflytjendur'
export const INDICTMENTS_COURT_RECORD_ROUTE = '/domur/akaera/thingbok'
/* DISTRICT COURT ROUTES END */

/* COURT OF APPEALS ROUTES START */
export const COURT_OF_APPEAL_OVERVIEW_ROUTE = '/landsrettur/yfirlit'
export const COURT_OF_APPEAL_CASES_ROUTE = '/landsrettur/krofur'
export const COURT_OF_APPEAL_CASE_ROUTE = '/landsrettur/kaera'
export const COURT_OF_APPEAL_RULING_ROUTE = '/landsrettur/urskurdur'
export const COURT_OF_APPEAL_RESULT_ROUTE = '/landsrettur/nidurstada'

/* COURT OF APPEALS ROUTES END */

export const prosecutorRestrictionCasesRoutes = [
  RESTRICTION_CASE_DEFENDANT_ROUTE,
  RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
  RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
  RESTRICTION_CASE_POLICE_REPORT_ROUTE,
  RESTRICTION_CASE_CASE_FILES_ROUTE,
  RESTRICTION_CASE_OVERVIEW_ROUTE,
]

export const prosecutorInvestigationCasesRoutes = [
  INVESTIGATION_CASE_DEFENDANT_ROUTE,
  INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
  INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
  INVESTIGATION_CASE_POLICE_REPORT_ROUTE,
  INVESTIGATION_CASE_CASE_FILES_ROUTE,
  INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
]

export const prosecutorIndictmentRoutes = (isTrafficViolation: boolean) => [
  INDICTMENTS_DEFENDANT_ROUTE,
  INDICTMENTS_POLICE_CASE_FILES_ROUTE,
  INDICTMENTS_CASE_FILE_ROUTE,
  INDICTMENTS_PROCESSING_ROUTE,
  ...(isTrafficViolation ? [INDICTMENTS_TRAFFIC_VIOLATION_ROUTE] : []),
  INDICTMENTS_CASE_FILES_ROUTE,
  INDICTMENTS_OVERVIEW_ROUTE,
]

export const courtRestrictionCasesRoutes = [
  RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
  RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  RESTRICTION_CASE_RULING_ROUTE,
  RESTRICTION_CASE_COURT_RECORD_ROUTE,
  RESTRICTION_CASE_CONFIRMATION_ROUTE,
]

export const courtInvestigationCasesRoutes = [
  INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  INVESTIGATION_CASE_OVERVIEW_ROUTE,
  INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  INVESTIGATION_CASE_RULING_ROUTE,
  INVESTIGATION_CASE_COURT_RECORD_ROUTE,
  INVESTIGATION_CASE_CONFIRMATION_ROUTE,
]

export const courtIndictmentRoutes = [
  INDICTMENTS_COURT_OVERVIEW_ROUTE,
  INDICTMENTS_RECEPTION_AND_ASSIGNMENT_ROUTE,
  INDICTMENTS_SUBPOENA_ROUTE,
  INDICTMENTS_DEFENDER_ROUTE,
  INDICTMENTS_COURT_RECORD_ROUTE,
]

export const courtOfAppealRoutes = [
  COURT_OF_APPEAL_OVERVIEW_ROUTE,
  COURT_OF_APPEAL_CASE_ROUTE,
  COURT_OF_APPEAL_RULING_ROUTE,
  COURT_OF_APPEAL_RESULT_ROUTE,
]

// Feedback
export const FEEDBACK_FORM_URL =
  'https://form.asana.com?k=45fPB_e65kYFDjvG-18f0w&d=203394141643832'
