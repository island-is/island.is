import { downloadFile } from '@island.is/service-portal/core'
import { generalHeaders } from './dataHeaders'
import { DocumentsListItemTypes } from '../components/DocumentScreen/DocumentScreen.types'

export const exportGeneralDocuments = async (
  data: DocumentsListItemTypes[],
  fileName: string,
  type: 'xlsx' | 'csv',
) => {
  const name = `${fileName}_sundurlidun`
  const dataArray = data.map((item: DocumentsListItemTypes) => [
    item.date ?? '',
    item.type ?? '',
    item.sender ?? '',
    item.amount ?? '',
    item.note ?? '',
    fileName,
  ])

  await downloadFile(name, generalHeaders, dataArray, type)
}
