import * as kennitala from 'kennitala'

import { Roles } from './constants'

const MIN_AGE = 13
const ADULT_AGE = 18

export const getApplicantRole = (nationalId: string): Roles | undefined => {
  if (kennitala.isCompany(nationalId)) {
    return Roles.ADULT_PROCURATION_APPLICANT
  }

  const { age } = kennitala.info(nationalId)

  if (age < MIN_AGE) {
    return undefined
  }

  if (age < ADULT_AGE) {
    return Roles.MINOR_APPLICANT
  }

  return Roles.ADULT_PERSONAL_APPLICANT
}
