import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  errorOccurred: {
    id: 'web.newKilometerFee:errorOccurred',
    defaultMessage: 'Ekki tókst að reikna gjald',
    description: 'Ekki tókst að reikna gjald',
  },
  environmentalResultPrefix: {
    id: 'web.newKilometerFee:environmentalResultPrefix',
    defaultMessage: 'Áætlað kílómetragjald fyrir vistvæn ökutæki',
    description: 'Áætlað kílómetragjald fyrir vistvæn ökutæki',
  },
  noVehicleFound: {
    id: 'web.newKilometerFee:noVehicleFound',
    defaultMessage: 'Ekkert ökutæki fannst',
    description: 'Ekkert ökutæki fannst',
  },
  vehicleWeightClassNotFound: {
    id: 'web.newKilometerFee:vehicleWeightClassNotFound',
    defaultMessage:
      'Ekki tókst að finna hvaða þyngarflokk þitt ökutæki tilheyrir',
    description: 'Ekki tókst að finna hvaða þyngarflokk þitt ökutæki tilheyrir',
  },
  massLadenExplanation: {
    id: 'web.newKilometerFee:massLadenExplanation',
    defaultMessage: 'Leyfð heildarþyngd fyrir {plateNumber} er {massLaden} kg',
    description: 'Leyfð heildarþyngd fyrir {plateNumber} er {massLaden} kg',
  },
  plateNumberLabel: {
    id: 'web.newKilometerFee:plateNumberLabel',
    defaultMessage: 'Bílnúmer',
    description: '',
  },
  perYear: {
    id: 'web.newKilometerFee:perYear',
    defaultMessage: 'á ári',
    description: 'á ári',
  },
  perMonth: {
    id: 'web.newKilometerFee:perMonth',
    defaultMessage: 'á mánuði',
    description: 'á mánuði',
  },
  perDay: {
    id: 'web.newKilometerFee:perDay',
    defaultMessage: 'á dag',
    description: 'á dag',
  },
  kilometerInputLabel: {
    id: 'web.newKilometerFee:kilometerInputLabel',
    defaultMessage: 'Áætlaður akstur í kílómetrum',
    description: 'Label fyrir áætlaðan akstur í kílómetrum',
  },
  kilometerInputPlaceholder: {
    id: 'web.newKilometerFee:kilometerInputPlaceholder',
    defaultMessage: 'km',
    description: 'Placeholder fyrir kílómetra input reit',
  },
  calculate: {
    id: 'web.newKilometerFee:calculate',
    defaultMessage: 'Reikna',
    description: 'Texti sem birtist á reikna takka',
  },
  resultPrefix: {
    id: 'web.newKilometerFee:resultPrefix',
    defaultMessage: 'Áætlað kílómetragjald',
    description: 'Áætlað kílómetragjald',
  },
  resultPostfix: {
    id: 'web.newKilometerFee:resultPostfix',
    defaultMessage: 'krónur á mánuði',
    description: 'krónur á mánuði',
  },
})
