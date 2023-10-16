import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  couldNotGetFromLOKEMessage: {
    id: 'judicial.system.core:police_case_files.could_not_get_from_loke_message',
    defaultMessage:
      'Ekki tókst að sækja skjalalista í LÖKE. Hægt er að hlaða upp skjölum hér fyrir neðan.',
    description: 'Notaður sem villuskilaboð í LÖKE gagnapakkanum.',
  },
  noFilesFoundInLOKEMessage: {
    id: 'judicial.system.core:police_case_files.no_files_found_in_loke_message_v2',
    defaultMessage:
      'Engin skjöl fundust fyrir {isIndictmentCase, select, true {þetta LÖKE-mál} other {kröfuna í LÖKE}}',
    description: 'Notaður sem villuskilaboð í LÖKE gagnapakkanum.',
  },
  allFilesUploadedMessage: {
    id: 'judicial.system.core:police_case_files.all_files_uploaded',
    defaultMessage: 'Öllum skjölum hefur verið hlaðið upp',
    description:
      'Notaður sem skilaboð þegar öllum skjölum hefur verið hlaðið upp í LÖKE gagnapakkanum.',
  },
  uploadButtonLabel: {
    id: 'judicial.system.core:police_case_files.upload_button_label',
    defaultMessage: 'Hlaða upp',
    description: 'Notaður sem texti í "hlaða upp" takka í LÖKE gagnapakkanum.',
  },
  originNotLokeTitle: {
    id: 'judicial.system.core:police_case_files.origin_not_loke_title_v1',
    defaultMessage:
      '{isIndictmentCase, select, true {Ákæra} other {Krafa}} ekki stofnuð í LÖKE',
    description:
      'Notaður sem titill í upplýsingaboxi fyrir ákæru/kröfu sem ekki er stofnuð í LÖKE í LÖKE gagnapakkanum.',
  },
  originNotLokeMessage: {
    id: 'judicial.system.core:police_case_files.origin_not_loke_message_v1',
    defaultMessage:
      'Til að fá sjálfkrafa yfirlit yfir skjöl úr LÖKE þarf að stofna {isIndictmentCase, select, true {ákæruna} other {kröfuna}} í gegnum LÖKE',
    description:
      'Notaður sem texti í upplýsingaboxi fyrir ákæru/kröfu sem ekki er stofnuð í LÖKE í LÖKE gagnapakkanum.',
  },
})
