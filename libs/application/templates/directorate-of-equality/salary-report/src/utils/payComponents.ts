import type { ReportEmployeeDto } from './types'

export type PayComponentGenderBreakdown = {
  averageBonusSalary: number
  averageAdditionalSalary: number
  averageTotal: number
  count: number
}

export type PayComponentsBreakdown = {
  male: PayComponentGenderBreakdown
  female: PayComponentGenderBreakdown
  overall: PayComponentGenderBreakdown
  bonusWageGapPercent: number | null
  additionalWageGapPercent: number | null
  totalWageGapPercent: number | null
}

const emptyBreakdown: PayComponentGenderBreakdown = {
  averageBonusSalary: 0,
  averageAdditionalSalary: 0,
  averageTotal: 0,
  count: 0,
}

const round = (value: number, precision = 0): number => {
  const factor = 10 ** precision
  return Math.round(value * factor) / factor
}

const average = (
  employees: ReportEmployeeDto[],
  selector: (employee: ReportEmployeeDto) => number | null | undefined,
): number =>
  employees.length === 0
    ? 0
    : round(
        employees.reduce(
          (sum, employee) => sum + (selector(employee) ?? 0),
          0,
        ) / employees.length,
      )

const breakdownFor = (
  employees: ReportEmployeeDto[],
): PayComponentGenderBreakdown => {
  if (employees.length === 0) return { ...emptyBreakdown }

  const averageBonusSalary = average(employees, (employee) =>
    Number(employee.bonusSalary ?? 0),
  )
  const averageAdditionalSalary = average(employees, (employee) =>
    Number(employee.additionalSalary ?? 0),
  )

  return {
    averageBonusSalary,
    averageAdditionalSalary,
    averageTotal: average(
      employees,
      (employee) =>
        Number(employee.bonusSalary ?? 0) +
        Number(employee.additionalSalary ?? 0),
    ),
    count: employees.length,
  }
}

const wageGapPercent = (
  maleAverage: number,
  femaleAverage: number,
): number | null =>
  maleAverage === 0
    ? null
    : round(((maleAverage - femaleAverage) / maleAverage) * 100, 1)

export const buildPayComponentsBreakdown = (
  employees: ReportEmployeeDto[],
): PayComponentsBreakdown => {
  const men = employees.filter((employee) => employee.gender === 'MALE')
  const womenAndNeutral = employees.filter(
    (employee) => employee.gender !== 'MALE',
  )

  const male = breakdownFor(men)
  const female = breakdownFor(womenAndNeutral)
  const overall = breakdownFor(employees)

  return {
    male,
    female,
    overall,
    bonusWageGapPercent:
      male.count === 0 || female.count === 0
        ? null
        : wageGapPercent(male.averageBonusSalary, female.averageBonusSalary),
    additionalWageGapPercent:
      male.count === 0 || female.count === 0
        ? null
        : wageGapPercent(
            male.averageAdditionalSalary,
            female.averageAdditionalSalary,
          ),
    totalWageGapPercent:
      male.count === 0 || female.count === 0
        ? null
        : wageGapPercent(male.averageTotal, female.averageTotal),
  }
}

export const hasNoPayComponents = (data: PayComponentsBreakdown): boolean =>
  data.overall.averageTotal === 0 && data.overall.count > 0
