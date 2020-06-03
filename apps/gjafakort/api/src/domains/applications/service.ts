import { logger } from '@island.is/logging'

import { applicationService, ferdalagService } from '../../services'

export const getApplication = async (companySSN: string) => {
  const application = await applicationService.getApplication(companySSN)
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
      approveTerms: application.data.approveTerms,
      companyName: application.data.companyName,
      companyDisplayName: application.data.companyDisplayName,
    }
  }

  const serviceProviders = await ferdalagService.getServiceProviders(companySSN)
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
