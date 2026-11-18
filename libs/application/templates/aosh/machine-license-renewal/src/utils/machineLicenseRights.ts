import format from 'date-fns/format'
import isValid from 'date-fns/isValid'
import parseISO from 'date-fns/parseISO'
import {
  WorkMachineLicenseDto,
  WorkMachineRightDto,
} from '@island.is/clients/seminars-ver'
import { Locale } from '@island.is/shared/types'

export const formatDate = (date: string) => {
  const parsedDate = parseISO(date)
  return isValid(parsedDate) ? format(parsedDate, 'dd.MM.yyyy') : ''
}

export const formatRightName = (right: WorkMachineRightDto, locale: Locale) => {
  const name =
    locale === 'en'
      ? right.categoryNameEn ?? right.categoryName
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
