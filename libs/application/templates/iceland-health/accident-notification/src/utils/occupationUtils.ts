import { getValueViaPath, YES, YesOrNo } from '@island.is/application/core'
import { FormValue } from '@island.is/application/types'
import { CompanyInfo, RepresentativeInfo, WorkplaceData } from './types'
import {
  isHomeActivitiesAccident,
  isRescueWorkAccident,
  isStudiesAccident,
  isWorkAccident,
} from './accidentUtils'
import {
  companyInfo,
  fishingCompanyInfo,
  representativeInfo,
  rescueSquadInfo,
  schoolInfo,
  sportsClubInfo,
} from '../lib/messages'
import { AccidentNotificationAnswers } from '..'
import {
  AccidentTypeEnum,
  FishermanWorkplaceAccidentLocationEnum,
  StudiesAccidentTypeEnum,
  WorkAccidentTypeEnum,
} from './enums'

// As this is a third question the user is asked there is a case where he could go back
// and select home activities and keep the workaccident type or go back and change where the
// accident happened.
// Therefore we need to check ifFishermanAccident function again
export const isAboardShip = (formValue: FormValue) => {
  const fishermanWorkplaceAccidentLocationAnswer =
    getValueViaPath<FishermanWorkplaceAccidentLocationEnum>(
      formValue,
      'accidentLocation.answer',
    )
  return (
    isFishermanAccident(formValue) &&
    fishermanWorkplaceAccidentLocationAnswer ===
      FishermanWorkplaceAccidentLocationEnum.ONTHESHIP
  )
}

export const getWorkplaceData = (
  answers: FormValue,
): WorkplaceData | undefined => {
  if (isHomeActivitiesAccident(answers)) {
    return
  }

  const workplaceData = {
    companyInfo: getValueViaPath<CompanyInfo>(answers, 'companyInfo'),
    representitive: getValueViaPath<RepresentativeInfo>(
      answers,
      'representative',
    ),
    representitiveMsg: representativeInfo,
  } as WorkplaceData

  if (isGeneralWorkplaceAccident(answers))
    return {
      ...workplaceData,
      companyInfoMsg: companyInfo,
      type: AccidentTypeEnum.WORK,
      screenId: 'companyInfo',
    }

  if (isStudiesAccident(answers))
    return {
      ...workplaceData,
      companyInfoMsg: schoolInfo,
      type: AccidentTypeEnum.STUDIES,
      screenId: 'schoolInfo',
    }

  if (isFishermanAccident(answers))
    return {
      ...workplaceData,
      companyInfoMsg: fishingCompanyInfo,
      type: WorkAccidentTypeEnum.FISHERMAN,
      screenId: 'fishingCompanyInfo',
    }

  if (isProfessionalAthleteAccident(answers))
    return {
      ...workplaceData,
      onPayRoll: getValueViaPath<YesOrNo>(answers, 'onPayRoll.answer'),
      companyInfoMsg: sportsClubInfo,
      type: AccidentTypeEnum.SPORTS,
      screenId: 'sportsClubInfo',
    }

  if (isRescueWorkAccident(answers))
    return {
      ...workplaceData,
      companyInfoMsg: rescueSquadInfo,
      type: AccidentTypeEnum.RESCUEWORK,
      screenId: 'rescueSquad',
    }
}

export const isInternshipStudiesAccident = (formValue: FormValue) => {
  const studiesAccidentType = getValueViaPath<StudiesAccidentTypeEnum>(
    formValue,
    'studiesAccident.type',
  )
  return studiesAccidentType === StudiesAccidentTypeEnum.INTERNSHIP
}

export const isMachineRelatedAccident = (formValue: FormValue) => {
  const workMachineAnswer = getValueViaPath<YesOrNo>(
    formValue,
    'workMachineRadio',
  )
  return isGeneralWorkplaceAccident(formValue) && workMachineAnswer === YES
}

// When a person is hurt in a sports accident and is an employee of the sport, the accident
// is considered a work accident. This function checks if both conditions are met.
export const isSportAccidentAndEmployee = (formValue: FormValue): boolean => {
  const workAccidentType = getValueViaPath(
    formValue,
    'accidentType.radioButton',
  ) as AccidentTypeEnum
  const onPayRoll = getValueViaPath(formValue, 'onPayRoll.answer') as YesOrNo

  if (workAccidentType === AccidentTypeEnum.SPORTS && onPayRoll === 'yes') {
    return true
  }

  return false
}

// As this is a second question the user is asked there is a case where he could go back and select home activities and keep the workaccident type.
// Therefore we need to check also whether this is a work accident
export const isFishermanAccident = (formValue: FormValue) => {
  const workAccidentType = getValueViaPath<WorkAccidentTypeEnum>(
    formValue,
    'workAccident.type',
  )
  return (
    workAccidentType === WorkAccidentTypeEnum.FISHERMAN &&
    isWorkAccident(formValue)
  )
}

// As this is a second question the user is asked there is a case where he could go back and select home activities and keep the agriculture type.
// Therefore we need to check also whether this is a work accident
export const isAgricultureAccident = (formValue: FormValue) => {
  const workAccidentType = getValueViaPath<WorkAccidentTypeEnum>(
    formValue,
    'workAccident.type',
  )
  return (
    workAccidentType === WorkAccidentTypeEnum.AGRICULTURE &&
    isWorkAccident(formValue)
  )
}

// Specific case check here since the accident can be a sports accident if he picks sports in the first question where
// he is asked what the circumstances of the accident were. But that user could also select work and then a sport related
// accident since the question can be missunderstood by the user so we are funneling both cases into the same flow
export const isProfessionalAthleteAccident = (formValue: FormValue) => {
  const workAccidentType = getValueViaPath<AccidentTypeEnum>(
    formValue,
    'accidentType.radioButton',
  )
  const workAccidentSecondaryType = getValueViaPath<WorkAccidentTypeEnum>(
    formValue,
    'workAccident.type',
  )
  return (
    workAccidentType === AccidentTypeEnum.SPORTS ||
    (workAccidentSecondaryType === WorkAccidentTypeEnum.PROFESSIONALATHLETE &&
      isWorkAccident(formValue))
  )
}

// As this is a second question the user is asked there is a case where he could go back and select home activities and keep the workaccident type.
// Therefore we need to check also whether this is a work accident
export const isGeneralWorkplaceAccident = (formValue: FormValue) => {
  const workAccidentType = getValueViaPath<string>(
    formValue,
    'workAccident.type',
  )
  return (
    workAccidentType === WorkAccidentTypeEnum.GENERAL &&
    isWorkAccident(formValue)
  )
}

export const isOfWorkAccidentType = (
  answers: Partial<AccidentNotificationAnswers>,
  type: WorkAccidentTypeEnum,
) => {
  const workAccidentType = getValueViaPath<WorkAccidentTypeEnum>(
    answers,
    'workAccident.type',
  )
  return workAccidentType === type
}
