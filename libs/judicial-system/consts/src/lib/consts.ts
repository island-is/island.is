import { CaseType } from '@island.is/judicial-system/types'

export const EXPIRES_IN_SECONDS = 4 * 60 * 60
export const EXPIRES_IN_MILLISECONDS = EXPIRES_IN_SECONDS * 1000

export const CSRF_COOKIE_NAME = 'judicial-system.csrf'

export const ACCESS_TOKEN_COOKIE_NAME = 'judicial-system.token'

export const ICaseTypes = [
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
        label: 'Rannsókn á rafrænum gögnum',
        value: CaseType.ELECTRONIC_DATA_DISCOVERY_INVESTIGATION,
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
export const CASE_LIST_ROUTE = '/krofur'
export const USER_LIST_ROUTE = '/notendur'
export const USER_NEW_ROUTE = '/notendur/nyr'
export const USER_CHANGE_ROUTE = '/notendur/breyta'
export const SIGNED_VERDICT_OVERVIEW = '/krafa/yfirlit'

// Prosecutor
export const STEP_ONE_CUSTODY_REQUEST_ROUTE = '/krafa/ny/gaesluvardhald'
export const STEP_ONE_NEW_TRAVEL_BAN_ROUTE = '/krafa/ny/farbann'
export const STEP_ONE_ROUTE = '/krafa/sakborningur'
export const STEP_TWO_ROUTE = '/krafa/fyrirtaka'
export const STEP_THREE_ROUTE = '/krafa/domkrofur-og-lagaakvaedi'
export const STEP_FOUR_ROUTE = '/krafa/greinargerd'
export const STEP_FIVE_ROUTE = '/krafa/rannsoknargogn'
export const STEP_SIX_ROUTE = '/krafa/stadfesta'

// Investigation cases - prosecutor
export const NEW_IC_ROUTE = '/krafa/ny/rannsoknarheimild'
export const IC_DEFENDANT_ROUTE = '/krafa/rannsoknarheimild/varnaradili'
export const IC_HEARING_ARRANGEMENTS_ROUTE =
  '/krafa/rannsoknarheimild/fyrirtaka'
export const IC_POLICE_DEMANDS_ROUTE =
  '/krafa/rannsoknarheimild/domkrofur-og-lagaakvaedi'
export const IC_POLICE_REPORT_ROUTE = '/krafa/rannsoknarheimild/greinargerd'
export const IC_CASE_FILES_ROUTE = '/krafa/rannsoknarheimild/rannsoknargogn'
export const IC_POLICE_CONFIRMATION_ROUTE = '/krafa/rannsoknarheimild/stadfesta'

// Court
export const RECEPTION_AND_ASSIGNMENT_ROUTE = '/domur/mottaka'
export const OVERVIEW_ROUTE = '/domur/krafa'
export const HEARING_ARRANGEMENTS_ROUTE = '/domur/fyrirtokutimi'
export const COURT_RECORD_ROUTE = '/domur/thingbok'
export const RULING_ROUTE = '/domur/urskurdur'
export const CONFIRMATION_ROUTE = '/domur/stadfesta'
export const MODIFY_RULING_ROUTE = '/domur/urskurdur/leidretta'

// Investigation cases - court
export const IC_RECEPTION_AND_ASSIGNMENT_ROUTE =
  '/domur/rannsoknarheimild/mottaka'
export const IC_OVERVIEW_ROUTE = '/domur/rannsoknarheimild/yfirlit'
export const IC_COURT_HEARING_ARRANGEMENTS_ROUTE =
  '/domur/rannsoknarheimild/fyrirtaka'
export const IC_COURT_RECORD_ROUTE = '/domur/rannsoknarheimild/thingbok'
export const IC_RULING_ROUTE = '/domur/rannsoknarheimild/urskurdur'
export const IC_MODIFY_RULING_ROUTE =
  '/domur/rannsoknarheimild/urskurdur/leidretta'
export const IC_CONFIRMATION_ROUTE = '/domur/rannsoknarheimild/stadfesta'

// Feedback
export const FEEDBACK_FORM_ROUTE = '/feedback-from'
export const FEEDBACK_FORM_URL =
  'https://form.asana.com?k=45fPB_e65kYFDjvG-18f0w&d=203394141643832'

// Defender
export const DEFENDER_ROUTE = '/verjandi'
