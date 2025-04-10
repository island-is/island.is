import { FileType } from './workMachines.types'

export const mapFileTypeToLabel = (fileType: FileType) => {
  if (fileType === FileType.CSV) {
    return 'csv'
  } else return 'excel'
}
