import XLSX from 'xlsx'
import { parse } from 'csv-parse'
import { CarCategoryError, CarMap } from './types'

export const parseFileToCarDayRateUsage = async (
  file: File,
  type: 'csv' | 'xlsx',
  currentCarData: CarMap,
): Promise<Array<{ vehicleId: string; dayRateUsage: string }>> => {
  const parsedLines: Array<Array<string>> = await (type === 'csv'
    ? parseCsv(file)
    : parseXlsx(file))

  const carNumberIndex = 0
  const dayRateAmountIndex = 1
  const dayRateUsageIndex = 2

  const [_, ...values] = parsedLines

  const data: Array<{ vehicleId: string; dayRateAmount: string; dayRateUsage: string }> =
    values.map((row) => {
      return {
        vehicleId: row[carNumberIndex],
        dayRateAmount: row[dayRateAmountIndex],
        dayRateUsage: row[dayRateUsageIndex],
      }
    })

  return data
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
  const binary = atob(base64)
  const len = binary.length
  const bytes = new Uint8Array(len)
  for (let i = 0; i < len; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return new Blob([bytes], { type: mimeType })
}
