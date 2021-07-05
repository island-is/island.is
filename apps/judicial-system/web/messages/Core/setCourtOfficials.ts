import { defineMessages } from 'react-intl'

// Strings for court officials
export const setCourtOfficials = {
  judge: defineMessages({
    tooltip: {
      id: 'judicial.system:component.set_court_officials.judge.tooltip',
      defaultMessage:
        'Dómarinn sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupóst. Eingöngu skráður dómari getur svo undirritað úrskurð.',
      description: 'setCourtOfficials component judge field: Tooltip',
    },
  }),
  registrar: defineMessages({
    tooltip: {
      id: 'judicial.system:component.set_court_officials.registrar.tooltip',
      defaultMessage:
        'Dómritari sem er valinn hér verður skráður á málið og mun fá tilkynningar sendar í tölvupósti.',
      description: 'setCourtOfficials component registrar field: Tooltip',
    },
  }),
}
