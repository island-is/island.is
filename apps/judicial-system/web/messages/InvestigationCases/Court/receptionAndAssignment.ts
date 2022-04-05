import { defineMessages } from '@formatjs/intl'
import { defineMessage } from 'react-intl'

export const icReceptionAndAssignment = {
  title: defineMessage({
    id: 'judicial.system.investigation_cases:reception_and_assignment.title',
    defaultMessage: 'Móttaka og úthlutun',
    description:
      'Notaður sem titill á Móttaka og úthlutun skrefi í rannsóknarheimildum.',
  }),
  sections: {
    setJudge: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:reception_and_assignment.set_judge.title',
        defaultMessage: 'Dómari',
        description:
          'Notaður sem titill fyrir "dómari" hlutann á Móttaka og úthlutun skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:reception_and_assignment.set_judge.tooltip',
        defaultMessage:
          'Dómarinn sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupóst. Eingöngu skráður dómari getur svo undirritað úrskurð.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómari" titlinn á Móttaka og úthlutun skrefi í rannsóknarheimildum.',
      },
    }),
    setRegistrar: defineMessages({
      title: {
        id:
          'judicial.system.investigation_cases:reception_and_assignment.set_registrar.title',
        defaultMessage: 'Dómritari',
        description:
          'Notaður sem titill fyrir "Dómritari" hlutann á Móttaka og úthlutun skrefi í rannsóknarheimildum.',
      },
      tooltip: {
        id:
          'judicial.system.investigation_cases:reception_and_assignment.set_registrar.tooltip',
        defaultMessage:
          'Dómritari sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupósti.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómritari" titlinn á Móttaka og úthlutun skrefi í rannsóknarheimildum.',
      },
    }),
  },
}
