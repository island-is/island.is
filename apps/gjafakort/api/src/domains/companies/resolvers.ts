import { ForbiddenError } from 'apollo-server-express'

import { applicationService } from '../applications'
import { authorize } from '../auth'

class CompanyResolver {
  @authorize()
  public async getCompanies(_1, _2, { user, dataSources }) {
    const members = await dataSources.rskApi.getCompanyRegistryMembers(
      user.ssn,
    )
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
}

const resolver = new CompanyResolver()
export default {
  Query: {
    companies: resolver.getCompanies,
    company: resolver.getCompany,
  },

  Company: {
    application(company, _, { dataSources }) {
      if (!company) {
        return null
      }

      return applicationService.getApplication(
        company.ssn,
        dataSources,
      )
    },
  },
}
