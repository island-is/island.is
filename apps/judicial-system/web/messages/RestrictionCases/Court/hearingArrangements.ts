import { defineMessages } from 'react-intl'

// Strings for court officials
export const rcHearingArrangements = {
  sections: {
    setRegistrar: defineMessages({
      tooltip: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.set_registrar.tooltip',
        defaultMessage:
          'Dómritari sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupósti.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómritari" titlinn á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    setJudge: defineMessages({
      tooltip: {
        id:
          'judicial.system.restriction_cases:hearing_arrangements.set_judge.tooltip',
        defaultMessage:
          'Dómarinn sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupóst. Eingöngu skráður dómari getur svo undirritað úrskurð.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómari" titlinn á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
  modal: defineMessages({
    heading: {
      id:
        'judicial.system.restriction_cases:hearing_arrangements.modal.heading',
      defaultMessage: 'Tilkynning um fyrirtökutíma hefur verið send',
      description:
        'Notaður sem titill fyrir "tilkynning um fyrirtökutíma hefur verið send" tilkynningagluggan á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
    text: {
      id: 'judicial.system.restriction_cases:hearing_arrangements.modal.text',
      defaultMessage:
        'Tilkynning hafi verið send á ákæranda, fangelsi og verjanda hafi verjandi verið skráður.',
      description:
        'Notaður sem texti í "tilkynning um fyrirtökutíma hefur verið send" tilkynningaglugganum á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
    },
  }),
}
