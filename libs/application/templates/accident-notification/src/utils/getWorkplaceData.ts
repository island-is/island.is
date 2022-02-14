import { FormValue, getValueViaPath } from '@island.is/application/core'
import {
  isGeneralWorkplaceAccident,
  isStudiesAccident,
  isFishermanAccident,
  isProfessionalAthleteAccident,
  isRescueWorkAccident,
} from './'
import {
  companyInfo,
  fishingCompanyInfo,
  rescueSquadInfo,
  schoolInfo,
  sportsClubInfo,
  representativeInfo,
} from '../lib/messages'
import {
  AccidentTypeEnum,
  CompanyInfo,
  RepresentativeInfo,
  WorkAccidentTypeEnum,
  YesOrNo,
} from '../types'
import { isHomeActivitiesAccident } from './isHomeActivitiesAccident'

interface WorkplaceData {
  companyInfo: CompanyInfo
  representitive: RepresentativeInfo
  companyInfoMsg: typeof companyInfo
  representitiveMsg: typeof representativeInfo
  type: WorkAccidentTypeEnum | AccidentTypeEnum
  onPayRoll?: YesOrNo
  screenId: string
}

export const getWorkplaceData = (
  answers: FormValue,
): WorkplaceData | undefined => {
  if (isHomeActivitiesAccident(answers)) {
    return
  }

  const workplaceData = {
    companyInfo: getValueViaPath(answers, 'companyInfo') as CompanyInfo,
    representitive: getValueViaPath(
      answers,
      'representative',
    ) as RepresentativeInfo,
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
      onPayRoll: getValueViaPath(answers, 'onPayRoll.answer') as YesOrNo,
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
