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
  continueButton: defineMessages({
    label: {
      id: 'judicial.system.core:investigation_cases_hearing_arrangements.continue_button.label',
      defaultMessage: 'Staðfesta fyrirtökutíma',
      description:
        'Notaður sem titil á takka til að halda áfram á fyrirtöku skrefi í rannsóknarheimildum.',
    },
  }),
  modal: defineMessages({
    heading: {
      id: 'judicial.system.core:investigation_cases_hearing_arrangements.modal.heading',
      defaultMessage: 'Tilkynning um fyrirtökutíma hefur verið send',
      description:
        'Notaður sem titill fyrir tilkynningagluggan á fyrirtöku skrefi í rannsóknarheimildum.',
    },
    allPresentText: {
      id: 'judicial.system.core:investigation_cases_hearing_arrangements.modal.all_present_text',
      defaultMessage:
        '{courtDateHasChanged, select, true {Fyrirtökutíma hefur verið breytt. } other {}}Tilkynning um fyrirtöku verður send á saksóknara og verjanda, hafi verjandi verið skráður.',
      description:
        'Notaður sem texti í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum ef fulltrúi ákæruvalds og verjandi mæta.',
    },
    allPresentSpokespersonText: {
      id: 'judicial.system.core:investigation_cases_hearing_arrangements.modal.all_present_spokesperson_text',
      defaultMessage:
        '{courtDateHasChanged, select, true {Fyrirtökutíma hefur verið breytt. } other {}}Tilkynning um fyrirtöku verður send á saksóknara og talsmann, hafi talsmaður verið skráður.',
      description:
        'Notaður sem texti í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum ef Fulltrúi ákæruvalds boðaður og dómari kallar til talsmann.',
    },
    prosecutorPresentText: {
      id: 'judicial.system.core:investigation_cases_hearing_arrangements.modal.prosecutor_present_text',
      defaultMessage:
        '{courtDateHasChanged, select, true {Fyrirtökutíma hefur verið breytt. } other {}}Tilkynning um fyrirtöku verður send á saksóknara.',
      description:
        'Notaður sem texti í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum ef fulltrúi ákæruvalds mætir.',
    },
    secondaryButtonText: {
      id: 'judicial.system.core:investigation_cases_hearing_arrangements.modal.secondary_button_text',
      defaultMessage:
        'Nei{courtDateHasChanged, select, true {} other {, senda seinna}}',
      description:
        'Notaður sem texti í "Nei" takkann í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum.',
    },
    primaryButtonText: {
      id: 'judicial.system.core:investigation_cases_hearing_arrangements.modal.primary_button_text',
      defaultMessage: 'Já, senda',
      description:
        'Notaður sem texti í "Já, senda" takkann í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum.',
    },
  }),
}
