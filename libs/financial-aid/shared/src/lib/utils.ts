import { months } from './const'

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

export const sanitizeNationalId = (nationalId: string) =>
  nationalId.replace(/[^0-9]/g, '')

export const isEmailValid = (emailAddress?: string) => {
  if (emailAddress) {
    let re = /\S+@\S+\.\S+/
    return re.test(emailAddress)
  }
  return
}

export const focusOnNextInput = (
  event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  nextInputId: string,
) => {
  if (event.target.value.length >= event.target.maxLength) {
    const el = document.getElementById(nextInputId)
    el?.focus()
  }
}
