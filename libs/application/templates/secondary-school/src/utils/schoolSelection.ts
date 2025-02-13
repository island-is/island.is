import { getValueViaPath } from '@island.is/application/core'
import { ExternalData, FormValue } from '@island.is/application/types'
import { Program, SecondarySchool } from './types'
import { checkIsFreshman, SecondarySchoolAnswers } from '..'

export const getRowsCountForSchoolSelection = (
  answers: FormValue,
  externalData: ExternalData,
): { min: number; max: number } => {
  const schools = getValueViaPath<SecondarySchool[]>(
    externalData,
    'schools.data',
  )

  const isFreshman = checkIsFreshman(answers)

  const isFirstFirstProgramSpecialNeedsProgram = getValueViaPath<boolean>(
    answers,
    'selection.0.firstProgram.isSpecialNeedsProgram',
  )

  let minSelectionCount: number | undefined
  let maxSelectionCount: number | undefined

  const filteredSchools = schools?.filter((x) =>
    isFreshman ? x.isOpenForAdmissionFreshman : x.isOpenForAdmissionGeneral,
  )

  if (isFreshman) {
    if (isFirstFirstProgramSpecialNeedsProgram) {
      minSelectionCount = 1
      maxSelectionCount = 3
    } else {
      minSelectionCount = 2
      maxSelectionCount = 3
    }
  } else {
    minSelectionCount = 1
    maxSelectionCount = 2
  }

  // overwrite values to handle if schools length is limited
  if (filteredSchools?.length === 1) {
    minSelectionCount = 1
    maxSelectionCount = 1
  } else if (filteredSchools?.length === 2) {
    minSelectionCount = Math.min(minSelectionCount, 2)
    maxSelectionCount = 2
  }

  return { min: minSelectionCount, max: maxSelectionCount }
}

export const getOtherSchoolIds = (
  answers: FormValue,
  index: number,
): string[] => {
  const result: string[] = []
  const selection = getValueViaPath<SecondarySchoolAnswers['selection']>(
    answers,
    'selection',
  )

  selection?.forEach((item, i) => {
    if (i !== index && item.school?.id) {
      result.push(item.school.id)
    }
  })

  return result
}

export const getSchoolInfo = (
  externalData: ExternalData,
  activeField?: Record<string, string>,
): SecondarySchool | undefined => {
  const schoolOptions = getValueViaPath<SecondarySchool[]>(
    externalData,
    'schools.data',
  )
  const schoolId =
    activeField && getValueViaPath<string>(activeField, 'school.id')
  return schoolOptions?.find((x) => x.id === schoolId)
}

export const getProgramInfo = (
  activeField?: Record<string, string>,
  programId?: string,
): Program | undefined => {
  const programOptions =
    activeField && getValueViaPath<Program[]>(activeField, 'programOptions')
  return programOptions?.find((x) => x.id === programId)
}
