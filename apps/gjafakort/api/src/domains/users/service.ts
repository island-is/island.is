import { ApplicationAPI } from '../../services'

const APPLICATION_TYPE = 'gjafakort-user'

interface UserApplication {
  created: string
  modified: string
  id: string
  issuerSSN: string
  type: 'gjafakort-user'
  state: string
  data: {
    mobileNumber: string
    countryCode: string
  }
}

export const getApplication = async (
  userSSN: string,
  applicationApi: ApplicationAPI,
) => {
  return applicationApi.getApplication<UserApplication>(
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
