import { isDefined } from '@island.is/shared/utils'

export interface MileageRecord {
  vehicleId: string
  mileage: number
}

const letters =
  'aábcdðeéfghiíjklmnoópqrstuúvwxyýzþæöAÁBCDÐEÉFGHIÍJKLMNOÓPQRSTUÚVWXYÝZÞÆÖ'
const newlines = '\\Q\\r\\n\\E|\\r|\\n'
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
): Promise<Array<MileageRecord> | string> => {
  const reader = file.stream().getReader()

  const parsedLines: Array<Array<string>> = [[]]
  const parseChunk = async (res: ReadableStreamReadResult<Uint8Array>) => {
    if (res.done) {
      return
    }
    const chunk = Buffer.from(res.value).toString('utf8')

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
  }

  await reader.read().then(parseChunk)
  const [header, ...values] = parsedLines
  const vehicleIndex = header.findIndex((l) =>
    vehicleIndexTitle.includes(l.toLowerCase()),
  )
  if (vehicleIndex < 0) {
    return `Invalid vehicle column header. Must be one of the following: ${vehicleIndexTitle.join(
      ', ',
    )}`
  }
  const mileageIndex = header.findIndex((l) =>
    mileageIndexTitle.includes(l.toLowerCase()),
  )

  if (mileageIndex < 0) {
    return `Invalid mileage column header. Must be one of the following: ${mileageIndexTitle.join(
      ', ',
    )}`
  }

  const uploadedOdometerStatuses: Array<MileageRecord> = values
    .map((row) => {
      const mileage = parseInt(row[mileageIndex])
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
