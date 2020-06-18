import { ForbiddenError } from 'apollo-server-express'

import { CompanyApplication } from '@island.is/gjafakort/types'
import { ApplicationStates } from '@island.is/gjafakort/consts'

import * as companyService from './service'
import { authorize } from '../auth'
import { CompanyApplication as CompanyApplicationGQL } from '../../types'

const formatApplication = (
  application: CompanyApplication,
): CompanyApplicationGQL =>
  application && {
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
    operatingPermitForRestaurant: application.data.operatingPermitForRestaurant,
    exhibition: application.data.exhibition,
    operatingPermitForVehicles: application.data.operatingPermitForVehicles,
    validLicenses: application.data.validLicenses,
    validPermit: application.data.validPermit,
    logs: application.AuditLogs?.map((auditLog) => ({
      id: auditLog.id,
      state: auditLog.state,
      title: auditLog.title,
      data: JSON.stringify(auditLog.data),
      authorSSN: auditLog.authorSSN,
    })),
  }

class CompanyResolver {
  @authorize()
  public async getCompanies(_1, _2, { user, dataSources }) {
    const members = await dataSources.rskApi.getCompanyRegistryMembers(user.ssn)
    const membersWithProcuration = members.filter(
      (member) => member.ErProkuruhafi === '1',
    )

    return membersWithProcuration.map((member) => ({
      ssn: member.Kennitala,
      name: member.Nafn,
    }))
  }

  @authorize()
  public async getCompany(_, { ssn }, { user, dataSources }) {
    const company = await dataSources.rskApi.getCompanyBySSN(user.ssn, ssn)
    if (!company) {
      throw new ForbiddenError('Company not found!')
    }

    return {
      ssn: company.Kennitala,
      name: company.Nafn,
    }
  }

  @authorize()
  public async createCompanyApplication(
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
    const state =
      serviceProviders.length === 1
        ? ApplicationStates.APPROVED
        : ApplicationStates.PENDING
    const comments = []
    if (serviceProviders.length > 1) {
      comments.push('Multiple service providers found for ssn')
    } else if (serviceProviders.length < 1) {
      comments.push('No service provider found for ssn')
    }

    const application = await companyService.createApplication(
      input,
      user.ssn,
      state,
      comments,
      applicationApi,
    )
    return {
      application: formatApplication(application),
    }
  }

  @authorize({ role: 'admin' })
  public async approveCompanyApplication(
    _,
    { input: { id } },
    { user, dataSources: { applicationApi } },
  ) {
    let application = await applicationApi.getApplication(id)
    if (!application) {
      throw new ForbiddenError('Application not found!')
    }

    application = await companyService.approveApplication(
      application,
      applicationApi,
      user.ssn,
    )

    return {
      application: formatApplication(application),
    }
  }

  @authorize({ role: 'admin' })
  public async rejectCompanyApplication(
    _,
    { input: { id } },
    { user, dataSources: { applicationApi } },
  ) {
    let application = await applicationApi.getApplication(id)
    if (!application) {
      throw new ForbiddenError('Application not found!')
    }

    application = await companyService.rejectApplication(
      application,
      applicationApi,
      user.ssn,
    )

    return {
      application: formatApplication(application),
    }
  }

  @authorize({ role: 'developer' })
  public async updateCompanyApplication(
    _,
    { input: { id, ...rest } },
    { user, dataSources: { applicationApi } },
  ) {
    let application = await applicationApi.getApplication(id)
    if (!application) {
      throw new ForbiddenError('Application not found!')
    }

    application = await companyService.updateApplication(
      application,
      applicationApi,
      user.ssn,
      rest,
    )

    return {
      application: formatApplication(application),
    }
  }

  @authorize({ role: 'admin' })
  public async getCompanyApplications(
    _1,
    _2,
    { dataSources: { applicationApi } },
  ) {
    const applications = await companyService.getApplications(applicationApi)
    return applications.map((application) => formatApplication(application))
  }

  @authorize({ role: 'admin' })
  public async getCompanyApplication(
    _1,
    { ssn },
    { dataSources: { applicationApi } },
  ) {
    const application = await applicationApi.getApplicationByType<
      CompanyApplication
    >(companyService.APPLICATION_TYPE, ssn)
    return formatApplication(application)
  }
}

const resolver = new CompanyResolver()
export default {
  Query: {
    companies: resolver.getCompanies,
    company: resolver.getCompany,
    companyApplications: resolver.getCompanyApplications,
    companyApplication: resolver.getCompanyApplication,
  },
  Mutation: {
    createCompanyApplication: resolver.createCompanyApplication,
    approveCompanyApplication: resolver.approveCompanyApplication,
    rejectCompanyApplication: resolver.rejectCompanyApplication,
    updateCompanyApplication: resolver.updateCompanyApplication,
  },

  Company: {
    async application(company, _, { dataSources }) {
      if (!company) {
        return null
      }

      const application = await companyService.getApplication(
        company.ssn,
        dataSources,
      )
      return formatApplication(application)
    },
  },
}
