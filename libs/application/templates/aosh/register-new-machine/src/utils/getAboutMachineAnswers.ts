import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import {
  AboutMachineType,
  CategoryFromServiceType,
  CategoryType,
} from '../shared/types'

export const getAboutMachineAnswers = (
  answers: FormValue,
  externalData: ExternalData,
): AboutMachineType => {
  const machineParentCategories = getValueViaPath(
    externalData,
    'machineParentCategories.data',
    [],
  ) as { name: string; nameEn: string }[]
  const machineType = getValueViaPath(
    answers,
    'machine.aboutMachine.type',
    '',
  ) as string
  const machineModel = getValueViaPath(
    answers,
    'machine.aboutMachine.model',
    '',
  ) as string
  const machineCategory = getValueViaPath(
    answers,
    `machine.aboutMachine.category`,
    { nameIs: '', nameEn: '' },
  ) as CategoryType
  const machineSubCategory = getValueViaPath(
    answers,
    `machine.aboutMachine.subcategory`,
    { nameIs: '', nameEn: '' },
  ) as CategoryType
  const fromService = getValueViaPath(
    answers,
    'machine.aboutMachine.fromService',
    false,
  ) as boolean
  const categoriesFromService = getValueViaPath(
    answers,
    'machine.aboutMachine.categories',
    [],
  ) as CategoryFromServiceType[]

  return {
    machineParentCategories,
    machineType,
    machineModel,
    machineCategory,
    machineSubCategory,
    fromService,
    categoriesFromService,
  }
}
