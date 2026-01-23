import XLSX from 'xlsx'
import { CarMap } from './types'

export const generateExcelSheet = (
  vehicleRateMap: CarMap,
): {
  filename: string
  base64Content: string
  fileType: string
} => {
  const now = new Date()
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthIndex = lastMonthDate.getMonth().toString()
  const lastMonthName = lastMonthDate.toLocaleString('is-IS', { month: 'long' })
  const sheetData = [
    ['Bílnúmer', `Dagar á daggjaldi í ${lastMonthName}`, 'Notaðir dagar'],
    ...Object.entries(vehicleRateMap)
      .map(([permno, data]) => [
        permno,
        '', //data.activeDayRate?.periodUsage?.find((period) => period.period === lastMonthIndex)?.numberOfDays,
        '',
      ]),
  ]

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
