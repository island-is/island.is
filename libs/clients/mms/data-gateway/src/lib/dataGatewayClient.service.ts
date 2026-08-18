import { Injectable } from '@nestjs/common'
import { SchoolDto, SchoolsApi } from '../../gen/fetch'

@Injectable()
export class DataGatewayClientService {
  constructor(private readonly schoolsApi: SchoolsApi) {}

  async getSchools(): Promise<SchoolDto[]> {
    const response = await this.schoolsApi.v1SchoolsGet({})
    return response.results ?? []
  }
}
