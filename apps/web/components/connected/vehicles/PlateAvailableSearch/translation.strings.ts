import { defineMessages } from 'react-intl'

export const translation = defineMessages({
  aboveText: {
    id: 'web.plateAvailableSearch:aboveText',
    defaultMessage: 'Hér má athuga hvort tiltekið einkanúmer sé laust',
    description: 'Texti sem birtist fyrir ofan',
  },
  inputPlaceholder: {
    id: 'web.plateAvailableSearch:inputPlaceholder',
    defaultMessage: 'Leita að einkanúmeri',
    description: 'Placeholder texti fyrir leit',
  },
  errorOccurredTitle: {
    id: 'web.plateAvailableSearch:errorOccurredTitle',
    defaultMessage: 'Villa kom upp',
    description: 'Titill á villuskilaboðum þegar villa kemur upp',
  },
  errorOccurredMessage: {
    id: 'web.plateAvailableSearch:errorOccurredMessage',
    defaultMessage: 'Ekki tókst að upplýsingar um einkanúmer',
    description: 'Skilboð sem birtast þegar villa kemur upp',
  },
  attention: {
    id: 'web.plateAvailableSearch:attention',
    defaultMessage: 'Athugið:',
    description: 'Athugið',
  },
  regnoValidationText: {
    id: 'web.plateAvailableSearch:regnoValidationText',
    defaultMessage:
      'Einkanúmer mega vera 2-6 íslenskir stafir eða tölur, og eitt bil að auki, en mega ekki líkjast venjulegum skráningarnúmerum.',
    description:
      'Skilaboð sem birtast þegar einkanúmer leit er ekki með rétt validation',
  },
  plateAvailableText: {
    id: 'web.plateAvailableSearch:plateAvailableText',
    defaultMessage: 'Merkið {PLATE_NUMBER} er laust',
    description: 'Texti sem birtist þegar merkið er laust',
  },
  plateUnavailableText: {
    id: 'web.plateAvailableSearch:plateUnavailableText',
    defaultMessage:
      'Merkið {PLATE_NUMBER} er í notkun og ekki laust til úthlutunar',
    description: 'Texti sem birtist þegar merkið er ekki laust til úthlutunar',
  },
})
