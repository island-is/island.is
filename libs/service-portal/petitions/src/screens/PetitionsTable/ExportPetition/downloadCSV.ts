import CSVStringify from 'csv-stringify'
import {
  PaginatedEndorsementResponse,
  Endorsement,
} from '@island.is/api/schema'
import { formatDate } from '../../../lib/utils'

export const getCSV = async (
  signers: PaginatedEndorsementResponse,
  fileName: string,
) => {
  const name = `${fileName}`
  const dataArray = signers.data.map((item: Endorsement) => [
    formatDate(item.created) ?? '',
    item.meta.fullName ?? '',
    item.meta.locality ?? '',
  ])

  await downloadCSV(name, ['Dagsetning', 'Nafn', 'Sveitarfélag'], dataArray)
}

export const downloadCSV = async (
  name: string,
  header: string[],
  data: Array<Array<string | number>>,
) => {
  const csvData = [header, ...data]
  CSVStringify(csvData, (err, output) => {
    const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${output}`)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', name)
    document.body.appendChild(link)

    link.click()
  })
}
