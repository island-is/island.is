import { CaseType } from '@island.is/judicial-system/types'

export const petitionTypes = [
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
]
