import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { Base64 } from 'js-base64'

import { logger } from '@island.is/logging'

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
    request.headers.set(
      'Authorization',
      `Basic ${Base64.encode(`${rsk.username}:${rsk.password}`)}`,
    )
  }

  async getCompanyRegistryMembers(
    userSSN: string,
  ): Promise<CompanyRegistryMember[]> {
    throw new Error('API error on dev')
    try {
      const res = await this.get(`${userSSN}/companies`, null, {
        cacheOptions: { ttl: rsk.ttl },
      })
      const { MemberCompanies } = res
      if (!MemberCompanies) {
        return []
      }
      return MemberCompanies
    } catch (err) {
      logger.error(err)
      throw new Error(
        'Error occurred while requesting members from company registry',
      )
    }
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
