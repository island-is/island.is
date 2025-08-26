import { getValueViaPath, YES, YesOrNo } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { AccidentTypeEnum } from './enums'

export const isWorkAccident = (formValue: FormValue) => {
  const accidentType = getValueViaPath<AccidentTypeEnum>(
    formValue,
    'accidentType.radioButton',
  )
  return accidentType === AccidentTypeEnum.WORK
}

export const isHomeActivitiesAccident = (formValue: FormValue) => {
  const workAccidentType = getValueViaPath<AccidentTypeEnum>(
    formValue,
    'accidentType.radioButton',
  )
  return workAccidentType === AccidentTypeEnum.HOMEACTIVITIES
}

export const isRescueWorkAccident = (formValue: FormValue) => {
  const accidentType = getValueViaPath<AccidentTypeEnum>(
    formValue,
    'accidentType.radioButton',
  )
  return accidentType === AccidentTypeEnum.RESCUEWORK
}

export const isStudiesAccident = (formValue: FormValue) => {
  const accidentType = getValueViaPath<AccidentTypeEnum>(
    formValue,
    'accidentType.radioButton',
  )
  return accidentType === AccidentTypeEnum.STUDIES
}

export const getInjuredPersonInformation = (answers: FormValue) => {
  const injuredPersonsEmail = getValueViaPath<string>(
    answers,
    'injuredPersonInformation.email',
  )

  const injuredPersonsName = getValueViaPath<string>(
    answers,
    'injuredPersonInformation.name',
  )

  return {
    email: injuredPersonsEmail,
    name: injuredPersonsName,
  }
}

export const isFatalAccident = (formValue: FormValue) => {
  const wasTheAccidentFatal = getValueViaPath<YesOrNo>(
    formValue,
    'wasTheAccidentFatal',
  )
  return wasTheAccidentFatal === YES
}
