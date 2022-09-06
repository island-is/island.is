import { defineMessages } from 'react-intl'

export const selectCourtOfficials = defineMessages({
  setJudgeTitle: {
    id:
      'judicial.system.restriction_cases:reception_and_assignment.set_judge_title',
    defaultMessage: 'Dómari',
    description:
      'Notaður sem titill fyrir "dómari" hlutann á Móttaka og úthlutun skrefi í gæsluvarðhalds- og farbannsmálum.',
  },
  setJudgeTooltip: {
    id:
      'judicial.system.restriction_cases:reception_and_assignment.set_judge_tooltip',
    defaultMessage:
      'Dómarinn sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupóst. Eingöngu skráður dómari getur svo undirritað úrskurð.',
    description:
      'Notaður sem upplýsingatexti í upplýsingasvæði við "dómari" titlinn á Móttaka og úthlutun skrefi í gæsluvarðhalds- og farbannsmálum.',
  },
  setRegistrarTitle: {
    id:
      'judicial.system.restriction_cases:reception_and_assignment.set_registrar_title',
    defaultMessage: 'Dómritari',
    description:
      'Notaður sem titill fyrir "Dómritari" hlutann á Móttaka og úthlutun skrefi í gæsluvarðhalds- og farbannsmálum.',
  },
  setRegistrarTooltip: {
    id:
      'judicial.system.restriction_cases:reception_and_assignment.set_registrar_tooltip',
    defaultMessage:
      'Dómritari sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupósti.',
    description:
      'Notaður sem upplýsingatexti í upplýsingasvæði við "dómritari" titlinn á Móttaka og úthlutun skrefi í gæsluvarðhalds- og farbannsmálum.',
  },
})
