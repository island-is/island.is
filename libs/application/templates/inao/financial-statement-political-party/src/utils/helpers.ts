import { Config } from '../types/types'
import subYears from 'date-fns/subYears'
import getYear from 'date-fns/getYear'
import { TOTAL } from '../../../shared/utils/constants'

export const getConfigInfoForKey = (config: Config[], configKey: string) => {
  return config?.filter((config: Config) => config.key === configKey)[0].value
}

export const possibleOperatingYears = (
  yearLimit: string,
  countYearBackwardsFrom: string,
) => {
  const countFromYear = new Date(countYearBackwardsFrom)
  const backwardsYearLimit = Number(yearLimit)
  const operationYears = Array(backwardsYearLimit)
    .fill('')
    .map((_, index) => {
      const dateDiff = subYears(countFromYear, index)
      const yearsFromNow = getYear(dateDiff).toString()
      return { label: yearsFromNow, value: yearsFromNow }
    })
  return operationYears
}

export const getTotal = (values: Record<string, string>, key: string) => {
  if (!values[key]) {
    return 0
  }
  const total = Object.entries(values[key])
    .filter(([k, v]) => k !== TOTAL && !isNaN(Number(v)))
    .map(([_k, v]) => Number(v))
    .reduce((prev, current) => {
      return (prev += current)
    }, 0)
  return total
}

export const formatNumber = (num: number) => num.toLocaleString('de-DE')

export const checkIfNegative = (inputNumber: string) => Number(inputNumber) >= 0
