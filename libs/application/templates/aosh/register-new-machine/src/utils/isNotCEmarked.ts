import { getValueViaPath } from '@island.is/application/core'
import { FormValue, NO, YES } from '@island.is/application/types'

export const isNotCEmarked = (answers: FormValue) => {
  const markedCE = getValueViaPath(
    answers,
    'machine.basicInformation.markedCE',
    YES,
  ) as typeof NO | typeof YES

  return markedCE === NO
}
