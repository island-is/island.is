import { defineMessages } from 'react-intl'

export const policeCaseFiles = defineMessages({
  heading: {
    id: 'judicial.system.core:police_case_files.heading_v1',
    defaultMessage:
      'Gögn úr LÖKE{policeCaseNumber, select, NONE {} other {-máli {policeCaseNumber}}}',
    description:
      'Notaður sem titill fyrir "LOKE" gagnapakkann á rannsóknargagna skrefi.',
  },
  introduction: {
    id: 'judicial.system.core:police_case_files.introduction',
    defaultMessage:
      'Til að gögn úr þessum lista verði hluti af gagnapakka málsins þarf að velja þau og smella á Hlaða upp.',
    description:
      'Notaður sem skýring fyrir "LOKE" gagnapakkann á rannsóknargagna skrefi.',
  },
  selectAllLabel: {
    id: 'judicial.system.core:police_case_files.select_all_label',
    defaultMessage: 'Velja allt',
    description:
      'Notaður sem texti fyrir "Velja allt" valmöguleikann í LÖKE gagnapakkanum á rannsóknargagna skrefi.',
  },
  couldNotGetFromLOKEMessage: {
    id:
      'judicial.system.core:police_case_files.could_not_get_from_loke_message',
    defaultMessage:
      'Ekki tókst að sækja skjalalista í LÖKE. Hægt er að hlaða upp skjölum hér fyrir neðan.',
    description:
      'Notaður sem villuskilaboð í LÖKE gagnapakkanum á rannsóknargagna skrefi.',
  },
  caseNotFoundInLOKEMessage: {
    id: 'judicial.system.core:police_case_files.case_not_found_in_loke_message',
    defaultMessage: 'Þessi krafa var ekki stofnuð í gegnum LÖKE',
    description:
      'Notaður sem villuskilaboð í LÖKE gagnapakkanum á rannsóknargagna skrefi.',
  },
  noFilesFoundInLOKEMessage: {
    id: 'judicial.system.core:police_case_files.no_files_found_in_loke_message',
    defaultMessage: 'Engin skjöl fundust fyrir kröfuna í LÖKE',
    description:
      'Notaður sem villuskilaboð í LÖKE gagnapakkanum á rannsóknargagna skrefi í rannsóknarheimildum.',
  },
  allFilesUploadedMessage: {
    id: 'judicial.system.core:police_case_files.all_files_uploaded',
    defaultMessage: 'Öllum skjölum hefur verið hlaðið upp',
    description:
      'Notaður sem skilaboð þegar öllum skjölum hefur verið hlaðið upp í LÖKE gagnapakkanum á rannsóknargagna skrefi.',
  },
  uploadButtonLabel: {
    id: 'judicial.system.core:police_case_files.upload_button_label',
    defaultMessage: 'Hlaða upp',
    description:
      'Notaður sem texti í "hlaða upp" takka í LÖKE gagnapakkanum á rannsóknargagna skrefi.',
  },
  originNotLokeTitle: {
    id: 'judicial.system.core:police_case_files.origin_not_loke_title',
    defaultMessage: 'Krafa ekki stofnuð í LÖKE',
    description:
      'Notaður sem titill í upplýsingaboxi fyrir kröfu sem ekki er stofnuð í LÖKE í LÖKE gagnapakkanum á rannsóknargagna skrefi.',
  },
  originNotLokeMessage: {
    id: 'judicial.system.core:police_case_files.origin_not_loke_message',
    defaultMessage:
      'Til að fá sjálfkrafa yfirlit yfir skjöl úr LÖKE þarf að stofna kröfuna í gegnum LÖKE.',
    description:
      'Notaður sem texti í upplýsingaboxi fyrir kröfu sem ekki er stofnuð í LÖKE í LÖKE gagnapakkanum á rannsóknargagna skrefi.',
  },
})
