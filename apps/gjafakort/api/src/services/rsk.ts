import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { Base64 } from 'js-base64'

import { environment } from '../environments'

const { rsk } = environment

interface CompanyRegistryMember {
  Kennitala: string
  Nafn: string
  Rekstarform: string
  StadaAdila: string
  ErStjorn: '0' | '1'
  ErProkuruhafi: '0' | '1'
}

class RskAPI extends RESTDataSource {
  baseURL = `${rsk.url}/companyregistry/members/`

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set('Cache-Control', 'max-age=86400')
    request.headers.set(
      'Authorization',
      `Basic ${Base64.encode(`${rsk.username}:${rsk.password}`)}`,
    )
  }

  async getCompanyRegistryMembers(
    userSSN: string,
  ): Promise<CompanyRegistryMember[]> {
    const res = await this.get(`${userSSN}/companies`)
    const { MemberCompanies } = res
    if (!MemberCompanies) {
      return []
    }
    return MemberCompanies
  }

  async getCompanyBySSN(
    userSSN: string,
    companySSN: string,
  ): Promise<CompanyRegistryMember> {
    const members = await this.getCompanyRegistryMembers(userSSN)
    return members.find(
      (member) =>
        member.ErProkuruhafi === '1' && member.Kennitala === companySSN,
    )
  }
}

export default RskAPI
