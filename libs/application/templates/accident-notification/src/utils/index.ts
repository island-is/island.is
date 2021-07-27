import { FormValue } from '@island.is/application/core'
import {
  companyInfo,
  fishingCompanyInfo,
  rescueSquadInfo,
  schoolInfo,
  sportsClubInfo,
} from '../lib/messages'

export const isValid24HFormatTime = (value: string) => {
  if (value.length !== 4) return false
  const hours = parseInt(value.slice(0, 2))
  const minutes = parseInt(value.slice(2, 4))
  if (hours > 23) return false
  if (minutes > 59) return false
  return true
}

// TEMP
const isGeneralWorkplaceAccidentTest = () => false
const isFishermanAccidentTest = () => false
const isProfessionalAthleteAccidentTest = () => false
const isAgricultureAccidentTest = () => false
const isRescueWorkAccidentTest = () => true
const isStudiesAccidentTest = () => false
const isWorkAccidentTest = () => false
const isHomeActivitiesAccidentTest = () => false

type CompanyInfoType = {
  name: string
  nationalRegistrationId: string
  email: string
  phoneNumber: string
}

export const getRepresentativeData = (answers: FormValue) => {
  if (isGeneralWorkplaceAccidentTest())
    return {
      info: (answers as { companyInfo: CompanyInfoType }).companyInfo,
      title: companyInfo.labels.descriptionField,
    }
  if (isStudiesAccidentTest())
    return {
      info: (answers as { schoolInfo: CompanyInfoType }).schoolInfo,
      title: schoolInfo.labels.descriptionField,
    }
  if (isFishermanAccidentTest())
    return {
      info: (answers as { fishingCompanyInfo: CompanyInfoType })
        .fishingCompanyInfo,
      title: fishingCompanyInfo.labels.descriptionField,
    }
  if (isProfessionalAthleteAccidentTest())
    return {
      info: (answers as { sportsClubInfo: CompanyInfoType }).sportsClubInfo,
      title: sportsClubInfo.labels.descriptionField,
    }
  if (isRescueWorkAccidentTest())
    return {
      info: (answers as { rescueSquadInfo: CompanyInfoType }).rescueSquadInfo,
      title: rescueSquadInfo.labels.descriptionField,
    }
}
