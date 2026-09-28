import { getValueViaPath } from '@island.is/application/core'

export const isCasualWork = (answers: Record<string, unknown>) =>
  getValueViaPath<string[]>(answers, 'typeOfIncome')?.includes('casualWork') ??
  false

export const isPartTime = (answers: Record<string, unknown>) =>
  getValueViaPath<string[]>(answers, 'typeOfIncome')?.includes('partTime') ??
  false

export const isContractWork = (answers: Record<string, unknown>) =>
  getValueViaPath<string[]>(answers, 'typeOfIncome')?.includes(
    'contractWork',
  ) ?? false

export const isCapitalIncome = (answers: Record<string, unknown>) =>
  getValueViaPath<string[]>(answers, 'typeOfIncome')?.includes(
    'capitalIncome',
  ) ?? false

export const isPension = (answers: Record<string, unknown>) =>
  getValueViaPath<string[]>(answers, 'typeOfIncome')?.includes('pension') ??
  false

export const isSocialInsurance = (answers: Record<string, unknown>) =>
  getValueViaPath<string[]>(answers, 'typeOfIncome')?.includes(
    'socialInsurance',
  ) ?? false

type CasualWorkEntry = {
  company?: { nationalId?: string }
  dateFrom?: string
  dateTo?: string
}

export const hasCasualWorkOverlap = (answers: Record<string, unknown>) => {
  const entries =
    getValueViaPath<CasualWorkEntry[]>(answers, 'registerCasualWork') ?? []
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i]
      const b = entries[j]
      const aId = a?.company?.nationalId
      const bId = b?.company?.nationalId
      if (!aId || !bId || aId !== bId) continue
      const aFrom = a.dateFrom ? Date.parse(a.dateFrom) : NaN
      const aTo = a.dateTo ? Date.parse(a.dateTo) : NaN
      const bFrom = b.dateFrom ? Date.parse(b.dateFrom) : NaN
      const bTo = b.dateTo ? Date.parse(b.dateTo) : NaN
      if (
        Number.isNaN(aFrom) ||
        Number.isNaN(aTo) ||
        Number.isNaN(bFrom) ||
        Number.isNaN(bTo)
      )
        continue
      if (aFrom <= bTo && bFrom <= aTo) return true
    }
  }
  return false
}

type PartTimeEntry = {
  company?: { nationalId?: string }
  jobStart?: string
  jobEnd?: string
}

export const hasPartTimeOverlap = (answers: Record<string, unknown>) => {
  const entries =
    getValueViaPath<PartTimeEntry[]>(answers, 'registerPartTime') ?? []
  for (let i = 0; i < entries.length; i++) {
    for (let j = i + 1; j < entries.length; j++) {
      const a = entries[i]
      const b = entries[j]
      const aId = a?.company?.nationalId
      const bId = b?.company?.nationalId
      if (!aId || !bId || aId !== bId) continue
      const aFrom = a.jobStart ? Date.parse(a.jobStart) : NaN
      const bFrom = b.jobStart ? Date.parse(b.jobStart) : NaN
      if (Number.isNaN(aFrom) || Number.isNaN(bFrom)) continue
      // Missing jobEnd is treated as an open-ended (infinite) period.
      const aTo = a.jobEnd ? Date.parse(a.jobEnd) : Number.POSITIVE_INFINITY
      const bTo = b.jobEnd ? Date.parse(b.jobEnd) : Number.POSITIVE_INFINITY
      if (Number.isNaN(aTo) || Number.isNaN(bTo)) continue
      if (aFrom <= bTo && bFrom <= aTo) return true
    }
  }
  return false
}
