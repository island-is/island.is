import { UserApplication } from '@island.is/gjafakort/types'

import { ApplicationAPI } from '../../services'

const APPLICATION_TYPE = 'gjafakort-user'

export const getApplication = async (
  userSSN: string,
  applicationApi: ApplicationAPI,
) => {
  return applicationApi.getApplicationByType<UserApplication>(
    APPLICATION_TYPE,
    userSSN,
  )
}

export const createApplication = async (
  userSSN: string,
  mobileNumber: string,
  countryCode: string,
  applicationApi: ApplicationAPI,
) => {
  return applicationApi.createApplication<UserApplication>({
    applicationType: APPLICATION_TYPE,
    issuerSSN: userSSN,
    authorSSN: userSSN,
    state: 'approved',
    data: { mobileNumber, countryCode },
  })
}
