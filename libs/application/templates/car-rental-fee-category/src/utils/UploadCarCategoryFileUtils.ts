import XLSX from 'xlsx'
import { parse } from 'csv-parse'
import { RateCategory } from './constants'
import { CarCategoryError, CarCategoryRecord, CarMap } from './types'
import { is30DaysOrMoreFromDate } from './dayRateUtils'

const sanitizeNumber = (n: string) => n.replace(new RegExp(/[.,]/g), '')

export const parseFileToCarCategory = async (
    file: File,
    type: 'csv' | 'xlsx',
    rateToChangeTo: RateCategory,
    currentCarData: CarMap,
  ): Promise<Array<CarCategoryRecord> | Array<CarCategoryError>> => {
    const parsedLines: Array<Array<string>> = await (type === 'csv'
      ? parseCsv(file)
      : parseXlsx(file))
  
    const carNumberIndex = 0
    const prevMilageIndex = 2
    const currMilageIndex = 3
    const rateCategoryIndex = 4
  
    const [_, ...values] = parsedLines
  
    const data: Array<CarCategoryRecord | CarCategoryError | undefined> =
      values.map((row) => {
        const carNr = row[carNumberIndex]
        const prevMileStr = row[prevMilageIndex]?.trim()
        const currMileStr = row[currMilageIndex]?.trim()
        if (!currentCarData[carNr]) {
          return {
            code: 1,
            message: 'Þessi bíll fannst ekki í lista af þínum bílum!',
            carNr,
          }
        }
  
        // Changing from Dayrate
        if (rateToChangeTo === RateCategory.KMRATE) {
          const validFromDate = currentCarData[carNr].activeDayRate?.validFrom
          if (validFromDate) {
            const is30orMoreDays = is30DaysOrMoreFromDate(validFromDate)
  
            if (!is30orMoreDays) {
              return {
                code: 1,
                message:
                  'Bílar þurfa að vera skráið á daggjald í amk 30 daga áður en hægt er að breyta til baka!',
                carNr,
              }
            }
          }
        }
  
        if (!prevMileStr && currMileStr) {
          return {
            code: 1,
            message: 'Síðasta staða bíls þarf að vera til staðar!',
            carNr,
          }
        }
  
        // Skip rows where either mileage value is empty or undefined
        if (!prevMileStr || !currMileStr) return undefined
  
        const prevMile = Number(sanitizeNumber(prevMileStr))
        const currMile = Number(sanitizeNumber(currMileStr))
  
        // Skip rows where either mileage value is not a valid number
        if (Number.isNaN(prevMile) || Number.isNaN(currMile)) return undefined
  
        if (prevMile > currMile) {
          return {
            code: 1,
            message: 'Nýja staða má ekki vera lægri en síðasta staða!',
            carNr,
          }
        }
  
        const category = row[rateCategoryIndex]
        if (!category) return undefined
        // need to check if the category is the same thing as what we should pass into this function
        if (
          category.toLowerCase() !== RateCategory.DAYRATE.toLowerCase() &&
          category.toLowerCase() !== RateCategory.KMRATE.toLowerCase()
        ) {
          return {
            code: 1,
            message:
              'Ógildur gjaldflokkur, vinsamlegast passið uppá stafsetningu (Daggjald eða Kilometragjald)',
            carNr,
          }
        }
  
        if (category.toLowerCase() !== rateToChangeTo.toLowerCase()) {
          return {
            code: 1,
            message: `Ógildur gjaldflokkur, þú valdir að breyta gjaldflokki í ${rateToChangeTo}`,
            carNr,
          }
        }
  
        return {
          vehicleId: carNr,
          oldMileage: prevMile,
          newMilage: currMile,
          rateCategory: category,
        }
      })
  
    // Filter out undefined values first
    const filteredData = data.filter(
      (x): x is CarCategoryRecord | CarCategoryError => x !== undefined,
    )
  
    const errors = filteredData.filter(
      (item): item is CarCategoryError => 'code' in item,
    )
  
    if(errors.length > 0) return errors
  
    // If no errors, return only the CarCategoryRecords
    return filteredData.filter(
      (item): item is CarCategoryRecord => 'vehicleId' in item,
    )
}
  
export const parseCsv = async (file: File) => {
    const reader = file.stream().getReader()
    const decoder = new TextDecoder('utf-8')
  
    let accumulatedChunk = ''
    let done = false
  
    while (!done) {
      const res = await reader.read()
      done = res.done
      if (!done) {
        accumulatedChunk += decoder.decode(res.value)
      }
    }
    return parseCsvString(accumulatedChunk)
}
  
const parseXlsx = async (file: File) => {
    try {
      //FIRST SHEET ONLY
      const buffer = await file.arrayBuffer()
      const parsedFile = XLSX.read(buffer, { type: 'buffer' })
  
      const jsonData = XLSX.utils.sheet_to_csv(
        parsedFile.Sheets[parsedFile.SheetNames[0]],
        {
          blankrows: false,
        },
      )
  
      return parseCsvString(jsonData)
    } catch (e) {
      throw new Error('Failed to parse XLSX file: ' + e.message)
    }
}
  
export const parseCsvString = (chunk: string): Promise<string[][]> => {
    return new Promise((resolve, reject) => {
      const records: string[][] = []
  
      const parser = parse({
        delimiter: [';', ','],
        skipRecordsWithEmptyValues: true,
        trim: true,
      })
  
      parser.on('readable', () => {
        let record: Array<string>
        while ((record = parser.read()) !== null) {
          records.push(record)
        }
      })
  
      parser.on('error', (err) => {
        reject(err)
      })
  
      parser.on('end', () => {
        resolve(records)
      })
  
      parser.write(chunk)
      parser.end()
    })
}
  
export const createErrorExcel = async (
    file: File,
    type: 'csv' | 'xlsx',
    errors: CarCategoryError[],
) => {
    const parsedLines: Array<Array<string>> = await (type === 'csv'
      ? parseCsv(file)
      : parseXlsx(file))
  
    const [header, ...values] = parsedLines
  
    // Add error message column to header
    const newHeader = [...header, 'Villa']
  
    // Create a map of error messages by car number
    const errorMap = new Map(errors.map((error) => [error.carNr, error.message]))
  
    // Add error messages to rows and mark error rows
    const processedRows = values.map((row) => {
      const carNr = row[0]
      const errorMessage = errorMap.get(carNr)
      return {
        row,
        hasError: !!errorMessage,
        errorMessage: errorMessage || '',
      }
    })
  
    // Sort rows: errors first, then others
    const sortedRows = processedRows.sort((a, b) => {
      if (a.hasError && !b.hasError) return -1
      if (!a.hasError && b.hasError) return 1
      return 0
    })
  
    // Create workbook
    const wb = XLSX.utils.book_new()
  
    // Convert rows to worksheet format
    const wsData = [
      newHeader,
      ...sortedRows.map(({ row, errorMessage }) => [...row, errorMessage]),
    ]
  
    const ws = XLSX.utils.aoa_to_sheet(wsData)
  
    // Add red background to error rows
    const range = XLSX.utils.decode_range(ws['!ref'] || 'A1')
    for (let R = 1; R <= range.e.r; R++) {
      const rowHasError = sortedRows[R - 1]?.hasError
      if (rowHasError) {
        for (let C = 0; C <= range.e.c; C++) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C })
          if (!ws[cellRef]) continue
  
          ws[cellRef].s = {
            ...ws[cellRef].s,
            fill: { fgColor: { rgb: 'FFFF0000' } },
            font: { color: { rgb: 'FFFFFFFF' } },
          }
        }
      }
    }
  
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  
    // Generate new file
    const newFile = XLSX.write(wb, { type: 'base64', bookType: 'xlsx' })
    return newFile
}

export const downloadFile = (
    name: string,
    base64Content: string,
    mimeType: string,
) => {
    const blob = base64ToBlob(base64Content, mimeType)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = name
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
}
  
export const base64ToBlob = (base64: string, mimeType: string) => {
    const buffer = Buffer.from(base64, 'base64')
    return new Blob([buffer], { type: mimeType })
}
