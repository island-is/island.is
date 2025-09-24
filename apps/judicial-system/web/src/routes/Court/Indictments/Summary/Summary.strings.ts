import { defineMessages } from 'react-intl'

export const strings = defineMessages({
  htmlTitle: {
    id: 'judicial.system.core:indictments.summary.html_title',
    defaultMessage: 'Samantekt',
    description: 'Notaður sem titill á síðu í vafra',
  },
  title: {
    id: 'judicial.system.core:indictments.summary.title',
    defaultMessage: 'Samantekt',
    description: 'Notaður sem titill fyrir samantektarsíðu',
  },
  caseFiles: {
    id: 'judicial.system.core:indictments.summary.case_files',
    defaultMessage: 'Skjöl málsins',
    description: 'Notaður sem titill fyrir skjöl málsins',
  },
  caseFilesSubtitleRuling: {
    id: 'judicial.system.core:indictments.summary.case_files_subtitle_rulings_and_court_records',
    defaultMessage: 'Dómar, úrskurðir og þingbók',
    description:
      'Notaður sem undirtitill fyrir skjöl málsins ef um dóm er að ræða',
  },
  nextButtonText: {
    id: 'judicial.system.core:indictments.summary.next_button_text',
    defaultMessage: 'Staðfesta',
    description:
      'Notaður sem titill á Staðfesta takka á Samantektarskjá ákæru.',
  },
  completeCaseModalTitle: {
    id: 'judicial.system.core:indictments.summary.complete_case_modal_title',
    defaultMessage: 'Viltu ljúka máli?',
    description:
      'Notaður sem titill á staðfestingarglugga um að hvort eigi að ljúka máli.',
  },
  completeCaseModalPrimaryButton: {
    id: 'judicial.system.core:indictments.summary.complete_case_modal_primary_button',
    defaultMessage: 'Já, ljúka máli',
    description:
      'Notaður sem texti á aðalhnapp í staðfestingarglugga um hvort eigi að ljúka máli.',
  },
  completeCaseModalSecondaryButton: {
    id: 'judicial.system.core:indictments.summary.complete_case_modal_secondary_button',
    defaultMessage: 'Hætta við',
    description:
      'Notaður sem texti á aukahnapp í staðfestingarglugga um hvort eigi að ljúka máli.',
  },
  onlyAssignedJudgeCanComplete: {
    id: 'judicial.system.core:indictments.summary.only_assigned_judge_can_complete',
    defaultMessage: 'Einungis skráður dómari getur lokið málinu',
    description:
      'Notaður sem texti í stað "áfram" takkans á samantektarskjá ákæru þegar "áfram" takkinn er falinn',
  },
  courtEndTimeTitle: {
    id: 'judicial.system.core:indictments.summary.court_end_time_title',
    defaultMessage: 'Dagsetning lykta',
    description: 'Notaður sem titill fyrir dagsetning lykta á samantektarskjá',
  },
  courtEndTimeDescription: {
    id: 'judicial.system.core:indictments.summary.court_end_time_description_v2',
    defaultMessage:
      'Vinsamlegast skráið dagsetningu lykta, þ.e. hvenær dómur var kveðinn upp, dagsetning viðurlagaákvörðunar eða annarra lykta. Þessi dagsetning skilar sér til ríkissaksóknara og áfrýjunarfrestir og aðrir frestir miðast við hana.',
    description: 'Notaður sem lýsing fyrir dagsetning lykta á samantektarskjá',
  },
})
