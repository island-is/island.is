import XLSX from 'xlsx'
import { RateCategory } from './constants'
import { CarMap } from './types'

export const generateExcelSheet = (vehicleRateMap: CarMap, rateToChangeTo: RateCategory): { 
    filename: string, 
    base64Content: string, 
    fileType: string
} => {
    const sheetData = [
      ['Bílnúmer', 'Tegund', 'Síðasta staða', 'Núverandi staða', 'Gjaldflokkur'],
      ...Object.entries(vehicleRateMap)
        .filter(([_, data]) => data.category !== rateToChangeTo)
        .map(([permno, data]) => [
          permno,
          data.make,
          data.milage,
          '',
          data.category
        ])
    ]

    const name = 'bilar.xlsx'
    const worksheet: XLSX.WorkSheet = XLSX.utils.aoa_to_sheet(sheetData)
    const workbook: XLSX.WorkBook = {
        Sheets: { 'Sheet1': worksheet },
        SheetNames: ['Sheet1'],
    }

    const excelBuffer = XLSX.write(workbook, {
        bookType: 'xlsx',
        type: 'base64',
    })
    return {
        filename: name,
        base64Content: excelBuffer,
        fileType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    }
}
