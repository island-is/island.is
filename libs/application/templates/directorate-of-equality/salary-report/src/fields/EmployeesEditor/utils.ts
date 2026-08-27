import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import type { FormatMessage } from '@island.is/localization'
import { SALARY_COMPONENT_KEYS } from '../../utils/constants'
import type { Employee, SalaryComponentKey } from '../../utils/types'
import { messages } from '../../lib/messages'

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
  paidHours: string
  baseSalary: string
} & Record<SalaryComponentKey, string>

export const EMPTY_EMPLOYEE_FORM_VALUES: EmployeeFormValues = {
  roleTitle: '',
  gender: '',
  field: '',
  department: '',
  startDate: '',
  paidHours: '',
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
  paidHours: paidHoursToFormValue(employee.paidHours),
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

// Greiddar stundir is an absolute count of hours, not a percentage — there is
// deliberately no scaling in either direction here. The old workRatio field
// stored a fraction and multiplied by 100 for display; carrying that over would
// turn 173,33 hours into 17.333.
export const paidHoursToFormValue = (hours?: number | null): string =>
  hours == null ? '' : String(hours)

// Accepts '173,33' as well as '173.33': type="number" on an is-IS locale can
// hand back a comma, and Number('173,33') is NaN — which would submit 0 hours
// and silently inflate tímakaup instead of failing.
export const paidHoursFromFormValue = (value: string): number => {
  const parsed = Number(String(value).replace(',', '.'))
  // DECIMAL(6,2) on the API side.
  return Number.isFinite(parsed) ? Math.round(parsed * 100) / 100 : 0
}

export const formatPaidHours = (hours?: number | null): string =>
  hours == null
    ? ''
    : `${hours.toLocaleString('is-IS', { maximumFractionDigits: 2 })} klst.`

// Reglulegt tímakaup, not a monthly figure — these run two orders of magnitude
// smaller than the salary fields formatCurrency is used for.
export const formatHourlyWage = (value?: number | null): string =>
  `${(value ?? 0).toLocaleString('is-IS', {
    maximumFractionDigits: 0,
  })} kr./klst.`

export const formatStartDate = (value?: string): string => {
  if (!value) return ''
  try {
    return format(parseISO(value), 'd.M.yyyy')
  } catch {
    return value
  }
}
