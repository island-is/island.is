import { FormValue } from '@island.is/application/core'
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
} from '../lib/messages'
import { AccidentTypeEnum, CompanyInfo, WorkAccidentTypeEnum } from '../types'

export const getWorkplaceData = (answers: FormValue) => {
  if (isGeneralWorkplaceAccident(answers))
    return {
      info: (answers as { companyInfo: CompanyInfo }).companyInfo,
      general: companyInfo.general,
      labels: companyInfo.labels,
      type: AccidentTypeEnum.WORK,
      screenId: 'companyInfo',
    }

  if (isStudiesAccident(answers))
    return {
      info: (answers as { schoolInfo: CompanyInfo }).schoolInfo,
      general: schoolInfo.general,
      labels: schoolInfo.labels,
      type: AccidentTypeEnum.STUDIES,
      screenId: 'schoolInfo',
    }

  if (isFishermanAccident(answers))
    return {
      info: (answers as { fishingCompanyInfo: CompanyInfo }).fishingCompanyInfo,
      general: fishingCompanyInfo.general,
      labels: fishingCompanyInfo.labels,
      type: WorkAccidentTypeEnum.FISHERMAN,
      screenId: 'fishingCompanyInfo',
    }

  if (isProfessionalAthleteAccident(answers))
    return {
      info: (answers as { sportsClubInfo: CompanyInfo }).sportsClubInfo,
      general: sportsClubInfo.general,
      labels: sportsClubInfo.labels,
      type: AccidentTypeEnum.SPORTS,
      screenId: 'sportsClubInfo',
    }

  if (isRescueWorkAccident(answers))
    return {
      info: (answers as { rescueSquadInfo: CompanyInfo }).rescueSquadInfo,
      general: rescueSquadInfo.general,
      labels: rescueSquadInfo.labels,
      type: AccidentTypeEnum.RESCUEWORK,
      screenId: 'rescueSquad',
    }
}
