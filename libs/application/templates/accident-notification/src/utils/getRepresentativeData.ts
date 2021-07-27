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

type CompanyInfoType = {
  name: string
  nationalRegistrationId: string
  email: string
  phoneNumber: string
}

export const getWorkplaceData = (answers: FormValue) => {
  if (isGeneralWorkplaceAccident(answers))
    return {
      info: (answers as { companyInfo: CompanyInfoType }).companyInfo,
      title: companyInfo.labels.descriptionField,
    }
  if (isStudiesAccident(answers))
    return {
      info: (answers as { schoolInfo: CompanyInfoType }).schoolInfo,
      title: schoolInfo.labels.descriptionField,
    }
  if (isFishermanAccident(answers))
    return {
      info: (answers as { fishingCompanyInfo: CompanyInfoType })
        .fishingCompanyInfo,
      title: fishingCompanyInfo.labels.descriptionField,
    }
  if (isProfessionalAthleteAccident(answers))
    return {
      info: (answers as { sportsClubInfo: CompanyInfoType }).sportsClubInfo,
      title: sportsClubInfo.labels.descriptionField,
    }
  if (isRescueWorkAccident(answers))
    return {
      info: (answers as { rescueSquadInfo: CompanyInfoType }).rescueSquadInfo,
      title: rescueSquadInfo.labels.descriptionField,
    }
}
