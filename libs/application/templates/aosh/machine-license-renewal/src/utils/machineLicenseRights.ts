import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'
import {
  WorkMachineLicenseDto,
  WorkMachineRightDto,
} from '@island.is/clients/seminars-ver'
import { dateFormat } from '@island.is/shared/constants'
import { Locale } from '@island.is/shared/types'

export const formatDate = (date: string, locale: Locale) => {
  const parsedDate = parseISO(date)
  return isValid(parsedDate) ? format(parsedDate, dateFormat[locale]) : ''
}

export const formatRightName = (right: WorkMachineRightDto, locale: Locale) => {
  const name =
    locale === 'en'
      ? right.categoryNameEn?.trim() || right.categoryName
      : right.categoryName

  return [right.category, name].filter(Boolean).join(' - ')
}

const getRenewableCategories = (workMachineLicense?: WorkMachineLicenseDto) =>
  new Set(
    (workMachineLicense?.workMachineRightsRenewedDtos ?? []).map(
      (right) => right.category,
    ),
  )

export const getRenewableRights = (
  workMachineLicense?: WorkMachineLicenseDto,
) => {
  const renewableCategories = getRenewableCategories(workMachineLicense)
  return (workMachineLicense?.workMachineRightsDtos ?? []).filter((right) =>
    renewableCategories.has(right.category),
  )
}

export const getOtherRights = (workMachineLicense?: WorkMachineLicenseDto) => {
  const renewableCategories = getRenewableCategories(workMachineLicense)
  return (workMachineLicense?.workMachineRightsDtos ?? []).filter(
    (right) => !renewableCategories.has(right.category),
  )
}

const validUntilLabel: Record<Locale, string> = {
  is: 'gildir nú til',
  en: 'valid until',
}

export const formatRenewedRights = (
  workMachineLicense: WorkMachineLicenseDto | undefined,
  locale: Locale,
) =>
  (workMachineLicense?.workMachineRightsRenewedDtos ?? [])
    .map((right) => {
      const name = formatRightName(right, locale)
      const validUntil = right.validUntil
        ? formatDate(right.validUntil, locale)
        : ''
      return validUntil
        ? `${name} (${validUntilLabel[locale]} ${validUntil})`
        : name
    })
    .join(', ')
