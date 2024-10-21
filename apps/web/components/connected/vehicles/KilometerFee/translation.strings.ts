import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  perYear: {
    id: 'web.kilometerFee:perYear',
    defaultMessage: 'á ári',
    description: 'á ári',
  },
  perMonth: {
    id: 'web.kilometerFee:perMonth',
    defaultMessage: 'á mánuði',
    description: 'á mánuði',
  },
  perDay: {
    id: 'web.kilometerFee:perDay',
    defaultMessage: 'á dag',
    description: 'á dag',
  },
  energySource: {
    id: 'web.kilometerFee:energySource',
    defaultMessage: 'Orkugjafi ökutækis',
    description: 'Label fyrir orkugjafa ökutækis valkost',
  },
  electric: {
    id: 'web.kilometerFee:electric',
    defaultMessage: 'Rafmagn',
    description: 'Rafmagn',
  },
  hydrogen: {
    id: 'web.kilometerFee:hydrogen',
    defaultMessage: 'Vetni',
    description: 'Vetni',
  },
  hybrid: {
    id: 'web.kilometerFee:hybrid',
    defaultMessage: 'Tengiltvinn',
    description: 'Tengiltvinn',
  },
  kilometerInputLabel: {
    id: 'web.kilometerFee:kilometerInputLabel',
    defaultMessage: 'Áætlaður akstur í kílómetrum',
    description: 'Label fyrir áætlaðan akstur í kílómetrum',
  },
  kilometerInputPlaceholder: {
    id: 'web.kilometerFee:kilometerInputPlaceholder',
    defaultMessage: 'km',
    description: 'Placeholder fyrir kílómetra input reit',
  },
  calculate: {
    id: 'web.kilometerFee:calculate',
    defaultMessage: 'Reikna',
    description: 'Texti sem birtist á reikna takka',
  },
  resultPrefix: {
    id: 'web.kilometerFee:resultPrefix',
    defaultMessage: 'Áætlað kílómetragjald',
    description: 'Áætlað kílómetragjald',
  },
  resultPostfix: {
    id: 'web.kilometerFee:resultPostfix',
    defaultMessage: 'krónur á mánuði',
    description: 'krónur á mánuði',
  },
})
