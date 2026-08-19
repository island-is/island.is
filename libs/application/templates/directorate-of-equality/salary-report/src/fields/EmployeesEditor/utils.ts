import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import type { FormatMessage } from '@island.is/localization'
import { SALARY_COMPONENT_KEYS } from '../../utils/constants'
import type { Employee, SalaryComponentKey } from '../../utils/types'
import { messages } from '../../lib/messages'
import { TABLE_PAGE_SIZE } from '../TablePagination'

// Roles are id-keyed now, so sorting by title needs this lookup.
export const byRoleTitle =
  (roleTitleById: Record<string, string>) => (a: Employee, b: Employee) =>
    (roleTitleById[a.roleId] ?? '').localeCompare(
      roleTitleById[b.roleId] ?? '',
      'is',
    )

// Which page an employee lands on once the table re-sorts by role title.
// `useFieldArray` doesn't refresh `fields` synchronously after append/update,
// so callers hand us the list as it will be and we sort it ourselves rather
// than waiting a render to find out where the row went.
export const pageOfEmployee = (
  employees: Employee[],
  employee: Employee,
  roleTitleById: Record<string, string>,
): number => {
  const position = [...employees]
    .sort(byRoleTitle(roleTitleById))
    .findIndex((e) => e === employee)

  if (position < 0) return 1

  return Math.floor(position / TABLE_PAGE_SIZE) + 1
}

// Resolves a free-text role title to an existing role id, or mints a new one.
export const findOrCreateRoleId = (
  title: string,
  roles: { id: string; title: string }[],
): { id: string; isNew: boolean } => {
  const existing = roles.find(
    (r) => r.title.trim().toLowerCase() === title.trim().toLowerCase(),
  )
  if (existing) return { id: existing.id, isNew: false }
  return { id: crypto.randomUUID(), isNew: true }
}

export type EmployeeFormValues = {
  // Free text; resolved to a role id by the caller (see findOrCreateRoleId).
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
// employee and to build the components back up on submit. `roleTitle` is
// resolved from roleId via the roles lookup.
export const toFormValues = (
  employee: Employee,
  roleTitleById: Record<string, string>,
): EmployeeFormValues => ({
  roleTitle: roleTitleById[employee.roleId] ?? '',
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

// Shared between EmployeeForm (editing) and EmployeeRow (display).
export const getSalaryComponentLabels = (
  formatMessage: FormatMessage,
): Record<SalaryComponentKey, string> => {
  const m = messages.report.employees
  return {
    additionalFixedOvertime: formatMessage(m.additionalFixedOvertimeLabel),
    additionalFixedCarAllowance: formatMessage(
      m.additionalFixedCarAllowanceLabel,
    ),
    bonusOccasionalCarAllowance: formatMessage(
      m.bonusOccasionalCarAllowanceLabel,
    ),
    bonusOccasionalOvertime: formatMessage(m.bonusOccasionalOvertimeLabel),
    bonusPayments: formatMessage(m.bonusPaymentsLabel),
    bonusOther: formatMessage(m.bonusOtherLabel),
  }
}

export const formatCurrency = (value?: number | null): string =>
  `${(value ?? 0).toLocaleString('is-IS')} kr.`

export const formatWorkRatio = (ratio?: number | null): string =>
  `${Math.round((ratio ?? 0) * 100)}%`

export const formatStartDate = (value?: string): string => {
  if (!value) return ''
  try {
    return format(parseISO(value), 'd.M.yyyy')
  } catch {
    return value
  }
}
