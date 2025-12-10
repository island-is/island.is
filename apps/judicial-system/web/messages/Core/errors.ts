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
  updateCivilClaimant: {
    id: 'judicial.system.core:errors.update_civil_claimant',
    defaultMessage: 'Upp kom villa við að uppfæra kröfuhafa',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að uppfæra kröfuhafa',
  },
  createDefendant: {
    id: 'judicial.system.core:errors.create_defendant',
    defaultMessage: 'Upp kom villa við að stofna nýjan varnaraðila',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að stofna varnaraðila',
  },
  createCivilClaimant: {
    id: 'judicial.system.core:errors.create_civil_claimant',
    defaultMessage: 'Upp kom villa við að stofna nýjan kröfuhafa',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að stofna kröfuhafa',
  },
  deleteDefendant: {
    id: 'judicial.system.core:errors.delete_defendant',
    defaultMessage: 'Upp kom villa við að eyða varnaraðila',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að eyða varnaraðila',
  },
  deleteCivilClaimant: {
    id: 'judicial.system.core:errors.delete_civil_claimant',
    defaultMessage: 'Upp kom villa við að eyða kröfuhafa',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að eyða kröfuhafa',
  },
  createCase: {
    id: 'judicial.system.core:errors.create_case_v1',
    defaultMessage: 'Upp kom villa við stofnun máls',
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
  createOffense: {
    id: 'judicial.system.core:errors.create_offense',
    defaultMessage: 'Upp kom villa við að stofna nýtt brot',
    description:
      'Notaður sem villuskilaboð þegar ekki gengur að stofna nýtt brot',
  },
  updateOffense: {
    id: 'judicial.system.core:errors.update_offense',
    defaultMessage: 'Upp kom villa við að uppfæra brot',
    description: 'Notaður sem villuskilaboð þegar ekki gengur að uppfæra brot',
  },
  deleteOffense: {
    id: 'judicial.system.core:errors.delete_offense',
    defaultMessage: 'Upp kom villa við að eyða broti',
    description: 'Notaður sem villuskilaboð þegar ekki gengur að eyða broti',
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
  createEventLog: {
    id: 'judicial.system.core:errors.create_event_log',
    defaultMessage: 'Upp kom villa við að skrá aðgerð',
    description: 'Notaður sem villuskilaboð þegar ekki gengur að skrá atburð',
  },
  openDocument: {
    id: 'judicial.system.core:errors.open_document',
    defaultMessage: 'Upp kom villa við að opna skjal',
    description: 'Notaður sem villuskilaboð þegar ekki gengur að opna skjal',
  },
  getSubpoenaStatusTitle: {
    id: 'judicial.system.core:errors.get_subpoena_status_title',
    defaultMessage: 'Ekki tókst að sækja stöðu birtingar',
    description:
      'Notaður sem villuskilaboð þegar tekst að sækja stöðu birtingar',
  },
  getSubpoenaStatus: {
    id: 'judicial.system.core:errors.get_subpoena_status',
    defaultMessage: 'Vinsamlegast reyndu aftur síðar',
    description:
      'Notaður sem villuskilaboð þegar tekst að sækja stöðu birtingar',
  },
  invalidDate: {
    id: 'judicial.system.core:errors.invalid_date',
    defaultMessage: 'Dagsetning ekki rétt slegin inn',
    description: 'Notaður sem villuskilaboð þegar dagsetning er ekki löggild',
  },
  uploadFailed: {
    id: 'judicial.system.core:errors.upload_failed',
    defaultMessage: 'Upp kom villa við að hlaða upp skjali',
    description:
      'Notaður sem villuskilaboð þegar ekki tekst að hlaða upp skjali',
  },
})
