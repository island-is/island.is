import { months } from './const'
import { UploadFile } from '@island.is/island-ui/core'

export const getFileType = (fileName: string) => {
  return fileName?.substring(fileName.lastIndexOf('.') + 1)
}

export const getFileSizeInKilo = (file: { size?: number }) => {
  return Math.floor(file.size ? file.size / 1000 : 0)
}

export const currentMonth = () => {
  return months[new Date().getMonth()].toLowerCase()
}

export const insertAt = (str: string, sub: string, pos: number) =>
  `${str.slice(0, pos)}${sub}${str.slice(pos)}`

export const formatPhoneNumber = (phoneNumber: string) => {
  if (phoneNumber.length <= 10) {
    return insertAt(phoneNumber.replace('-', ''), '-', 3) || '-'
  }

  return insertAt(phoneNumber.replace('-', ''), '-', 4) || '-'
}

export const formatNationalId = (nationalId: string) =>
  insertAt(nationalId.replace('-', ''), '-', 6) || '-'

export const stringifyFile = (file: UploadFile) => {
  return {
    key: file.key,
    name: file.name,
    size: file.size,
    status: file.status,
    percent: file?.percent,
  }
}
