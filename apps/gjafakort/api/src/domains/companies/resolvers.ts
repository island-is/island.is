import { authorize } from '../auth'
import { rskService } from '../../services'

class CompanyResolver {
  @authorize()
  public async getCompanies(_, args, { user }) {
    const members = await rskService.getCompanyRegistryMembers(user.ssn)
    const membersWithProcuration = members.filter(
      (member) => member.ErProkuruhafi === '1',
    )
    return membersWithProcuration.map((member) => ({
      ssn: member.Kennitala,
      name: member.Nafn,
    }))
  }
}

const resolver = new CompanyResolver()
export default {
  Query: {
    companies: resolver.getCompanies,
  },
}
