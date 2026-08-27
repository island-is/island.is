import type { ReportEmployeeDto } from './types'
import {
  buildPayComponentsBreakdown,
  hasNoPayComponents,
} from './payComponents'

const employee = (
  gender: ReportEmployeeDto['gender'],
  additionalSalary: number,
  bonusSalary: number,
  ordinal = 1,
): ReportEmployeeDto => ({
  id: String(ordinal),
  ordinal,
  startDate: '2026-01-01',
  paidHours: 173.33,
  baseSalary: 700000,
  additionalSalary,
  bonusSalary,
  gender,
  reportEmployeeRoleId: 'role-1',
  reportId: 'report-1',
})

describe('buildPayComponentsBreakdown', () => {
  it('bundles neutral employees with the female cohort', () => {
    const result = buildPayComponentsBreakdown([
      employee('MALE', 100, 20, 1),
      employee('FEMALE', 60, 10, 2),
      employee('NEUTRAL', 80, 30, 3),
    ])

    expect(result.male).toMatchObject({
      averageAdditionalSalary: 100,
      averageBonusSalary: 20,
      averageTotal: 120,
      count: 1,
    })
    expect(result.female).toMatchObject({
      averageAdditionalSalary: 70,
      averageBonusSalary: 20,
      averageTotal: 90,
      count: 2,
    })
    expect(result.additionalWageGapPercent).toBe(30)
    expect(result.bonusWageGapPercent).toBe(0)
    expect(result.totalWageGapPercent).toBe(25)
  })

  it('returns dashes-driving null gaps when one cohort is missing', () => {
    const result = buildPayComponentsBreakdown([
      employee('FEMALE', 10000, 5000, 1),
    ])

    expect(result.male.count).toBe(0)
    expect(result.female.count).toBe(1)
    expect(result.additionalWageGapPercent).toBeNull()
    expect(result.bonusWageGapPercent).toBeNull()
    expect(result.totalWageGapPercent).toBeNull()
  })

  it('returns null component gaps when the male denominator is zero', () => {
    const result = buildPayComponentsBreakdown([
      employee('MALE', 0, 0, 1),
      employee('FEMALE', 10000, 5000, 2),
    ])

    expect(result.male.averageAdditionalSalary).toBe(0)
    expect(result.male.averageBonusSalary).toBe(0)
    expect(result.male.averageTotal).toBe(0)
    expect(result.additionalWageGapPercent).toBeNull()
    expect(result.bonusWageGapPercent).toBeNull()
    expect(result.totalWageGapPercent).toBeNull()
  })

  it('detects the empty component state without treating an empty employee list as recorded zeros', () => {
    expect(
      hasNoPayComponents(
        buildPayComponentsBreakdown([
          employee('MALE', 0, 0, 1),
          employee('FEMALE', 0, 0, 2),
        ]),
      ),
    ).toBe(true)
    expect(hasNoPayComponents(buildPayComponentsBreakdown([]))).toBe(false)
  })
})
