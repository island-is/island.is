import { logger } from '@island.is/logging'

import { DataSource } from '../../types'

export const getApplication = async (
  companySSN: string,
  { applicationApi, ferdalagApi }: DataSource,
) => {
  const application = await applicationApi.getApplication(companySSN)
  if (application) {
    return {
      id: application.id,
      name: application.data.name,
      email: application.data.email,
      state: application.state,
      companySSN: application.data.companySSN,
      serviceCategory: application.data.serviceCategory,
      generalEmail: application.data.generalEmail,
      webpage: application.data.webpage,
      phoneNumber: application.data.phoneNumber,
      operationsTrouble: application.data.operationsTrouble,
      companyName: application.data.companyName,
      companyDisplayName: application.data.companyDisplayName,
      operatingPermitForRestaurant:
        application.data.operatingPermitForRestaurant,
      exhibition: application.data.exhibition,
      operatingPermitForVehicles: application.data.operatingPermitForVehicles,
      validLicenses: application.data.validLicenses,
      validPermit: application.data.validPermit,
    }
  }

  const serviceProviders = await ferdalagApi.getServiceProviders(companySSN)
  if (serviceProviders.length === 1) {
    logger.debug(`Got a single service provider for ssn ${companySSN}`)
    const [serviceProvider] = serviceProviders
    return {
      name: serviceProvider.contactInfo.name,
      companyDisplayName: serviceProvider.legalName,
      email: serviceProvider.contactInfo.email,
      state: 'empty',
      companySSN: serviceProvider.SSN,
      generalEmail: serviceProvider.email,
      webpage: serviceProvider.website,
      phoneNumber: serviceProvider.phoneNr || serviceProvider.contactInfo.phone,
    }
  }

  return null
}
