import { CaseType } from '@island.is/judicial-system/types'
import { CaseTableType } from '@island.is/judicial-system/types'

export const EXPIRES_IN_SECONDS = 4 * 60 * 60
export const EXPIRES_IN_MILLISECONDS = EXPIRES_IN_SECONDS * 1000
export const REFRESH_TOKEN_EXPIRES_IN_SECONDS = 8 * 60 * 60
export const REFRESH_TOKEN_EXPIRES_IN_MILLISECONDS =
  REFRESH_TOKEN_EXPIRES_IN_SECONDS * 1000

export const CSRF_COOKIE_NAME = 'judicial-system.csrf'
export const ACCESS_TOKEN_COOKIE_NAME = 'judicial-system.token'
export const CODE_VERIFIER_COOKIE_NAME = 'judicial-system.code_verifier'
export const IDS_ID_TOKEN_NAME = 'judicial-system.ids.id_token'
export const IDS_ACCESS_TOKEN_NAME = 'judicial-system.ids.access_token'
export const IDS_REFRESH_TOKEN_NAME = 'judicial-system.ids.refresh_token'

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
        label: 'Brottvísun af heimili',
        value: CaseType.EXPULSION_FROM_HOME,
      },
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
        label: 'Rannsókn á rafrænum gögnum',
        value: CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
      },
      {
        label: 'Rof á reynslulausn',
        value: CaseType.PAROLE_REVOCATION,
      },
      {
        label: 'Skýrslutaka brotaþola yngri en 18 ára',
        value: CaseType.STATEMENT_FROM_MINOR,
      },
      {
        label: 'Skýrslutaka fyrir dómi',
        value: CaseType.STATEMENT_IN_COURT,
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

//#region Defence user routes
export const DEFENDER_CASES_ROUTE = '/verjandi/krofur'

export const DEFENDER_REQUEST_CASE_ROUTE = '/verjandi/krafa'

export const DEFENDER_INDICTMENT_CASE_ROUTE = '/verjandi/akaera'
export const DEFENDER_INDICTMENT_CASE_ADD_FILES_ROUTE = '/verjandi/akaera/gogn'

export const DEFENDER_APPEAL_CASE_APPEAL_ROUTE = '/verjandi/kaera'
export const DEFENDER_APPEAL_CASE_STATEMENT_ROUTE =
  '/verjandi/kaera/greinargerd'
export const DEFENDER_APPEAL_CASE_ADD_FILES_ROUTE = '/verjandi/kaera/gogn'
//#endregion Defence user routes

//#region Public prosecutor user routes
export const PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_OVERVIEW_ROUTE =
  '/rikissaksoknari/akaera/yfirlit'
export const PUBLIC_PROSECUTOR_STAFF_INDICTMENT_CASE_SEND_TO_PRISON_ADMIN_ROUTE =
  '/rikissaksoknari/akaera/senda-til-fmst'
//#endregion Public prosecutor user routes

//#region Prison user routes
export const PRISON_REQUEST_CASE_SIGNED_VERDICT_OVERVIEW_ROUTE =
  '/fangelsi/krafa/yfirlit'
export const PRISON_INDICTMENT_CASE_OVERVIEW_ROUTE = '/fangelsi/akaera/yfirlit'
//#endregion Prison user routes

//#region Court of appeals user routes
export const COURT_OF_APPEAL_OVERVIEW_ROUTE = '/landsrettur/yfirlit'
export const COURT_OF_APPEAL_CASE_ROUTE = '/landsrettur/kaera'
export const COURT_OF_APPEAL_RULING_ROUTE = '/landsrettur/urskurdur'
export const COURT_OF_APPEAL_RESULT_ROUTE = '/landsrettur/nidurstada'
export const COURT_OF_APPEAL_SUMMARY_ROUTE = '/landsrettur/samantekt'
export const COURT_OF_APPEAL_CASE_WITHDRAWN_ROUTE = '/landsrettur/nidurfelling'
//#endregion Court of appeals user routes

//#region District court user routes
export const DISTRICT_COURT_RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE =
  '/domur/mottaka'
export const DISTRICT_COURT_RESTRICTION_CASE_COURT_OVERVIEW_ROUTE =
  '/domur/krafa'
export const DISTRICT_COURT_RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE =
  '/domur/fyrirtokutimi'
export const DISTRICT_COURT_RESTRICTION_CASE_RULING_ROUTE = '/domur/urskurdur'
export const DISTRICT_COURT_RESTRICTION_CASE_COURT_RECORD_ROUTE =
  '/domur/thingbok'
export const DISTRICT_COURT_RESTRICTION_CASE_CONFIRMATION_ROUTE =
  '/domur/stadfesta'

export const DISTRICT_COURT_INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE =
  '/domur/rannsoknarheimild/mottaka'
export const DISTRICT_COURT_INVESTIGATION_CASE_OVERVIEW_ROUTE =
  '/domur/rannsoknarheimild/yfirlit'
export const DISTRICT_COURT_INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE =
  '/domur/rannsoknarheimild/fyrirtaka'
export const DISTRICT_COURT_INVESTIGATION_CASE_RULING_ROUTE =
  '/domur/rannsoknarheimild/urskurdur'
export const DISTRICT_COURT_INVESTIGATION_CASE_COURT_RECORD_ROUTE =
  '/domur/rannsoknarheimild/thingbok'
export const DISTRICT_COURT_INVESTIGATION_CASE_CONFIRMATION_ROUTE =
  '/domur/rannsoknarheimild/stadfesta'

export const DISTRICT_COURT_INDICTMENT_CASE_COURT_OVERVIEW_ROUTE =
  '/domur/akaera/yfirlit'
export const DISTRICT_COURT_INDICTMENT_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE =
  '/domur/akaera/mottaka'
export const DISTRICT_COURT_INDICTMENT_CASE_SUBPOENA_ROUTE =
  '/domur/akaera/fyrirkall'
export const DISTRICT_COURT_INDICTMENT_CASE_DEFENDER_ROUTE =
  '/domur/akaera/malflytjendur'
export const DISTRICT_COURT_INDICTMENT_CASE_COURT_RECORD_ROUTE =
  '/domur/akaera/thingbok'
export const DISTRICT_COURT_INDICTMENT_CASE_CONCLUSION_ROUTE =
  '/domur/akaera/stada-og-lyktir'
export const DISTRICT_COURT_INDICTMENT_CASE_SUMMARY_ROUTE =
  '/domur/akaera/samantekt'
export const DISTRICT_COURT_INDICTMENT_CASE_COMPLETED_ROUTE =
  '/domur/akaera/lokid'
export const DISTRICT_COURT_INDICTMENT_CASE_ADD_FILES_IN_COURT_ROUTE =
  '/domur/akaera/gogn'
export const DISTRICT_COURT_INDICTMENT_CASE_ADD_RULING_ORDER_IN_COURT_ROUTE =
  '/domur/akaera/urskurdir'

//#endregion District court user routes

//#region Prosecutor user routes
export const PROSECUTION_CREATE_CUSTODY_CASE_ROUTE = '/krafa/ny/gaesluvardhald'
export const PROSECUTION_CREATE_TRAVEL_BAN_ROUTE = '/krafa/ny/farbann'
export const PROSECUTION_CREATE_INVESTIGATION_CASE_ROUTE =
  '/krafa/ny/rannsoknarheimild'
export const PROSECUTION_CREATE_INDICTMENT_ROUTE = '/akaera/ny'

export const PROSECUTION_RESTRICTION_CASE_DEFENDANT_ROUTE =
  '/krafa/sakborningur'
export const PROSECUTION_RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE =
  '/krafa/fyrirtaka'
export const PROSECUTION_RESTRICTION_CASE_POLICE_DEMANDS_ROUTE =
  '/krafa/domkrofur-og-lagagrundvollur'
export const PROSECUTION_RESTRICTION_CASE_POLICE_REPORT_ROUTE =
  '/krafa/greinargerd'
export const PROSECUTION_RESTRICTION_CASE_CASE_FILES_ROUTE =
  '/krafa/rannsoknargogn'
export const PROSECUTION_RESTRICTION_CASE_OVERVIEW_ROUTE = '/krafa/stadfesta'

export const PROSECUTION_INVESTIGATION_CASE_REGISTRATION_ROUTE =
  '/krafa/rannsoknarheimild/efni-krofu'
export const PROSECUTION_INVESTIGATION_CASE_DEFENDANT_ROUTE =
  '/krafa/rannsoknarheimild/varnaradili'
export const PROSECUTION_INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE =
  '/krafa/rannsoknarheimild/fyrirtaka'
export const PROSECUTION_INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE =
  '/krafa/rannsoknarheimild/domkrofur-og-lagagrundvollur'
export const PROSECUTION_INVESTIGATION_CASE_POLICE_REPORT_ROUTE =
  '/krafa/rannsoknarheimild/greinargerd'
export const PROSECUTION_INVESTIGATION_CASE_CASE_FILES_ROUTE =
  '/krafa/rannsoknarheimild/rannsoknargogn'
export const PROSECUTION_INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE =
  '/krafa/rannsoknarheimild/stadfesta'

export const PROSECUTION_INDICTMENT_CASE_DEFENDANT_ROUTE = '/akaera/akaerdi'
export const PROSECUTION_INDICTMENT_CASE_POLICE_CASE_FILES_ROUTE =
  '/akaera/malsgogn'
export const PROSECUTION_INDICTMENT_CASE_CASE_FILE_ROUTE = '/akaera/skjalaskra'
export const PROSECUTION_INDICTMENT_CASE_CASE_FILES_ROUTE = '/akaera/domskjol'
export const PROSECUTION_INDICTMENT_CASE_PROCESSING_ROUTE =
  '/akaera/malsmedferd'
export const PROSECUTION_INDICTMENT_CASE_INDICTMENT_ROUTE = '/akaera/akaera'
export const PROSECUTION_INDICTMENT_CASE_CONFIRMING_ROUTE = '/akaera/stadfesta'
export const PROSECUTION_INDICTMENT_CASE_OVERVIEW_ROUTE = '/akaera/yfirlit'
export const PROSECUTION_INDICTMENT_CASE_ADD_FILES_ROUTE = '/akaera/gogn'

export const PROSECUTION_APPEAL_CASE_APPEAL_ROUTE = '/kaera'
export const PROSECUTION_APPEAL_CASE_STATEMENT_ROUTE = '/kaera/greinargerd'
export const PROSECUTION_APPEAL_CASE_ADD_FILES_ROUTE = '/kaera/gogn'
//#endregion Prosecutor user routes

//#region Admin user routes
export const ADMIN_USERS_ROUTE = '/notendur'
export const ADMIN_CREATE_USER_ROUTE = '/notendur/nyr'
export const ADMIN_CHANGE_USER_ROUTE = '/notendur/breyta'
export const ADMIN_STATISTICS_ROUTE = '/notendur/tolfraedi'
export const ADMIN_MESSAGE_SUSPENSION_ROUTE = '/notendur/bidrod'

//#endregion Admin user routes

//#region Case list routes
export const CASE_TABLE_GROUPS_ROUTE = '/malalistar'
export const PROSECUTION_INDICTMENTS_TO_REVIEW = `/malalistar/${CaseTableType.PUBLIC_PROSECUTION_INDICTMENTS_IN_REVIEW}`
//#endregion Case list routes

//#region Shared routes
export const SIGNED_VERDICT_OVERVIEW_ROUTE = '/krafa/yfirlit'
export const ROUTE_HANDLER_ROUTE = '/beinir'
//#endregion Shared routes

export const prosecutorRestrictionCasesRoutes = [
  PROSECUTION_RESTRICTION_CASE_DEFENDANT_ROUTE,
  PROSECUTION_RESTRICTION_CASE_HEARING_ARRANGEMENTS_ROUTE,
  PROSECUTION_RESTRICTION_CASE_POLICE_DEMANDS_ROUTE,
  PROSECUTION_RESTRICTION_CASE_POLICE_REPORT_ROUTE,
  PROSECUTION_RESTRICTION_CASE_CASE_FILES_ROUTE,
  PROSECUTION_RESTRICTION_CASE_OVERVIEW_ROUTE,
]

export const prosecutorInvestigationCasesRoutes = [
  PROSECUTION_INVESTIGATION_CASE_DEFENDANT_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_HEARING_ARRANGEMENTS_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_POLICE_DEMANDS_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_POLICE_REPORT_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_CASE_FILES_ROUTE,
  PROSECUTION_INVESTIGATION_CASE_POLICE_CONFIRMATION_ROUTE,
]

export const prosecutorIndictmentRoutes = [
  PROSECUTION_INDICTMENT_CASE_DEFENDANT_ROUTE,
  PROSECUTION_INDICTMENT_CASE_POLICE_CASE_FILES_ROUTE,
  PROSECUTION_INDICTMENT_CASE_CASE_FILE_ROUTE,
  PROSECUTION_INDICTMENT_CASE_CASE_FILES_ROUTE,
  PROSECUTION_INDICTMENT_CASE_PROCESSING_ROUTE,
  PROSECUTION_INDICTMENT_CASE_INDICTMENT_ROUTE,
  PROSECUTION_INDICTMENT_CASE_CONFIRMING_ROUTE,
]

export const courtRestrictionCasesRoutes = [
  DISTRICT_COURT_RESTRICTION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_COURT_OVERVIEW_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_RULING_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_COURT_RECORD_ROUTE,
  DISTRICT_COURT_RESTRICTION_CASE_CONFIRMATION_ROUTE,
]

export const courtInvestigationCasesRoutes = [
  DISTRICT_COURT_INVESTIGATION_CASE_RECEPTION_AND_ASSIGNMENT_ROUTE,
  DISTRICT_COURT_INVESTIGATION_CASE_OVERVIEW_ROUTE,
  DISTRICT_COURT_INVESTIGATION_CASE_COURT_HEARING_ARRANGEMENTS_ROUTE,
  DISTRICT_COURT_INVESTIGATION_CASE_RULING_ROUTE,
  DISTRICT_COURT_INVESTIGATION_CASE_COURT_RECORD_ROUTE,
  DISTRICT_COURT_INVESTIGATION_CASE_CONFIRMATION_ROUTE,
]

// Feedback
export const FEEDBACK_FORM_URL =
  'https://form.asana.com?k=45fPB_e65kYFDjvG-18f0w&d=203394141643832'

// Masks
export const POLICE_CASE_NUMBER = '___-____-_______'
export const SSN = '______-____'
export const PHONE_NUMBER = '___-____'
export const EDITABLE_DATE = '__.__.____'
export const DATE_PICKER_TIME = '  :  '
export const SUBSTANCE_ALCOHOL = '_,__'
export const SPEED = '___'
