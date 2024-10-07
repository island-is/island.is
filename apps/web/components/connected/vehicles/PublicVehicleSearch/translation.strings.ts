import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  inputPlaceholder: {
    id: 'web.publicVehicleSearch:inputPlaceholder',
    defaultMessage: 'Leita í ökutækjaskrá',
    description: 'Placeholder texti á leit',
  },
  noVehicleFound: {
    id: 'web.publicVehicleSearch:noVehicleFound',
    defaultMessage: 'Ekkert ökutæki fannst',
    description: 'Texti sem birtist þegar leit skilar engum niðurstöðum',
  },
  errorOccurredTitle: {
    id: 'web.publicVehicleSearch:errorOccurredTitle',
    defaultMessage: 'Villa kom upp',
    description: 'Titill á skilaboðum þegar villa kemur upp',
  },
  errorOccurredMessage: {
    id: 'web.publicVehicleSearch:errorOccurredMessage',
    defaultMessage: 'Ekki tókst að sækja ökutæki',
    description: 'Skilaboð þegar villa kemur upp',
  },
  vehicleInformationTableHeaderText: {
    id: 'web.publicVehicleSearch:vehicleInformationTableHeaderText',
    defaultMessage: 'Niðurstaða leitar:',
    description: 'Texti í töflu haus á niðurstöðum',
  },
  vehicleCommercialName: {
    id: 'web.publicVehicleSearch:vehicleCommercialName',
    defaultMessage: 'Tegund:',
    description: 'Tegund',
  },
  regno: {
    id: 'web.publicVehicleSearch:regno',
    defaultMessage: 'Skráningarnúmer:',
    description: 'Skráningarnúmer',
  },
  permno: {
    id: 'web.publicVehicleSearch:permno',
    defaultMessage: 'Fastanúmer:',
    description: 'Fastanúmer',
  },
  vin: {
    id: 'web.publicVehicleSearch:vin',
    defaultMessage: 'Verksmiðjunúmer:',
    description: 'Verksmiðjunúmer',
  },
  firstRegDate: {
    id: 'web.publicVehicleSearch:firstRegDate',
    defaultMessage: 'Fyrst skráð:',
    description: 'Fyrst skráð',
  },
  co2NEDC: {
    id: 'web.publicVehicleSearch:co2NEDC',
    defaultMessage: 'CO2-gildi (NEDC):',
    description: 'CO2-gildi (NEDC)',
  },
  weightedCo2NEDC: {
    id: 'web.publicVehicleSearch:weightedCo2NEDC',
    defaultMessage: 'Vegið CO2-gildi (NEDC):',
    description: 'Vegið CO2-gildi (NEDC)',
  },
  Co2WLTP: {
    id: 'web.publicVehicleSearch:Co2WLTP',
    defaultMessage: 'CO2-gildi (WLTP):',
    description: 'CO2-gildi (WLTP)',
  },
  weightedCo2WLTP: {
    id: 'web.publicVehicleSearch:weightedCo2WLTP',
    defaultMessage: 'Vegið CO2-gildi (WLTP):',
    description: 'Vegið CO2-gildi (WLTP)',
  },
  mass: {
    id: 'web.publicVehicleSearch:mass',
    defaultMessage: 'Eigin þyngd:',
    description: 'Eigin þyngd',
  },
  massLaden: {
    id: 'web.publicVehicleSearch:massLaden',
    defaultMessage: 'Leyfð heildarþyngd:',
    description: 'Leyfð heildarþyngd',
  },
  vehicleStatus: {
    id: 'web.publicVehicleSearch:vehicleStatus',
    defaultMessage: 'Staða:',
    description: 'Staða',
  },
  nextVehicleMainInspection: {
    id: 'web.publicVehicleSearch:nextVehicleMainInspection',
    defaultMessage: 'Næsta skoðun:',
    description: 'Næsta skoðun',
  },
})
