import { getValueViaPath, YES } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { ExemptionForTransportationAnswers } from '../..'

export const shouldUseSameValuesForTrailer = (
  answers: FormValue,
  trailerIndex: number,
): boolean => {
  const axleSpacing = getValueViaPath<
    ExemptionForTransportationAnswers['axleSpacing']
  >(answers, 'axleSpacing')

  return (
    axleSpacing?.trailerList?.[trailerIndex]?.useSameValues?.includes(YES) ||
    false
  )
}
