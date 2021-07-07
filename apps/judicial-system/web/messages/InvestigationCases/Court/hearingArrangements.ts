import { defineMessages } from 'react-intl'

// Strings for court officials
export const icHearingArrangements = {
  sections: {
    setRegistrar: defineMessages({
      tooltip: {
        id:
          'judicial.system:investigation_cases.hearing_arrangements.set_registrar.tooltip',
        defaultMessage:
          'Dómritari sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupósti.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómritari" titlinn á fyrirtöku skrefi í rannsóknarheimildum.',
      },
    }),
    setJudge: defineMessages({
      tooltip: {
        id:
          'judicial.system:investigation_cases.hearing_arrangements.set_judge.tooltip',
        defaultMessage:
          'Dómarinn sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupóst. Eingöngu skráður dómari getur svo undirritað úrskurð.',
        description:
          'Notaður sem upplýsingatexti í upplýsingasvæði við "dómari" titlinn á fyrirtöku skrefi í rannsóknarheimildum.',
      },
    }),
  },
  modal: defineMessages({
    heading: {
      id:
        'judicial.system:investigation_cases.hearing_arrangements.modal.heading',
      defaultMessage: 'Tilkynning um fyrirtökutíma hefur verið send',
      description:
        'Notaður sem titill fyrir "tilkynning um fyrirtökutíma hefur verið send" tilkynningagluggan á fyrirtöku skrefi í rannsóknarheimildum.',
    },
    text: {
      id: 'judicial.system:investigation_cases.hearing_arrangements.modal.text',
      defaultMessage:
        'Tilkynning um fyrirtöku hefur verið send á saksóknara. Hafi {defenderTypeNomative} verið skráður og báðir aðilar boðaðir í fyrirtöku hefur tilkynning auk þess verið send á {defenderTypeAccusative}',
      description:
        'Notaður sem texti í "tilkynning um fyrirtökutíma hefur verið send" tilkynningaglugganum á fyrirtöku skrefi í rannsóknarheimildum.',
    },
  }),
}
