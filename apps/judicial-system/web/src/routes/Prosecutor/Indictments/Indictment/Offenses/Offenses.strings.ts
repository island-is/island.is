import { IndictmentCountOffense } from '@island.is/judicial-system-web/src/graphql/schema'

export const strings = {
  incidentTitle: 'Brot',
  incidentLabel: 'Brot',
  incidentPlaceholder: 'Veldu brot',
  bloodAlcoholContentTitle: 'Vínandamagn',
  bloodAlcoholContentLabel: 'Vínandamagn (‰)',
  bloodAlcoholContentPlaceholder: '0,00',
  offenseText: {
    [IndictmentCountOffense.DRIVING_WITHOUT_LICENCE]: 'Sviptingarakstur',
    [IndictmentCountOffense.DRIVING_WITHOUT_VALID_LICENSE]:
      'Akstur án gildra ökuréttinda',
    [IndictmentCountOffense.DRIVING_WITHOUT_EVER_HAVING_LICENSE]:
      'Akstur án þess að hafa öðlast ökuréttindi',
    [IndictmentCountOffense.DRUNK_DRIVING]: 'Ölvunarakstur',
    [IndictmentCountOffense.ILLEGAL_DRUGS_DRIVING]: 'Fíkniefnaakstur',
    [IndictmentCountOffense.PRESCRIPTION_DRUGS_DRIVING]: 'Lyfjaakstur',
    [IndictmentCountOffense.SPEEDING]: 'Hraðakstur',
    [IndictmentCountOffense.OTHER]: 'Annað',
  },
}
