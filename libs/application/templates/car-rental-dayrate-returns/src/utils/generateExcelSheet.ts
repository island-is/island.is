import XLSX from 'xlsx'
import { DayRateRecord } from './types'
import { Locale } from '@island.is/shared/types'

export const generateExcelSheet = (
  dayRateRecords: DayRateRecord[],
  locale: Locale,
): {
  filename: string
  base64Content: string
  fileType: string
} => {
  const now = new Date()
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthName = lastMonthDate
    .toLocaleString('is-IS', { month: 'short' })
    .replace(/\.$/, '')

  const icelandicHeaders = [
    'Bílnúmer',
    `Dagar á daggjaldi í ${lastMonthName}`,
    'Notaðir dagar',
  ]
  const englishHeaders = [
    'Vehicle number',
    `Days on day rate in ${lastMonthName}`,
    'Used days',
  ]
  const headers = locale === 'is' ? icelandicHeaders : englishHeaders

  const rows = dayRateRecords.map((record) => [
    record.permno,
    record.prevPeriodTotalDays,
    '',
  ])

  const sheetData = [headers, ...rows]

  const name = `${lastMonthDate.getFullYear()}_${lastMonthName.toLowerCase()}_daggjalds_notkun.xlsx`
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
