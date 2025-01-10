import { months, monthsEnglish } from './const'

import React from 'react'
import { DirectTaxPayment, NationalRegistryData } from './interfaces'
import { StaffRole, UserType } from './enums'
import { Locale } from '@island.is/shared/types'
import differenceInYears from 'date-fns/differenceInYears'
import differenceInMinutes from 'date-fns/differenceInMinutes'
import differenceInHours from 'date-fns/differenceInHours'
import differenceInDays from 'date-fns/differenceInDays'
import differenceInWeeks from 'date-fns/differenceInWeeks'

export const getFileType = (fileName: string) => {
  return fileName?.substring(fileName.lastIndexOf('.') + 1)
}
export const isImage = (filename: string): boolean => {
  const imagesFileExtensions = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp']

  const extension = filename.split('.').pop()?.toLowerCase() || ''

  return imagesFileExtensions.includes(extension)
}

export const encodeFilename = (filename: string) =>
  encodeURI(filename.replace(/ +/g, '_'))

export const getFileSizeInKilo = (file: { size?: number }) => {
  return Math.floor(file.size ? file.size / 1000 : 0)
}

export const firstDateOfMonth = () => {
  const date = new Date()

  return new Date(date.getFullYear(), date.getMonth(), 1)
}

export const currentMonth = (lang: Locale = 'is') => {
  if (lang === 'is') {
    return months[new Date().getMonth()].toLowerCase()
  }
  return monthsEnglish[new Date().getMonth()]
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

export const isNationalIdValid = (nationalId: string): boolean => {
  return (
    sanitizeOnlyNumbers(nationalId).length === 10 &&
    isNaN(Number(sanitizeOnlyNumbers(nationalId))) === false
  )
}

export const sanitizeOnlyNumbers = (value: string) =>
  value?.replace(/[^0-9]/g, '')

export const isEmailValid = (emailAddress?: string) => {
  if (emailAddress) {
    const emailRegex =
      /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
    return emailRegex.test(emailAddress)
  }
  return false
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

export const formatHomeAddress = (
  nationalRegistryData?: NationalRegistryData,
) =>
  nationalRegistryData
    ? `${nationalRegistryData.address.streetName}, ${nationalRegistryData.address.postalCode} ${nationalRegistryData.address.city}`
    : undefined

export const staffRoleDescription = (roles: StaffRole[]) => {
  return roles.map((r) => getRoleName(r)).join(', ')
}

export const getRoleName = (role: StaffRole) => {
  switch (role) {
    case StaffRole.ADMIN:
      return 'Stjórnandi'
    case StaffRole.EMPLOYEE:
      return 'Vinnsluaðili'
    case StaffRole.SUPERADMIN:
      return 'Umsjónaraðili'
  }
}

export const scrollToId = (id: string) => {
  const element = document.getElementById(id)
  element?.scrollIntoView({
    behavior: 'smooth',
  })
}

export const capitalizeFirstLetter = (text: string) => {
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export const addUserTypeDirectPayments = (
  userType: UserType,
  directTaxPayments?: DirectTaxPayment[],
) => {
  if (!directTaxPayments) {
    return []
  }
  return directTaxPayments.map((el) => {
    return {
      ...el,
      userType,
    }
  })
}

export const truncateString = (str: string, maxLength: number) => {
  if (str.length > maxLength) {
    return `${str.substring(0, maxLength)}...`
  }
  return str
}

export const calcAge = (ssn: string) => {
  const year = ssn.substring(4, 6)
  const significant = ssn.substring(9, 10)

  const birthDay = new Date(
    Number(`${Number(significant) < 8 ? '2' : '1'}${significant}${year}`),
    Number(ssn.substring(2, 4)) - 1,
    Number(ssn.substring(0, 2)),
  )

  return differenceInYears(new Date(), birthDay)
}

export const isPluralInIcelandic = (value: number): boolean =>
  value % 10 !== 1 || value % 100 === 11

export const calcDifferenceInDate = (dateCreated: string | undefined) => {
  if (dateCreated) {
    const minutes = differenceInMinutes(new Date(), new Date(dateCreated))
    const hours = differenceInHours(new Date(), new Date(dateCreated))
    const days = differenceInDays(new Date(), new Date(dateCreated))
    const weeks = differenceInWeeks(new Date(), new Date(dateCreated))

    if (minutes < 1) {
      return `Rétt í þessu`
    }
    if (minutes < 60) {
      return `${minutes} min`
    }

    if (hours < 24) {
      return `${hours} klst`
    }

    if (days < 7) {
      return `${days} ${isPluralInIcelandic(days) ? 'dagar' : 'dagur'}`
    }

    return `${weeks} ${isPluralInIcelandic(weeks) ? 'vikur' : 'vika'}`
  }
}
