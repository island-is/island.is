import { UploadFile } from './InputFileUpload.types'

export const fileToObject = (file: File): UploadFile => {
  return {
    name: file.name,
    percent: 0,
    originalFileObj: file,
  }
}
