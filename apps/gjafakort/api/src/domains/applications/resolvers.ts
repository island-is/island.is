import { ForbiddenError } from 'apollo-server-express'

import { authorize } from '../auth'

class ApplicationResolver {
  @authorize()
  public async createApplication(
    _,
    { input },
    { user, dataSources: { rskApi, ferdalagApi, applicationApi } },
  ) {
    const company = await rskApi.getCompanyBySSN(user.ssn, input.companySSN)
    if (!company) {
      throw new ForbiddenError('Company not found!')
    }

    const serviceProviders = await ferdalagApi.getServiceProviders(
      input.companySSN,
    )
    let state = 'approved'
    const comments = []
    if (serviceProviders.length > 1) {
      state = 'pending'
      comments.push('Multiple service providers found for ssn')
    } else if (serviceProviders.length < 1) {
      state = 'pending'
      comments.push('No service provider found for ssn')
    }

    const application = await applicationApi.createApplication(
      input,
      user.ssn,
      state,
      comments,
    )

    return {
      application: {
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
      },
    }
  }

  @authorize({ role: 'admin' })
  public async getApplications(_1, _2, { dataSources: { applicationApi } }) {
    const applications = await applicationApi.getApplications()
    return applications.map((application) => ({
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
      logs: application.AuditLogs.map((auditLog) => ({
        id: auditLog.id,
        state: auditLog.state,
        title: auditLog.title,
        data: '',
        authorSSN: auditLog.authorSSN,
      })),
    }))
  }
}

const resolver = new ApplicationResolver()
export default {
  Query: {
    applications: resolver.getApplications,
  },
  Mutation: {
    createApplication: resolver.createApplication,
  },
}
