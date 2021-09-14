import { Inject } from '@nestjs/common'
import { DataSourceConfig } from 'apollo-datasource'
import { RequestOptions, RESTDataSource } from 'apollo-datasource-rest'
import { CompanyItem } from './gen/fetch'
import { RskCompanyInfoServiceOptions, RSK_COMPANY_INFO_OPTIONS } from './types'

export class RskCompanyInfoAPI extends RESTDataSource {
  constructor(
    @Inject(RSK_COMPANY_INFO_OPTIONS)
    private readonly options: RskCompanyInfoServiceOptions,
  ) {
    super()
    const { xRoadBaseUrl, xRoadProviderId, apiPath } = this.options
    this.baseURL = `${xRoadBaseUrl}/r1/${xRoadProviderId}/${apiPath}/`
    this.initialize({} as DataSourceConfig<any>)
  }

  willSendRequest(request: RequestOptions) {
    request.headers.set('Content-Type', 'application/json')
    request.headers.set('X-Road-Client', this.options.xRoadClientId)
  }

  async getCompanyInfo(nationalId: string): Promise<CompanyItem> {
    const response = await this.get<CompanyItem>(`/${nationalId}`)
    return response
  }

  async searchCompany(searchString: string): Promise<CompanyItem[]> {
    const response = await this.get<CompanyItem[]>(`/search/${searchString}`)
    return response
  }
}
