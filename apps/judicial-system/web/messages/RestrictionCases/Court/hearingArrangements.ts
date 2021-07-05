import { defineMessages } from 'react-intl'

// Strings for court officials
export const rcHearingArrangements = {
  sections: {
    setRegistrar: defineMessages({
      tooltip: {
        id:
          'judicial.system:restriction_cases.hearing_arrangements.set_registrar.tooltip',
        defaultMessage:
          'Dómritari sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupósti.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómritari" titlinn á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
    setJudge: defineMessages({
      tooltip: {
        id:
          'judicial.system:restriction_cases.hearing_arrangements.set_judge.tooltip',
        defaultMessage:
          'Dómarinn sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupóst. Eingöngu skráður dómari getur svo undirritað úrskurð.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómari" titlinn á fyrirtöku skrefi í gæsluvarðhalds- og farbannsmálum.',
      },
    }),
  },
}
