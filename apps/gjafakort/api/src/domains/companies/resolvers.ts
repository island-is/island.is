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
}

const resolver = new CompanyResolver()
export default {
  Query: {
    getCompanies: resolver.getCompanies,
  },
}
