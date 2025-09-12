import { isDefined } from '@island.is/shared/utils'
import XLSX from 'xlsx'
import { parse } from 'csv-parse'

export interface MileageRecord {
  permno: string
  mileage: number
}

export interface MileageError {
  code: 1 | 2
  message: string
}

const vehicleIndexTitle = [
  'permno',
  'vehicleid',
  'bilnumer',
  'okutaeki',
  'fastanumer',
]
const mileageIndexTitle = ['kilometrastada', 'mileage', 'odometer']

export const errorMap: Record<number, string> = {
  1: `Invalid vehicle column header. Must be one of the following: ${vehicleIndexTitle.join(
    ', ',
  )}`,
  2: `Invalid mileage column header. Must be one of the following: ${mileageIndexTitle.join(
    ', ',
  )}`,
}

export const parseBufferToMileageRecord = async (
  buffer: Buffer,
  type: 'csv' | 'xlsx',
): Promise<Array<MileageRecord> | MileageError> => {
  const parsedLines: Array<Array<string>> = await (type === 'csv'
    ? parseCsvFromBuffer(buffer)
    : parseXlsxFromBuffer(buffer))

  const [rawHeader, ...values] = parsedLines

  // strip BOM, trim, and lowercase each header cell
  const header = rawHeader.map((h) =>
    h
      .replace(/^\uFEFF/, '')
      .trim()
      .toLowerCase(),
  )

  const vehicleIndex = header.findIndex((h) => vehicleIndexTitle.includes(h))

  if (vehicleIndex < 0) {
    return {
      code: 1,
      message: errorMap[1],
    }
  }

  const mileageIndex = header.findIndex((l) =>
    mileageIndexTitle.includes(l.toLowerCase()),
  )

  if (mileageIndex < 0) {
    return {
      code: 2,
      message: errorMap[2],
    }
  }

  const filteredValues = values.filter((row) => {
    const mileageValue = row[mileageIndex]
    const sanitizedMileage = sanitizeNumber(mileageValue || '')
    const numericMileage = Number(sanitizedMileage)

    // Keep row if mileage is not NaN, not 0, and not empty
    return (
      !Number.isNaN(numericMileage) &&
      numericMileage > 0 &&
      mileageValue?.trim() !== ''
    )
  })

  const uploadedOdometerStatuses: Array<MileageRecord> = filteredValues
    .map((row) => {
      const mileage = Number(sanitizeNumber(row[mileageIndex]))
      if (Number.isNaN(mileage)) {
        return undefined
      }
      return {
        permno: row[vehicleIndex],
        mileage: mileage,
      }
    })
    .filter(isDefined)

  return uploadedOdometerStatuses
}

const parseCsvFromBuffer = async (
  buffer: Buffer,
): Promise<Array<Array<string>>> => {
  const content = buffer.toString('utf-8')
  return parseCsvString(content)
}

const parseXlsxFromBuffer = async (
  buffer: Buffer,
): Promise<Array<Array<string>>> => {
  try {
    // FIRST SHEET ONLY
    const parsedFile = XLSX.read(buffer, { type: 'buffer' })
    const sheetName = parsedFile.SheetNames[0]

    const jsonData = XLSX.utils.sheet_to_csv(parsedFile.Sheets[sheetName], {
      blankrows: false,
    })

    return parseCsvString(jsonData)
  } catch (e) {
    throw new Error('Failed to parse XLSX file: ' + e.message)
  }
}

const parseCsvString = (chunk: string): Promise<string[][]> => {
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

const sanitizeNumber = (n: string) => n.replace(new RegExp(/[.,]/g), '')

export const getFileTypeFromUrl = (url: string): 'csv' | 'xlsx' => {
  const extension = url.split('.').pop()?.toLowerCase()
  if (extension === 'xlsx' || extension === 'xls') {
    return 'xlsx'
  }
  return 'csv' // Default fallback
}
