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
  console.log(header)
  console.log(values)
  const vehicleIndex = header.findIndex((l) => l.toLowerCase() === 'ökutæki')
  const mileageIndex = header.findIndex(
    (l) => l.toLowerCase() === 'kílómetraskráning',
  )
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
