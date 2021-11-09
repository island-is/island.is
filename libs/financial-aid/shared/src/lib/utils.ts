import { months } from './const'

import React from 'react'
import { NationalRegistryData } from './interfaces'
import { StaffRole } from './enums'

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
    const emailRegex = /^[\w!#$%&'*+/=?`{|}~^-]+(?:\.[\w!#$%&'*+/=?`{|}~^-]+)*@(?:[A-Z0-9-]+\.)+[A-Z]{2,6}$/i
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
  var element = document.getElementById(id)
  element?.scrollIntoView({
    behavior: 'smooth',
  })
}
