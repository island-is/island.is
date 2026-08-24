import {
  formatDate,
  formatNationalId,
} from '@island.is/judicial-system/formatters'
import type { User } from '@island.is/judicial-system-web/src/graphql/schema'
import { userRoleToString } from '@island.is/judicial-system-web/src/routes/Admin/userRoleToString'

export const USERS_CSV_FILENAME = 'notendur.csv'

const yesNo = (value?: boolean | null): string => (value ? 'Já' : 'Nei')

const FORMULA_PREFIX_PATTERN = /^[=+\-@]/

const escapeCsvValue = (value: string): string => {
  const sanitized = FORMULA_PREFIX_PATTERN.test(value) ? `'${value}` : value

  if (
    sanitized.includes('"') ||
    sanitized.includes(',') ||
    sanitized.includes('\n') ||
    sanitized.includes('\r')
  ) {
    return `"${sanitized.replace(/"/g, '""')}"`
  }

  return sanitized
}

type Column = {
  header: string
  value: (user: User) => string
}

const COLUMNS: Column[] = [
  { header: 'Nafn', value: (user) => user.name ?? '' },
  { header: 'Netfang', value: (user) => user.email ?? '' },
  { header: 'Sími', value: (user) => user.mobileNumber ?? '' },
  {
    header: 'Kennitala',
    value: (user) => formatNationalId(user.nationalId),
  },
  { header: 'Hlutverk', value: (user) => userRoleToString(user.role) },
  { header: 'Stofnun', value: (user) => user.institution?.name ?? '' },
  { header: 'Virkur', value: (user) => yesNo(user.active) },
  {
    header: 'Getur staðfest ákærur',
    value: (user) => yesNo(user.canConfirmIndictment),
  },
  {
    header: 'Síðasta innskráning',
    value: (user) =>
      user.latestLogin
        ? formatDate(user.latestLogin, 'dd.MM.yyyy HH:mm') ?? ''
        : '',
  },
  {
    header: 'Fjöldi innskráninga',
    value: (user) =>
      user.loginCount === null || user.loginCount === undefined
        ? ''
        : String(user.loginCount),
  },
]

export const usersToCsv = (users: User[]): string => {
  const header = COLUMNS.map((column) => column.header).join(',')
  const rows = users.map((user) =>
    COLUMNS.map((column) => escapeCsvValue(column.value(user))).join(','),
  )

  return `\uFEFF${[header, ...rows].join('\n')}`
}

export const downloadUsersCsv = (users: User[]): void => {
  if (users.length === 0) {
    return
  }

  const blob = new Blob([usersToCsv(users)], {
    type: 'text/csv;charset=utf-8;',
  })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')

  link.href = url
  link.setAttribute('download', USERS_CSV_FILENAME)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}
