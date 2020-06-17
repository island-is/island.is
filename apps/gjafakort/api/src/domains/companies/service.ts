import { logger } from '@island.is/logging'
import { CompanyApplication } from '@island.is/gjafakort/types'
import { ApplicationStates } from '@island.is/gjafakort/consts'

import { CreateCompanyApplicationInput } from '../../types'
import { DataSource } from '../../types'
import { ApplicationAPI } from '../../services'

const APPLICATION_TYPE = 'gjafakort'

export const getApplication = async (
  companySSN: string,
  { applicationApi, ferdalagApi }: DataSource,
) => {
  const application = await applicationApi.getApplicationByType<
    CompanyApplication
  >(APPLICATION_TYPE, companySSN)
  if (application) {
    return application
  }

  const serviceProviders = await ferdalagApi.getServiceProviders(companySSN)
  if (serviceProviders.length === 1) {
    logger.debug(`Got a single service provider for ssn ${companySSN}`)
    const [serviceProvider] = serviceProviders
    return {
      state: ApplicationStates.NONE,
      data: {
        name: serviceProvider.contactInfo.name,
        companyDisplayName: serviceProvider.legalName,
        email: serviceProvider.contactInfo.email,
        companySSN: serviceProvider.SSN,
        generalEmail: serviceProvider.email,
        webpage: serviceProvider.website,
        phoneNumber:
          serviceProvider.phoneNr || serviceProvider.contactInfo.phone,
      },
    } as CompanyApplication
  }

  return null
}

export const createApplication = async (
  applicationInput: CreateCompanyApplicationInput,
  authorSSN: string,
  state: CompanyApplication['state'],
  comments: string[],
  applicationApi: ApplicationAPI,
) => {
  const data = {
    ...applicationInput,
    comments,
  }
  return applicationApi.createApplication<CompanyApplication>({
    applicationType: APPLICATION_TYPE,
    issuerSSN: applicationInput.companySSN,
    authorSSN,
    state,
    data,
  })
}

export const getApplications = async (applicationApi: ApplicationAPI) => {
  return applicationApi.getApplications<CompanyApplication>(APPLICATION_TYPE)
}

export const approveApplication = (
  application: CompanyApplication,
  applicationApi: ApplicationAPI,
  ssn: string,
) => {
  if (application.state !== ApplicationStates.PENDING) {
    throw new Error(
      `Cannot approve an application in the ${application.state} state`,
    )
  }

  return applicationApi.updateApplication<CompanyApplication>(
    application.id,
    ApplicationStates.MANUAL_APPROVED,
    ssn,
  )
}

export const rejectApplication = (
  application: CompanyApplication,
  applicationApi: ApplicationAPI,
  ssn: string,
) => {
  if (application.state !== ApplicationStates.PENDING) {
    throw new Error(
      `Cannot reject an application in the ${application.state} state`,
    )
  }

  return applicationApi.updateApplication<CompanyApplication>(
    application.id,
    ApplicationStates.REJECTED,
    ssn,
  )
}
