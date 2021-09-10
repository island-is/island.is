import { defineMessage, defineMessages } from 'react-intl'

// Strings for court officials
export const icHearingArrangements = {
  sections: {
    setRegistrar: defineMessages({
      tooltip: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.set_registrar.tooltip',
        defaultMessage:
          'Dómritari sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupósti.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómritari" titlinn á fyrirtöku skrefi í rannsóknarheimildum.',
      },
    }),
    setJudge: defineMessages({
      tooltip: {
        id:
          'judicial.system.investigation_cases:hearing_arrangements.set_judge.tooltip',
        defaultMessage:
          'Dómarinn sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupóst. Eingöngu skráður dómari getur svo undirritað úrskurð.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómari" titlinn á fyrirtöku skrefi í rannsóknarheimildum.',
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
        remoteSession: defineMessage({
          id:
            'judicial.system.investigation_cases:hearing_arrangements.session_arrangements.options.remote_session',
          defaultMessage: 'Fyrirtaka að málsaðilum fjarstöddum',
          description:
            'Notaður sem texti fyrir valmöguleikann "Fyrirtaka að málsaðilum fjarstöddum" á fyrirtöku skrefi í dómaraflæði í rannsóknarheimildum',
        }),
      },
    },
  },
  modal: defineMessages({
    heading: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.heading',
      defaultMessage: 'Tilkynning um fyrirtökutíma hefur verið send',
      description:
        'Notaður sem titill fyrir "tilkynning um fyrirtökutíma hefur verið send" tilkynningagluggan á fyrirtöku skrefi í rannsóknarheimildum.',
    },
    remoteSessionHeading: {
      id:
        'judicial.system.investigation_cases:hearing_arrangements.modal.remote_session_heading',
      defaultMessage: 'Enginn hefur verið boðaður í þinghald að svo stöddu',
      description:
        'Notaður sem titill fyrir "tilkynning um fyrirtökutíma hefur verið send" tilkynningagluggan á fyrirtöku skrefi í rannsóknarheimildum ef fyrirtaka er án munnlegs málflutnings.',
    },
    text: {
      id: 'judicial.system.investigation_cases:hearing_arrangements.modal.text',
      defaultMessage:
        'Tilkynning um fyrirtöku hefur verið send á saksóknara{announcementSuffix}',
      description:
        'Notaður sem texti í "tilkynning um fyrirtökutíma hefur verið send" tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum.',
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
}
