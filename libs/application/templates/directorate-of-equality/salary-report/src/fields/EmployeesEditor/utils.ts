import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import { SALARY_COMPONENT_KEYS } from '../../utils/constants'
import type { Employee, SalaryComponentKey } from '../../utils/types'

export type EmployeeFormValues = {
  roleTitle: string
  gender: string
  field: string
  department: string
  startDate: string
  workRatio: string
  baseSalary: string
} & Record<SalaryComponentKey, string>

export const EMPTY_EMPLOYEE_FORM_VALUES: EmployeeFormValues = {
  roleTitle: '',
  gender: '',
  field: '',
  department: '',
  startDate: '',
  workRatio: '100',
  baseSalary: '',
  ...(Object.fromEntries(
    SALARY_COMPONENT_KEYS.map((key) => [key, '']),
  ) as Record<SalaryComponentKey, string>),
}

// The single place that maps between the salary-component keys and their
// form/DTO representations — used both to populate the form from an existing
// employee and to build the components back up on submit.
export const toFormValues = (employee: Employee): EmployeeFormValues => ({
  roleTitle: employee.roleTitle,
  gender: employee.gender,
  field: employee.field ?? '',
  department: employee.department ?? '',
  startDate: employee.startDate,
  workRatio: String((employee.workRatio ?? 0) * 100),
  baseSalary: String(employee.baseSalary ?? ''),
  ...(Object.fromEntries(
    SALARY_COMPONENT_KEYS.map((key) => {
      const value = employee[key]
      return [key, value == null ? '' : String(value)]
    }),
  ) as Record<SalaryComponentKey, string>),
})

// Empty component → null (the API treats each component as optional/nullable)
export const componentsFromFormValues = (
  data: EmployeeFormValues,
): Record<SalaryComponentKey, number | null> =>
  Object.fromEntries(
    SALARY_COMPONENT_KEYS.map((key) => [
      key,
      data[key] === '' ? null : Number(data[key]) || 0,
    ]),
  ) as Record<SalaryComponentKey, number | null>

export const formatCurrency = (value?: number | null): string =>
  `${(value ?? 0).toLocaleString('is-IS')} kr.`

export const formatWorkRatio = (ratio?: number | null): string =>
  `${Math.round((ratio ?? 0) * 100)}%`

// The server masks each employee's national id with a per-application code
// like "DTH-008" (shared prefix + ordinal). There's no separate code field in
// the parsed report, so we derive the prefix from the existing employees'
// identifiers. Falls back to "AAA" when there are none to derive from.
export const deriveIdentifierPrefix = (
  employees: { identifier?: string }[],
): string => {
  for (const e of employees) {
    const match = e.identifier?.match(/^(.*?)(\d+)$/)
    if (match) return match[1]
  }
  return 'AAA'
}

// Masked identifier for manually-added employees (the real national id is
// never collected), using the same prefix as the imported employees.
export const computeIdentifier = (prefix: string, ordinal: number): string =>
  `${prefix}${String(ordinal).padStart(3, '0')}`

export const formatStartDate = (value?: string): string => {
  if (!value) return ''
  try {
    return format(parseISO(value), 'd.M.yyyy')
  } catch {
    return value
  }
}
