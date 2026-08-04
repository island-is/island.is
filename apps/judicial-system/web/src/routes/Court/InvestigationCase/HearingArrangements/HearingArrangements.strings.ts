import { defineMessage, defineMessages } from 'react-intl'

// Strings for court officials
export const icHearingArrangements = {
  requestProsecutorOnlySession: defineMessage({
    id: 'judicial.system.core:investigation_cases_hearing_arrangements.request_prosecutor_only_session',
    defaultMessage: 'Beiðni um dómþing að varnaraðila fjarstöddum',
    description:
      'Notaður sem texti fyrir beiðni um dómþing að varnaraðila fjarstöddum á fyrirtöku skrefi í rannsóknarheimildum.',
  }),
  title: defineMessage({
    id: 'judicial.system.core:investigation_cases_hearing_arrangements.title',
    defaultMessage: 'Fyrirtaka',
    description: 'Notaður sem titill á fyrirtöku skrefi í rannsóknarheimildum.',
  }),
  sections: {
    sessionArrangements: {
      heading: defineMessage({
        id: 'judicial.system.core:investigation_cases_hearing_arrangements.session_arrangements.heading',
        defaultMessage: 'Fyrirtaka',
        description:
          'Notaður sem titill fyrir "fyrirtöku" hlutan á fyrirtöku skrefi í rannsóknarheimildum.',
      }),
      options: {
        allPresent: defineMessage({
          id: 'judicial.system.core:investigation_cases_hearing_arrangements.session_arrangements.options.all_present_v1',
          defaultMessage: 'Fulltrúar málsaðila boðaðir',
          description:
            'Notaður sem texti fyrir valmöguleikann "Fulltrúar málsaðila boðaðir" á fyrirtöku skrefi í dómaraflæði í rannsóknarheimildum',
        }),
        allPresentSpokesperson: defineMessage({
          id: 'judicial.system.core:investigation_cases_hearing_arrangements.session_arrangements.options.all_present_spokesperson_v1',
          defaultMessage:
            'Fulltrúi ákæruvalds boðaður og dómari kallar til talsmann',
          description:
            'Notaður sem texti fyrir valmöguleikann "Fulltrúi ákæruvalds boðaður og dómari kallar til talsmann" á fyrirtöku skrefi í dómaraflæði í rannsóknarheimildum',
        }),
        prosecutorPresent: defineMessage({
          id: 'judicial.system.core:investigation_cases_hearing_arrangements.session_arrangements.options.prosecutor_present_v1',
          defaultMessage: 'Fulltrúi ákæruvalds boðaður',
          description:
            'Notaður sem texti fyrir valmöguleikann "Fulltrúi ákæruvalds boðaður" á fyrirtöku skrefi í dómaraflæði í rannsóknarheimildum',
        }),
        nonePresent: defineMessage({
          id: 'judicial.system.core:investigation_cases_hearing_arrangements.session_arrangements.options.none_present',
          defaultMessage: 'Krafa tekin fyrir án boðunar í þinghald',
          description:
            'Notaður sem texti fyrir valmöguleikann "Krafa tekin fyrir án boðunar í þinghald" á fyrirtöku skrefi í dómaraflæði í rannsóknarheimildum',
        }),
      },
    },
    requestedCourtDate: defineMessages({
      title: {
        id: 'judicial.system.core:investigation_cases_hearing_arrangements.requested_court_date.title',
        defaultMessage: 'Skrá fyrirtökutíma',
        description:
          'Notaður sem titill fyrir "Skrá fyrirtökutíma" hlutann á fyrirtöku skrefi í rannsóknarheimildum.',
      },
    }),
    defender: defineMessages({
      title: {
        id: 'judicial.system.core:investigation_cases_hearing_arrangements.defender.title',
        defaultMessage: '{defenderType}',
        description:
          'Notaður sem titill fyrir "Verjandi/talsmaður" hlutann á fyrirtöku skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id: 'judicial.system.core:investigation_cases_hearing_arrangements.defender.tooltip',
        defaultMessage:
          'Lögmaður sem er valinn hér verður skipaður {defenderType} í þinghaldi og fær sendan úrskurð rafrænt.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "Verjanda" fyrirsögn á fyrirtöku skrefi í rannsóknarheimildum.',
      },
    }),
  },
}
