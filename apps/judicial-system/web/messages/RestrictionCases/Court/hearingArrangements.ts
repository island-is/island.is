import { defineMessages, defineMessage } from 'react-intl'

// Strings for court officials
export const rcHearingArrangements = {
  title: defineMessage({
    id: 'judicial.system.restriction_cases:hearing_arrangements.title',
    defaultMessage: 'Fyrirtaka',
    description:
      'Notaður sem titill á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
  }),
  sections: {
    setJudge: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.set_judge.title',
        defaultMessage: 'Dómari',
        description:
          'Notaður sem titill fyrir "dómari" hlutann á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.set_judge.tooltip',
        defaultMessage:
          'Dómarinn sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupóst. Eingöngu skráður dómari getur svo undirritað úrskurð.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómari" titlinn á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    setRegistrar: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.set_registrar.title',
        defaultMessage: 'Dómritari',
        description:
          'Notaður sem titill fyrir "Dómritari" hlutann á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
      tooltip: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.set_registrar.tooltip',
        defaultMessage:
          'Dómritari sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupósti.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómritari" titlinn á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    requestedCourtDate: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.requested_court_date.title',
        defaultMessage: 'Skrá fyrirtökutíma',
        description:
          'Notaður sem titill fyrir "Skrá fyrirtökutíma" hlutann á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    defender: defineMessages({
      title: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.defender.title',
        defaultMessage: 'Verjandi',
        description:
          'Notaður sem titill fyrir "Verjanda" hlutann á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
  modal: {
    custodyCases: defineMessages({
      heading: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.modal.custody_cases.heading',
        defaultMessage: 'Tilkynning um fyrirtökutíma hefur verið send',
        description:
          'Notaður sem titill fyrir "tilkynning um fyrirtökutíma hefur verið send" tilkynningagluggan á fyrirtöku skrefi í gæsluvarðhaldsmálum.',
      },
      text: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.modal.custody_cases.text',
        defaultMessage:
          'Tilkynning hafi verið send á ákæranda, fangelsi og verjanda hafi verjandi verið skráður.',
        description:
          'Notaður sem texti í "tilkynning um fyrirtökutíma hefur verið send" tilkynningaglugganum á fyrirtöku skrefi í gæsluvarðhaldsmálum.',
      },
    }),
    travelBanCases: defineMessages({
      heading: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.modal.travel_ban_cases.heading',
        defaultMessage: 'Tilkynning um fyrirtökutíma hefur verið send',
        description:
          'Notaður sem titill fyrir "tilkynning um fyrirtökutíma hefur verið send" tilkynningagluggan á fyrirtöku skrefi í farbannsmálum.',
      },
      text: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.modal.travel_ban_cases.text',
        defaultMessage:
          'Tilkynning hefur verið send á ákæranda og verjanda hafi verjandi verið skráður.',
        description:
          'Notaður sem texti í "tilkynning um fyrirtökutíma hefur verið send" tilkynningaglugganum á fyrirtöku skrefi í farbannsmálum.',
      },
    }),
    shared: defineMessages({
      secondaryButtonText: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.modal.shared.secondary_button_text',
        defaultMessage: 'Nei, senda seinna',
        description:
          'Notaður sem texti í "Nei, senda seinna" takkann í tilkynningaglugganum á fyrirtöku skrefi í farbannsmálum.',
      },
      primaryButtonText: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.modal.shared.primary_button_text',
        defaultMessage: 'Já, senda núna',
        description:
          'Notaður sem texti í "Já, senda núna" takkann í tilkynningaglugganum á fyrirtöku skrefi í farbannsmálum.',
      },
    }),
  },
}
