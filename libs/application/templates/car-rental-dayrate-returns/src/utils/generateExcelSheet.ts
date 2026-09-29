import XLSX from 'xlsx'
import { FormatMessage } from '@island.is/application/types'
import { DayRateRecord } from './types'
import { Locale } from '@island.is/shared/types'
import { m } from '../lib/messages'

export const generateExcelSheet = (
  dayRateRecords: DayRateRecord[],
  locale: Locale,
  formatMessage: FormatMessage,
): {
  filename: string
  base64Content: string
  fileType: string
} => {
  const now = new Date()
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthName = lastMonthDate
    .toLocaleString(locale === 'en' ? 'en-US' : 'is-IS', { month: 'short' })
    .replace(/\.$/, '')

  const headers = [
    formatMessage(m.tableView.tableHeaderPermno),
    formatMessage(m.tableView.tableHeaderTotalDays),
    formatMessage(m.tableView.tableHeaderUsedDays),
  ]

  const rows = dayRateRecords.map((record) => [
    record.permno,
    record.prevPeriodTotalDays,
    '',
  ])

  const sheetData = [headers, ...rows]

  const name = `${lastMonthDate.getFullYear()}_${lastMonthName.toLowerCase()}_skilagrein_daggjalds_utleigudagar.xlsx`
  const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData)
  const workbook: XLSX.WorkBook = {
    Sheets: { Sheet1: worksheet },
    SheetNames: ['Sheet1'],
  }

  const excelBuffer = XLSX.write(workbook, {
    bookType: 'xlsx',
    type: 'base64',
  })
  return {
    filename: name,
    base64Content: excelBuffer,
    fileType:
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  }
}
