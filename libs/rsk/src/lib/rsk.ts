import { Inject } from '@nestjs/common'
import { Logger, LOGGER_PROVIDER } from '@island.is/logging'
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

interface RSKCompaniesResponse {
  MemberCompanies: CompanyRegistryMember[]
}

export interface CompanyRegistryMember {
  Kennitala: string
  Nafn: string
  Rekstarform: string
  StadaAdila: string
  ErStjorn: '0' | '1'
  ErProkuruhafi: '0' | '1'
}

export class RSKService extends RESTDataSource {
  constructor (
    @Inject(RSK_OPTIONS)
    private readonly options: RSKServiceOptions,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {
    super()
    const config: any = {}
    this.baseURL = `${this.options.url}/companyregistry/members/`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest (request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set(
      'Authorization',
      `Basic ${Base64.encode(
        `${this.options.username}:${this.options.password}`,
      )}`,
    )
  }

  async getCompaniesByNationalId (
    nationalId: string,
  ): Promise<CompanyRegistryMember[]> {
    try {
      this.logger.info('Getting companies by national id', { nationalId }) // TODO: Get green light on logging this
      const response = await this.get<RSKCompaniesResponse | null>(
        `${nationalId}/companies`,
        {
          cacheOptions: { ttl: this.options.ttl ?? 600 }, // defaults to 10 minutes
        },
      )
      console.log('response', response)
      return response ? response.MemberCompanies : []
    } catch (err) {
      this.logger.error(err)
      throw new Error(
        'Error occurred while requesting members from company registry',
      )
    }
  }
}
