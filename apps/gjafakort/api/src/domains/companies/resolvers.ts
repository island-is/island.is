import { ForbiddenError } from 'apollo-server-express'

import { applicationsService } from '../applications'
import { authorize } from '../auth'
import { rskService, ferdalagService } from '../../services'

class CompanyResolver {
  @authorize()
  public async getCompanies(_1, _2, { user }) {
    const members = await rskService.getCompanyRegistryMembers(user.ssn)
    const membersWithProcuration = members.filter(
      (member) => member.ErProkuruhafi === '1',
    )

    return membersWithProcuration.map((member) => ({
      ssn: member.Kennitala,
      name: member.Nafn,
    }))
  }

  @authorize()
  public async getCompany(_, { ssn }, { user }) {
    const company = await rskService.getCompanyBySSN(user.ssn, ssn)
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
    application(parent) {
      return applicationsService.getApplication(parent.ssn)
    },
  },
}
