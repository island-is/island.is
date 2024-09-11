import { isDefined } from '@island.is/shared/utils'

export interface MileageRecord {
  vehicleId: string
  mileage: number
}

const letters =
  'aábcdðeéfghiíjklmnoópqrstuúvwxyýzþæöAÁBCDÐEÉFGHIÍJKLMNOÓPQRSTUÚVWXYÝZÞÆÖ'
const newlines = '\\Q\\r\\n\\E|\\r|\\n'
const wordbreaks = '[;,]'

export const parseCsvToMileageRecord = async (file: File) => {
  const reader = file.stream().getReader()

  const parsedLines: Array<Array<string>> = [[]]
  const parseChunk = async (res: ReadableStreamReadResult<Uint8Array>) => {
    if (res.done) {
      return
    }

    const chunk = Buffer.from(res.value).toString('utf8')

    let colIndex = 0
    let rowIndex = 0

    for (const cell of chunk.matchAll(
      new RegExp(`([${letters}\\d]+)(${newlines}|${wordbreaks})?`, 'gi'),
    )) {
      const [rawString, trimmedValue, delimiter] = cell
      const lineBreak = ['\r\n', '\n', '\r'].includes(delimiter)

      parsedLines[rowIndex].push(trimmedValue)
      if (lineBreak) {
        parsedLines.push([])
        rowIndex++
        colIndex = 0
      } else {
        colIndex++
      }
    }
  }
  await reader.read().then(parseChunk)

  const vehicleIndex = parsedLines[0].findIndex(
    (l) => l === 'ökutæki' || l === 'Ökutæki',
  )

  const [header, ...values] = parsedLines
  const uploadedOdometerStatuses: Array<MileageRecord> = values
    .map((row) => {
      const mileage = parseInt(row[1 - vehicleIndex])
      if (Number.isNaN(mileage)) {
        return
      }
      return {
        vehicleId: row[vehicleIndex],
        mileage,
      }
    })
    .filter(isDefined)
  return uploadedOdometerStatuses
}
