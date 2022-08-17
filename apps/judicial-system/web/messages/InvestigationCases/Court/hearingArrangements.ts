import { defineMessage, defineMessages } from 'react-intl'

// Strings for court officials
export const icHearingArrangements = {
  requestProsecutorOnlySession: defineMessage({
    id:
      'judicial.system.investigation_cases:hearing_arrangements.request_prosecutor_only_session',
    defaultMessage: 'Beiðni um dómþing að varnaraðila fjarstöddum',
    description:
      'Notaður sem texti fyrir beiðni um dómþing að varnaraðila fjarstöddum á fyrirtöku skrefi í rannsóknarheimildum.',
  }),
  comments: {
    title: defineMessage({
      id:
        'judicial.system.investigation_cases:hearing_arrangements.comments.title',
      defaultMessage: 'Athugasemdir vegna málsmeðferðar',
      description:
        'Notaður sem titill í viðvörunarboxi með athugasemdum vegna málsmeðferðar á fyrirtöku skrefi í rannsóknarheimildum.',
    }),
  },
  title: defineMessage({
    id: 'judicial.system.investigation_cases:hearing_arrangements.title',
    defaultMessage: 'Fyrirtaka',
    description: 'Notaður sem titill á fyrirtöku skrefi í rannsóknarheimildum.',
  }),
  sections: {
    sessionArrangements: {
      heading: defineMessage({
        id:
          'judicial.system.investigation_cases:hearing_arrangements.session_arrangements.heading',
        defaultMessage: 'Fyrirtaka',
        description:
          'Notaður sem titill fyrir "fyrirtöku" hlutan á fyrirtöku skrefi í rannsóknarheimildum.',
      }),
      tooltip: defineMessage({
        id:
          'judicial.system.investigation_cases:hearing_arrangements.session_arrangements.tooltip',
        defaultMessage:
          'Hér er hægt að merkja hvaða aðilar málsins mæta í fyrirtöku eða hvort fyrirtakan fari fram rafrænt.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "Fyrirtaka" titlinn á fyrirtöku skrefi í rannsóknarheimildum.',
      }),
      options: {
        allPresent: defineMessage({
          id:
            'judicial.system.investigation_cases:hearing_arrangements.session_arrangements.options.all_present',
          defaultMessage: 'Fulltrúar málsaðila mæta',
          description:
            'Notaður sem texti fyrir valmöguleikann "Fulltrúar málsaðila mæta" á fyrirtöku skrefi í dómaraflæði í rannsóknarheimildum',
        }),
        allPresentSpokesperson: defineMessage({
          id:
            'judicial.system.investigation_cases:hearing_arrangements.session_arrangements.options.all_present_spokesperson',
          defaultMessage:
            'Fulltrúi ákæruvalds mætir og dómari kallar til talsmann',
          description:
            'Notaður sem texti fyrir valmöguleikann "Fulltrúi ákæruvalds mætir og dómari kallar til talsmann" á fyrirtöku skrefi í dómaraflæði í rannsóknarheimildum',
        }),
        prosecutorPresent: defineMessage({
          id:
            'judicial.system.investigation_cases:hearing_arrangements.session_arrangements.options.prosecutor_present',
          defaultMessage: 'Fulltrúi ákæruvalds mætir',
          description:
            'Notaður sem texti fyrir valmöguleikann "Fulltrúi ákæruvalds mætir" á fyrirtöku skrefi í dómaraflæði í rannsóknarheimildum',
        }),
      },
    },
    requestedCourtDate: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.requested_court_date.title',
        defaultMessage: 'Skrá fyrirtökutíma',
        description:
          'Notaður sem titill fyrir "Skrá fyrirtökutíma" hlutann á fyrirtöku skrefi í rannsóknarheimildum.',
      },
    }),
    defender: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.defender.title_v1',
        defaultMessage: '{defenderType}',
        description:
          'Notaður sem titill fyrir "Verjandi/talsmaður" hlutann á fyrirtöku skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.defender.tooltip',
        defaultMessage:
          'Lögmaður sem er valinn hér verður skipaður {defenderType} í þinghaldi og fær sendan úrskurð rafrænt.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "Verjanda" fyrirsögn á fyrirtöku skrefi í rannsóknarheimildum.',
      },
      nameLabel: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.defender.name_label',
        defaultMessage: 'Nafn {defenderType}',
        description:
          'Notaður sem titill í "Nafn verjanda/talsmanns" textaboxi á fyrirtöku skrefi í rannsóknarheimildum.',
      },
      namePlaceholder: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.defender.name_placeholder',
        defaultMessage: 'Fullt nafn',
        description:
          'Notaður sem skýritexti í "Nafn verjanda/talsmanns" textaboxi á fyrirtöku skrefi í rannsóknarheimildum.',
      },
      emailLabel: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.defender.email_label',
        defaultMessage: 'Netfang {defenderType}',
        description:
          'Notaður sem titill í "Netfang verjanda/talsmanns" textaboxi á fyrirtöku skrefi í rannsóknarheimildum.',
      },
      emailPlaceholder: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.defender.email_placeholder',
        defaultMessage: 'Netfang',
        description:
          'Notaður sem skýritexti í "Netfang verjanda/talsmanns" textaboxi á fyrirtöku skrefi í rannsóknarheimildum.',
      },
      phoneNumberLabel: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.defender.phone_number_label',
        defaultMessage: 'Símanúmer {defenderType}',
        description:
          'Notaður sem titill í "Símanúmer verjanda/talsmanns" textaboxi á fyrirtöku skrefi í rannsóknarheimildum.',
      },
      phoneNumberPlaceholder: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.defender.phone_number_placeholder',
        defaultMessage: 'Símanúmer',
        description:
          'Notaður sem skýritexti í "Símanúmer verjanda/talsmanns" textaboxi á fyrirtöku skrefi í rannsóknarheimildum.',
      },
    }),
  },
  continueButton: defineMessages({
    label: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.continue_button.label',
      defaultMessage: 'Staðfesta fyrirtökutíma',
      description:
        'Notaður sem titil á takka til að halda áfram á fyrirtöku skrefi í rannsóknarheimildum.',
    },
  }),
  modal: defineMessages({
    heading: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.heading',
      defaultMessage: 'Tilkynning um fyrirtökutíma hefur verið send',
      description:
        'Notaður sem titill fyrir tilkynningagluggan á fyrirtöku skrefi í rannsóknarheimildum.',
    },
    allPresentText: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.all_present_text_v2',
      defaultMessage:
        '{courtDateHasChanged, select, true {Fyrirtökutíma hefur verið breytt. } other {}}Tilkynning um fyrirtöku verður send á saksóknara og verjanda, hafi verjandi verið skráður.',
      description:
        'Notaður sem texti í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum ef fulltrúi ákæruvalds og verjandi mæta.',
    },
    allPresentSpokespersonText: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.all_present_spokesperson_text_v2',
      defaultMessage:
        '{courtDateHasChanged, select, true {Fyrirtökutíma hefur verið breytt. } other {}}Tilkynning um fyrirtöku verður send á saksóknara og talsmann, hafi talsmaður verið skráður.',
      description:
        'Notaður sem texti í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum ef fulltrúi ákæruvalds mætir og dómari kallar til talsmann.',
    },
    prosecutorPresentText: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.prosecutor_present_text_v2',
      defaultMessage:
        '{courtDateHasChanged, select, true {Fyrirtökutíma hefur verið breytt. } other {}}Tilkynning um fyrirtöku verður send á saksóknara.',
      description:
        'Notaður sem texti í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum ef fulltrúi ákæruvalds mætir.',
    },
    secondaryButtonText: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.secondary_button_text',
      defaultMessage: 'Nei, senda seinna',
      description:
        'Notaður sem texti í "Nei, senda seinna" takkann í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum.',
    },
    primaryButtonText: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.primary_button_text',
      defaultMessage: 'Já, senda núna',
      description:
        'Notaður sem texti í "Já, senda núna" takkann í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum.',
    },
  }),
}
