import { UserApplication } from '@island.is/gjafakort/types'
import { ApplicationStates } from '@island.is/gjafakort/consts'

import { ApplicationAPI } from '../../services'

const APPLICATION_TYPE = 'gjafakort-user'

export const getApplication = (
  userSSN: string,
  applicationApi: ApplicationAPI,
) => {
  return applicationApi.getApplicationByType<UserApplication>(
    APPLICATION_TYPE,
    userSSN,
  )
}

export const getApplications = (applicationApi: ApplicationAPI) => {
  return applicationApi.getApplications<UserApplication>(APPLICATION_TYPE)
}

export const getApplicationCount = (applicationApi: ApplicationAPI) => {
  return applicationApi.getApplicationCount<UserApplication>(APPLICATION_TYPE)
}

export const createApplication = (
  userSSN: string,
  mobileNumber: string,
  countryCode: string,
  verified: boolean,
  applicationApi: ApplicationAPI,
) => {
  return applicationApi.createApplication<UserApplication>({
    applicationType: APPLICATION_TYPE,
    issuerSSN: userSSN,
    authorSSN: userSSN,
    state: ApplicationStates.APPROVED,
    data: { mobileNumber, countryCode, verified },
  })
}

export const updateApplication = (
  applicationId: string,
  userSSN: string,
  verified: boolean,
  applicationApi: ApplicationAPI,
) => {
  return applicationApi.updateApplication<UserApplication>({
    id: applicationId,
    authorSSN: userSSN,
    data: { verified },
  })
}
