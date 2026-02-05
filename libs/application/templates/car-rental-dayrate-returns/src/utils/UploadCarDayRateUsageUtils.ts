import XLSX from 'xlsx'
import { parse } from 'csv-parse'
import {
  CarUsageError,
  CarUsageRecord,
  DayRateEntryMap,
  DayRateRecord,
} from './types'
import { m } from '../lib/messages'
import { MessageDescriptor } from 'react-intl'
import {
  DayRateEntryModel,
  EntryModel,
} from '@island.is/clients-rental-day-rate'

const sanitizeNumber = (n: string) => n.replace(new RegExp(/[.,]/g), '')

export type UploadFileType = 'csv' | 'xlsx'

type FileBytes = ArrayBuffer | ArrayBufferView

const toUint8Array = (file: FileBytes): Uint8Array => {
  if (file instanceof ArrayBuffer) {
    return new Uint8Array(file)
  }
  return new Uint8Array(file.buffer, file.byteOffset, file.byteLength)
}

const decodeUtf8 = (file: FileBytes): string => {
  const bytes = toUint8Array(file)
  if (typeof TextDecoder !== 'undefined') {
    return new TextDecoder('utf-8').decode(bytes)
  }
  if (typeof Buffer !== 'undefined') {
    return Buffer.from(bytes).toString('utf-8')
  }
  throw new Error('No UTF-8 decoder available')
}

export const parseFileToCarDayRateUsage = async (
  file: FileBytes,
  type: UploadFileType,
  dayRateRecords: Map<string, DayRateRecord>,
): Promise<Array<CarUsageRecord> | Array<CarUsageError>> => {
  const parsedLines: Array<Array<string>> = await (type === 'csv'
    ? parseCsv(file)
    : parseXlsx(file))

  const carNumberIndex = 0
  const prevPeriodTotalDaysIndex = 1
  const prevPeriodUsageIndex = 2

  const [_, ...values] = parsedLines

  const data: Array<CarUsageRecord | CarUsageError | undefined> = values.map(
    (row) => {
      const carNr = row[carNumberIndex]
      const prevPeriodTotalDaysStr = row[prevPeriodTotalDaysIndex]?.trim()
      const prevPeriodUsageStr = row[prevPeriodUsageIndex]?.trim()
      if (!dayRateRecords.has(carNr)) {
        return {
          code: 1,
          message: m.multiUploadErrors.carNotFound,
          carNr,
        }
      }

      if (!prevPeriodTotalDaysStr && prevPeriodUsageStr) {
        return {
          code: 1,
          message: m.multiUploadErrors.previousPeriodUsageRequired,
          carNr,
        }
      }

      // Skip rows where either previous period total days or previous period usage is empty or undefined
      if (!prevPeriodTotalDaysStr || !prevPeriodUsageStr) return undefined

      const prevPeriodTotalDays = Number(sanitizeNumber(prevPeriodTotalDaysStr))
      const prevPeriodUsage = Number(sanitizeNumber(prevPeriodUsageStr))

      if (prevPeriodUsage > prevPeriodTotalDays) {
        return {
          code: 1,
          message:
            m.multiUploadErrors.prevPeriodUsageGreaterThanPrevPeriodTotalDays,
          carNr,
        }
      }

      return {
        vehicleId: carNr,
        prevPeriodTotalDays,
        prevPeriodUsage,
      }
    },
  )

  // Filter out undefined values first
  const filteredData = data.filter(
    (x): x is CarUsageRecord | CarUsageError => x !== undefined,
  )

  const errors = filteredData.filter(
    (item): item is CarUsageError => 'code' in item,
  )

  if (errors.length > 0) return errors

  // If no errors, return only the CarCategoryRecords
  return filteredData.filter(
    (item): item is CarUsageRecord => 'vehicleId' in item,
  )
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

export const parseCsv = async (file: FileBytes) => {
  return parseCsvString(decodeUtf8(file))
}

const parseXlsx = async (file: FileBytes) => {
  try {
    const parsedFile = XLSX.read(toUint8Array(file), { type: 'array' })

    const jsonData = XLSX.utils.sheet_to_csv(
      parsedFile.Sheets[parsedFile.SheetNames[0]],
      { blankrows: false },
    )

    return parseCsvString(jsonData)
  } catch (e) {
    throw new Error('Failed to parse XLSX file: ' + e.message)
  }
}

export const createErrorExcel = async (
  file: FileBytes,
  type: 'csv' | 'xlsx',
  errors: Map<string, string | MessageDescriptor>,
) => {
  const parsedLines: Array<Array<string>> = await (type === 'csv'
    ? parseCsv(file)
    : parseXlsx(file))

  const [header, ...values] = parsedLines

  // Add error message column to header
  const newHeader = [...header, 'Villa']

  // Add error messages to rows and mark error rows
  const processedRows = values.map((row) => {
    const carNr = row[0]
    const errorMessage = errors.get(carNr)
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

export type ParseUploadResult =
  | { ok: true; records: CarUsageRecord[] }
  | { ok: false; errors: CarUsageError[]; reason: 'errors' | 'no-data' }

export const buildDayRateEntryMap = (
  previousPeriodDayRateReturns: EntryModel[] | undefined,
): DayRateEntryMap => {
  if (!previousPeriodDayRateReturns?.length) return {}

  return previousPeriodDayRateReturns.reduce((acc, vehicle) => {
    if (!vehicle.permno || !vehicle.dayRateEntries) return acc

    acc[vehicle.permno] = vehicle.dayRateEntries

    return acc
  }, {} as DayRateEntryMap)
}

export const getUploadFileType = (
  nameOrMime: string,
): UploadFileType | null => {
  if (!nameOrMime) return null

  const lower = nameOrMime.toLowerCase()
  if (
    lower.endsWith('.csv') ||
    lower.includes('text/csv') ||
    lower.includes('application/csv')
  ) {
    return 'csv'
  }
  if (lower.endsWith('.xlsx') || lower.includes('spreadsheetml')) {
    return 'xlsx'
  }

  return null
}

export const parseUploadFile = async (
  file: ArrayBuffer | ArrayBufferView,
  type: UploadFileType,
  dayRateRecords: Map<string, DayRateRecord>,
): Promise<ParseUploadResult> => {
  const parsed = await parseFileToCarDayRateUsage(file, type, dayRateRecords)

  if (parsed.length === 0) {
    return { ok: false, errors: [], reason: 'no-data' }
  }

  if ('code' in parsed[0]) {
    return {
      ok: false,
      errors: parsed as CarUsageError[],
      reason: 'errors',
    }
  }

  return { ok: true, records: parsed as CarUsageRecord[] }
}

export type MonthTotalInput = {
  dayRateEntries: DayRateEntryModel[]
  targetYear: number
  targetMonthIndex: number // 0-11
}

export type MonthTotalResult = {
  totalDays: number
  entryId: number
}

export const getMonthTotalDayRateDays = ({
  dayRateEntries,
  targetYear,
  targetMonthIndex,
}: MonthTotalInput): MonthTotalResult | null => {
  const entries = dayRateEntries ?? []
  if (entries.length === 0) return null

  const targetFromUtc = new Date(Date.UTC(targetYear, targetMonthIndex, 1))
  const targetToUtc = new Date(Date.UTC(targetYear, targetMonthIndex + 1, 0))

  const targetEntry = entries.find((entry) => {
    if (!entry.validFrom) return false
    const entryValidFromUtc = new Date(entry.validFrom)
    const entryValidToUtc = entry.validTo
      ? new Date(entry.validTo)
      : targetToUtc

    return entryValidFromUtc <= targetToUtc && entryValidToUtc >= targetFromUtc
  })

  if (!targetEntry) return null

  // Check if there is an active period usage for the target month
  const hasPeriodUsage = targetEntry.periodUsage?.some((usage) => {
    return usage.period === `${targetYear}-${(targetMonthIndex + 1).toString().padStart(2, '0')}`
  })

  if (hasPeriodUsage) return null

  const entryValidFromUtc = targetEntry.validFrom
    ? new Date(targetEntry.validFrom)
    : targetFromUtc
  const entryValidToUtc = targetEntry.validTo
    ? new Date(targetEntry.validTo)
    : targetToUtc

  const start =
    entryValidFromUtc > targetFromUtc ? entryValidFromUtc : targetFromUtc
  const end = entryValidToUtc < targetToUtc ? entryValidToUtc : targetToUtc

  if (end < start) return null

  const days = Math.floor((end.getTime() - start.getTime()) / 86400000) + 1
  if (days <= 0) return null

  return { totalDays: days, entryId: targetEntry.id }
}
