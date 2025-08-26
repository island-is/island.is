import { getValueViaPath } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'

export const isUnknownPracticalRight = (answers: FormValue) => {
  const unknownPracticalRight = getValueViaPath<boolean>(
    answers,
    'certificateOfTenure.unknownPracticalRight',
  )
  return !!unknownPracticalRight
}

export const isWrongPracticalRight = (answers: FormValue) => {
  const wrongPracticalRight = getValueViaPath<boolean>(
    answers,
    'certificateOfTenure.wrongPracticalRight',
  )
  return !!wrongPracticalRight
}

export const isWrongPracticalRightWithInfo = (answers: FormValue) => {
  const wrongPracticalRightWithInfo = getValueViaPath<boolean>(
    answers,
    'certificateOfTenure.wrongPracticalRightWithInfo',
  )
  return !!wrongPracticalRightWithInfo
}

export const isUnknownMachineType = (answers: FormValue) => {
  const unknownMachineType = getValueViaPath<boolean>(
    answers,
    'certificateOfTenure.unknownMachineType',
  )
  const unknownPracticalRight = getValueViaPath<boolean>(
    answers,
    'certificateOfTenure.unknownPracticalRight',
  )
  const alreadyHaveTrainingLicense = getValueViaPath<boolean>(
    answers,
    'certificateOfTenure.alreadyHaveTrainingLicense',
  )
  return (
    !!unknownMachineType &&
    !unknownPracticalRight &&
    !alreadyHaveTrainingLicense
  )
}

export const alreadyHaveTrainingLicense = (answers: FormValue) => {
  const alreadyHaveTrainingLicense = getValueViaPath<boolean>(
    answers,
    'certificateOfTenure.alreadyHaveTrainingLicense',
  )
  return !!alreadyHaveTrainingLicense
}
