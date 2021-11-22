import { defineMessage, defineMessages } from 'react-intl'

// Strings for court officials
export const icHearingArrangements = {
  title: defineMessage({
    id: 'judicial.system.investigation_cases:hearing_arrangements.title',
    defaultMessage: 'Fyrirtaka',
    description: 'Notaður sem titill á fyrirtöku skrefi í rannsóknarheimildum.',
  }),
  sections: {
    setJudge: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.set_judge.title',
        defaultMessage: 'Dómari',
        description:
          'Notaður sem titll fyrir "dómari" hlutann á fyrirtöku skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.set_judge.tooltip',
        defaultMessage:
          'Dómarinn sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupóst. Eingöngu skráður dómari getur svo undirritað úrskurð.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómari" titlinn á fyrirtöku skrefi í rannsóknarheimildum.',
      },
    }),
    setRegistrar: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.set_registrar.title',
        defaultMessage: 'Dómritari',
        description:
          'Notaður sem titll fyrir "Dómritari" hlutann á fyrirtöku skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.set_registrar.tooltip',
        defaultMessage:
          'Dómritari sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupósti.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómritari" titlinn á fyrirtöku skrefi í rannsóknarheimildum.',
      },
    }),
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
          'judicial.system.investigation_cases:hearing_arrangements.defender.title',
        defaultMessage: 'Verjandi/talsmaður',
        description:
          'Notaður sem titill fyrir "Verjandi/talsmaður" hlutann á fyrirtöku skrefi í rannsóknarheimildum.',
      },
    }),
  },
  modal: defineMessages({
    heading: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.heading',
      defaultMessage: 'Tilkynning um fyrirtökutíma hefur verið send',
      description:
        'Notaður sem titill fyrir tilkynningagluggan á fyrirtöku skrefi í rannsóknarheimildum.',
    },
    remoteSessionHeading: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.remote_session_heading',
      defaultMessage: 'Enginn hefur verið boðaður í þinghald að svo stöddu',
      description:
        'Notaður sem titill fyrir tilkynningagluggan á fyrirtöku skrefi í rannsóknarheimildum ef fyrirtaka er án munnlegs málflutnings.',
    },
    allPresentText: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.all_present_text',
      defaultMessage:
        'Tilkynning um fyrirtöku verður send á saksóknara og verjanda, hafi verjandi verið skráður.',
      description:
        'Notaður sem texti í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum ef fulltrúi ákæruvalds og verjandi mæta.',
    },
    allPresentSpokespersonText: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.all_present_spokesperson_text',
      defaultMessage:
        'Tilkynning um fyrirtöku verður send á saksóknara og talsmann, hafi talsmaður verið skráður.',
      description:
        'Notaður sem texti í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum ef fulltrúi ákæruvalds mætir og dómari kallar til talsmann.',
    },
    prosecutorPresentText: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.prosecutor_present_text',
      defaultMessage: 'Tilkynning um fyrirtöku verður send á saksóknara.',
      description:
        'Notaður sem texti í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum ef fulltrúi ákæruvalds mætir.',
    },
    remoteSessionText: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.remote_session_text',
      defaultMessage:
        'Ekki er sjálfkrafa gert ráð fyrir boðun eða mætingu af hálfu málsaðila eða málflytjenda í þinghaldið.',
      description:
        'Notaður sem texti fyrir tilkynningagluggan á fyrirtöku skrefi í rannsóknarheimildum ef fyrirtaka er án munnlegs málflutnings.',
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
    primaryButtonRemoteSessionText: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.primary_button_remote_session_text',
      defaultMessage: 'Áfram',
      description:
        'Notaður sem texti í takkanum í tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum ef fyrirtaka er án munnlegs málflutnings.',
    },
  }),
  footer: defineMessages({
    infoPanelForRestrictedAccess: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.footer.info_panel_for_restricted_access',
      defaultMessage:
        'Aðeins skráður dómari og dómritari geta haldið áfram í þingbók og úrskurð fyrir rannsóknarheimildir.',
      description:
        'Notaður sem texti sem birtist í staðinn fyrir halda áfram takka á fyrirtöku skrefi í rannsóknarheimildum ef notandi hefur ekki aðgang að málinu.',
    },
  }),
}
