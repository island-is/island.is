import { defineMessages } from 'react-intl'

export const errors = defineMessages({
  general: {
    id: 'judicial.system.core:errors.general',
    defaultMessage: 'Villa kom upp. Vinsamlegast reyndu aftur.',
    description: 'Notaður sem almenn villuskilaboð',
  },
  updateDefendant: {
    id: 'judicial.system.core:errors.update_defendant',
    defaultMessage: 'Upp kom villa við að uppfæra varnaraðila',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að uppfæra varnaraðila',
  },
  createDefendant: {
    id: 'judicial.system.core:errors.create_defendant',
    defaultMessage: 'Upp kom villa við að stofna nýjan varnaraðila',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að stofna varnaraðila',
  },
  deleteDefendant: {
    id: 'judicial.system.core:errors.delete_defendant',
    defaultMessage: 'Upp kom villa við að eyða varnaraðila',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að eyða varnaraðila',
  },
  createCase: {
    id: 'judicial.system.core:errors.create_case',
    defaultMessage: 'Upp kom villa við að stofnun máls',
    description: 'Notaður sem villuskilaboð þegar ekki gengur að stofna mál',
  },
  updateCase: {
    id: 'judicial.system.core:errors.update_case',
    defaultMessage: 'Upp kom villa við að uppfæra mál',
    description: 'Notaður sem villuskilaboð þegar ekki gengur að uppfæra mál',
  },
  transitionCase: {
    id: 'judicial.system.core:errors.transition_case',
    defaultMessage: 'Upp kom villa við að uppfæra stöðu máls',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að uppfæra stöðu máls',
  },
  requestRulingSignature: {
    id: 'judicial.system.core:errors.request_ruling_signature',
    defaultMessage: 'Upp kom villa við undirritun úrskurðar',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að undirrita úrskurð',
  },
  requestCourtRecordSignature: {
    id: 'judicial.system.core:errors.request_court_record_signature',
    defaultMessage: 'Upp kom villa við undirritun þingbókar',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að undirrita þingbók',
  },
  extendCase: {
    id: 'judicial.system.core:errors.extend_case',
    defaultMessage: 'Upp kom villa við að framlengja mál',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að framlengja mál',
  },
  sendNotification: {
    id: 'judicial.system.core:errors.send_notification',
    defaultMessage: 'Upp kom villa við að senda tilkynningu',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að senda tilkynningu',
  },
  nationalRegistry: {
    id: 'judicial.system.core:errors.national_registry',
    defaultMessage: 'Upp kom villa við að sækja gögn frá Þjóðskrá',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að sækja gögn frá Þjóðskrá',
  },
  fetchLawyers: {
    id: 'judicial.system.core:errors.fetch_lawyers',
    defaultMessage: 'Upp kom villa við að sækja lögmanna skrá',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að sækja lögmanna skrá',
  },
  copyLink: {
    id: 'judicial.system.core:errors.copy_link',
    defaultMessage: 'Ekki tókst að afrita hlekk',
    description: 'Notaður sem villuskilaboð þegar ekki gengur að afrita hlekk',
  },
  createIndictmentCount: {
    id: 'judicial.system.core:errors.create_indictment_count',
    defaultMessage: 'Upp kom villa við að stofna nýjan ákærulið',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að stofna nýjan ákærulíð',
  },
  updateIndictmentCount: {
    id: 'judicial.system.core:errors.update_indictment_count',
    defaultMessage: 'Upp kom villa við að uppfæra ákærulið',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að uppfæra ákærulíð',
  },
  deleteIndictmentCount: {
    id: 'judicial.system.core:errors.delete_indictment_count',
    defaultMessage: 'Upp kom villa við að eyða ákærulið',
    description: 'Notaður sem villuskilaboð þegar ekki gengur að eyða ákærulíð',
  },
  getCaseToOpen: {
    id: 'judicial.system.core:errors.getCaseToOpen',
    defaultMessage: 'Upp kom villa við að sækja mál',
    description:
      'Notaður sem villuskilaboð þegar mistekst að opna mál úr málalista',
  },
  failedToFetchDataFromDbTitle: {
    id: 'judicial.system.core:errors.failed_to_fetch_data_from_db_title',
    defaultMessage: 'Ekki tókst að sækja gögn úr gagnagrunni',
    description:
      'Notaður sem titill þegar ekki tókst að sækja gögn úr gagnagrunni',
  },
  failedToFetchDataFromDbMessage: {
    id: 'judicial.system.core:errors.failed_to_fetch_data_from_db_message',
    defaultMessage:
      'Ekki tókst að ná sambandi við gagnagrunn. Málið hefur verið skráð og viðeigandi aðilar látnir vita. Vinsamlega reynið aftur síðar.',
    description:
      'Notaður sem skilaboð þegar ekki tókst að sækja gögn úr gagnagrunni',
  },
})
