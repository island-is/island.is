import { isDefined } from '@island.is/shared/utils'
import XLSX from 'xlsx'

export interface MileageRecord {
  vehicleId: string
  mileage: number
}

const letters =
  'aábcdðeéfghiíjklmnoópqrstuúvwxyýzþæöAÁBCDÐEÉFGHIÍJKLMNOÓPQRSTUÚVWXYÝZÞÆÖ'
const newlines = '\\r\\n\\r|\\n'
const wordbreaks = '[;,]'

const vehicleIndexTitle = [
  'permno',
  'vehicleid',
  'bilnumer',
  'okutaeki',
  'fastanumer',
]
const mileageIndexTitle = ['kilometrastada', 'mileage', 'odometer']

export const parseFileToMileageRecord = async (
  file: File,
  type: 'csv' | 'xlsx',
): Promise<Array<MileageRecord>> => {
  const parsedLines: Array<Array<string>> = await (type === 'csv'
    ? parseCsv(file)
    : parseXlsx(file))

  const [header, ...values] = parsedLines
  const vehicleIndex = header.findIndex((l) =>
    vehicleIndexTitle.includes(l.toLowerCase()),
  )
  if (vehicleIndex < 0) {
    throw new Error(
      `Invalid vehicle column header. Must be one of the following: ${vehicleIndexTitle.join(
        ', ',
      )}`,
    )
  }
  const mileageIndex = header.findIndex((l) =>
    mileageIndexTitle.includes(l.toLowerCase()),
  )

  if (mileageIndex < 0) {
    throw new Error(
      `Invalid mileage column header. Must be one of the following: ${mileageIndexTitle.join(
        ', ',
      )}`,
    )
  }

  const uploadedOdometerStatuses: Array<MileageRecord> = values
    .map((row) => {
      const mileage = Number(row[mileageIndex])
      if (Number.isNaN(mileage)) {
        return undefined
      }
      return {
        vehicleId: row[vehicleIndex],
        mileage,
      }
    })
    .filter(isDefined)
  return uploadedOdometerStatuses
}

const parseCsv = async (file: File) => {
  const reader = file.stream().getReader()
  const decoder = new TextDecoder('utf-8')

  let parsedLines: Array<Array<string>> = [[]]

  let accumulatedChunk = ''
  let done = false

  while (!done) {
    const res = await reader.read()
    done = res.done
    if (!done) {
      accumulatedChunk += decoder.decode(res.value)
    }
  }

  parsedLines = parseCsvString(accumulatedChunk)

  return parsedLines
}

const parseXlsx = async (file: File) => {
  try {
    //FIRST SHEET ONLY
    const buffer = await file.arrayBuffer()
    const parsedFile = XLSX.read(buffer, { type: 'buffer' })

    const jsonData = XLSX.utils.sheet_to_csv(
      parsedFile.Sheets[parsedFile.SheetNames[0]],
    )

    return parseCsvString(jsonData)
  } catch (e) {
    throw new Error('Failed to parse XLSX file: ' + e.message)
  }
}

const parseCsvString = (chunk: string) => {
  const parsedLines: Array<Array<string>> = [[]]
  let rowIndex = 0
  for (const cell of chunk.matchAll(
    new RegExp(`([${letters}\\d]+)(${newlines}|${wordbreaks})?`, 'gi'),
  )) {
    const [_, trimmedValue, delimiter] = cell
    const lineBreak = ['\r\n', '\n', '\r'].includes(delimiter)

    parsedLines[rowIndex].push(trimmedValue.trim())
    if (lineBreak) {
      parsedLines.push([])
      rowIndex++
    }
  }

  return parsedLines
}
