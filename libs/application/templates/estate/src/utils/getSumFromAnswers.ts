import { getValueViaPath } from '@island.is/application/core'
import { Application, RecordObject } from '@island.is/application/types'
import { formatCurrency } from '@island.is/application/ui-components'

export const getSumFromAnswers = <T = unknown>(
  answers: Application['answers'],
  path: string,
  field: string,
  fn?: (item: T) => boolean,
): string | null => {
  let arr: T[] = getValueViaPath(answers, path) ?? []

  if (Array.isArray(arr)) {
    if (fn) {
      arr = arr.filter(fn)
    }

    const value = arr.reduce((acc, cur) => {
      const val = (getValueViaPath(cur as RecordObject, field) as number) ?? 0
      return acc + Number(val)
    }, 0)

    if (value && value > 0) {
      return formatCurrency(String(value))
    }
  }

  return ''
}
