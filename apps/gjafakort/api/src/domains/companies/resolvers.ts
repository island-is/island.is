import { ForbiddenError } from 'apollo-server-express'

import { applicationService } from '../applications'
import { authorize } from '../auth'
import { rskService, ferdalagService } from '../../services'

class CompanyResolver {
  @authorize()
  public async getCompanies(_1, _2, { user }) {
    const members = await rskService.getCompanyRegistryMembers(user.ssn)
    const membersWithProcuration = members.filter(
      (member) => member.ErProkuruhafi === '1',
    )

    return {
      companies: membersWithProcuration.map((member) => ({
        ssn: member.Kennitala,
        name: member.Nafn,
      })),
    }
  }

  @authorize()
  public async getCompany(_, { ssn }, { user }) {
    const members = await rskService.getCompanyRegistryMembers(user.ssn)
    const company = members.find(
      (member) => member.ErProkuruhafi === '1' && member.Kennitala === ssn,
    )
    if (!company) {
      throw new ForbiddenError('Company not found!')
    }

    const application = await applicationService.getApplication(ssn)
    if (application) {
      return {
        company: {
          ssn: company.Kennitala,
          name: company.Nafn,
          application: {
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
          },
        },
      }
    }

    const serviceProviders = await ferdalagService.getServiceProviders(ssn)
    if (serviceProviders.length === 1) {
      console.debug(`Got a single service provider for ssn ${ssn}`)
      const [serviceProvider] = serviceProviders
      return {
        company: {
          ssn: company.Kennitala,
          name: company.Nafn,
          application: {
            name: serviceProvider.contactInfo.name,
            companyDisplayName: serviceProvider.legalName || company.Nafn,
            email: serviceProvider.email,
            state: 'empty',
            companySSN: serviceProvider.SSN,
            generalEmail: serviceProvider.contactInfo.email,
            webpage: serviceProvider.website,
            phoneNumber:
              serviceProvider.phoneNr || serviceProvider.contactInfo.phone,
          },
        },
      }
    }

    return {
      company: {
        ssn: company.Kennitala,
        name: company.Nafn,
        application: null,
      },
    }
  }
}

const resolver = new CompanyResolver()
export default {
  Query: {
    getCompanies: resolver.getCompanies,
    getCompany: resolver.getCompany,
  },
}
