import { Inject } from '@nestjs/common'
import { RESTDataSource, RequestOptions } from 'apollo-datasource-rest'
import { DataSourceConfig } from 'apollo-datasource'
import { Base64 } from 'js-base64'

export const RSK_OPTIONS = 'RSK_OPTIONS'

export interface RSKServiceOptions {
  url: string
  username: string
  password: string
  ttl?: number
}

export interface RSKCompaniesResponse {
  MemberCompanies?: CompanyRegistryMemberResponse[]
}

interface CompanyRegistryMemberResponse {
  Kennitala: string
  Nafn: string
  Rekstarform: string
  StadaAdila: string
  ErStjorn: '0' | '1'
  ErProkuruhafi: '0' | '1'
}

export interface CompanyRegistryMember {
  nationalId: string
  name: string
  operationalForm: string
  companyStatus: string
  isPartOfBoardOfDirectors: boolean
  hasProcuration: boolean
}

export class RSKService extends RESTDataSource {
  constructor(
    @Inject(RSK_OPTIONS)
    private readonly options: RSKServiceOptions,
  ) {
    super()
    this.baseURL = `${this.options.url}/companyregistry/members/`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set(
      'Authorization',
      `Basic ${Base64.encode(
        `${this.options.username}:${this.options.password}`,
      )}`,
    )
  }

  async getCompaniesByNationalId(
    nationalId: string,
  ): Promise<CompanyRegistryMember[]> {
    const response = await this.get<RSKCompaniesResponse | null>(
      `${nationalId}/companies`,
      {
        cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
      },
    )
    return (response?.MemberCompanies ?? []).map((company) => ({
      nationalId: company.Kennitala,
      name: company.Nafn,
      operationalForm: company.Rekstarform,
      companyStatus: company.StadaAdila,
      isPartOfBoardOfDirectors: company.ErStjorn === '1',
      hasProcuration: company.ErProkuruhafi === '1',
    }))
  }
}
