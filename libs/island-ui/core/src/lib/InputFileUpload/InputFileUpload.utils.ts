import { UploadFile, UploadFileStatus } from './InputFileUpload.types'

export const fileToObject = (
  file: File,
  status?: UploadFileStatus,
): UploadFile => {
  return {
    name: file.name,
    percent: 0,
    originalFileObj: file,
    url: '',
    status: status || 'done',
  }
}
