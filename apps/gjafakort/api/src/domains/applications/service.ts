import { applicationService, ferdalagService } from '../../services'

export const getApplication = async (ssn: string) => {
  const application = await applicationService.getApplication(ssn)
  if (application) {
    return {
      id: application.id,
      name: application.data.name,
      email: application.data.email,
      state: application.state,
      companySSN: application.data.ssn,
      serviceCategory: application.data.serviceCategory,
      generalEmail: application.data.generalEmail,
      webpage: application.data.webpage,
      phoneNumber: application.data.phoneNumber,
      approveTerms: application.data.approveTerms,
      companyName: application.data.companyName,
      companyDisplayName: application.data.companyDisplayName,
    }
  }

  const serviceProviders = await ferdalagService.getServiceProviders(ssn)
  if (serviceProviders.length === 1) {
    console.debug(`Got a single service provider for ssn ${ssn}`)
    const [serviceProvider] = serviceProviders
    return {
      name: serviceProvider.contactInfo.name,
      companyDisplayName: serviceProvider.legalName,
      email: serviceProvider.email,
      state: 'empty',
      companySSN: serviceProvider.SSN,
      generalEmail: serviceProvider.contactInfo.email,
      webpage: serviceProvider.website,
      phoneNumber: serviceProvider.phoneNr || serviceProvider.contactInfo.phone,
    }
  }

  return null
}
