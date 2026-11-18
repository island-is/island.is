import format from 'date-fns/format'
import parseISO from 'date-fns/parseISO'
import {
  WorkMachineLicenseDto,
  WorkMachineRightDto,
} from '@island.is/clients/seminars-ver'
import { Locale } from '@island.is/shared/types'

export const formatDate = (date: string) => format(parseISO(date), 'dd.MM.yyyy')

export const formatRightName = (right: WorkMachineRightDto, locale: Locale) =>
  `${right.category} - ${
    locale === 'en'
      ? right.categoryNameEn ?? right.categoryName
      : right.categoryName
  }`

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
