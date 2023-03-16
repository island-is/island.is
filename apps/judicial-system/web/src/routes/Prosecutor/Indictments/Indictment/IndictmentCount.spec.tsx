import { IndictmentCountOffense as offense } from '@island.is/judicial-system-web/src/graphql/schema'
import { Substance, SubstanceMap } from '@island.is/judicial-system/types'

import { getRelevantSubstances } from './IndictmentCount'

describe('getRelevantSubstances', () => {
  test('should return relevant substances in the correct order for the indictment description', () => {
    const offenses = [
      offense.DrunkDriving,
      offense.IllegalDrugsDriving,
      offense.PrescriptionDrugsDriving,
    ]
    const substances: SubstanceMap = {
      [Substance.AMPHETAMINE]: '10',
      [Substance.MORPHINE]: '30',
      [Substance.ETIZOLAM]: '0.5',
      [Substance.ALCOHOL]: '1.10',
    }

    const result = getRelevantSubstances(offenses, substances)

    expect(result).toEqual([
      ['ALCOHOL', '1.10'],
      ['AMPHETAMINE', '10'],
      ['ETIZOLAM', '0.5'],
      ['MORPHINE', '30'],
    ])
  })
})
