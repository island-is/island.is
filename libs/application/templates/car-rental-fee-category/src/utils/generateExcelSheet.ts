import XLSX from 'xlsx'
import { RateCategory } from './constants'
import { CarMap } from './types'
import { Locale } from '@island.is/shared/types'

export const generateExcelSheet = (
  vehicleRateMap: CarMap,
  rateToChangeTo: RateCategory,
  locale: Locale
): {
  filename: string
  base64Content: string
  fileType: string
} => {
  const islandicHeaders = ['Bílnúmer', 'Síðasta staða', 'Núverandi staða']
  const englishHeaders = ['Vehicle number', 'Last mileage', 'Current mileage']
  const sheetData = [
    locale === 'is' ? islandicHeaders : englishHeaders,
    ...Object.entries(vehicleRateMap)
      .filter(([_, data]) => data.category !== rateToChangeTo)
      .map(([permno, data]) => [
        permno,
        data.milage,
        '',
      ]),
  ]

  const icelandicPrefix = 'skra-bila-a-'
  const englishPrefix = 'register-cars-to-'
  const name = `${locale === 'is' ? icelandicPrefix : englishPrefix}${rateToChangeTo.toLowerCase()}.xlsx`
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
