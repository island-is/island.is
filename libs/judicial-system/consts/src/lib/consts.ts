import { CaseType } from '@island.is/judicial-system/types'

export const EXPIRES_IN_SECONDS = 4 * 60 * 60
export const EXPIRES_IN_MILLISECONDS = EXPIRES_IN_SECONDS * 1000

export const CSRF_COOKIE_NAME = 'judicial-system.csrf'

export const ACCESS_TOKEN_COOKIE_NAME = 'judicial-system.token'

export const IntegratedCourts = [
  'd1e6e06f-dcfd-45e0-9a24-2fdabc2cc8bf', // Héraðsdómur Reykjavíkur
  'c9a51c9a-c0e3-4c1f-a9a2-828a3af05d1d', // Héraðsdómur Reykjaness
]

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
