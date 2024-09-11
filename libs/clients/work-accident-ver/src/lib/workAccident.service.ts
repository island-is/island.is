import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import {
  AccidentsApi,
  CompanySettingsApi,
  DataApi,
  DataDto,
} from '../../gen/fetch'

@Injectable()
export class WorkAccidentClientService {
  constructor(
    private readonly accidentsApi: AccidentsApi,
    private readonly companySettingsApi: CompanySettingsApi,
    private readonly dataApi: DataApi,
  ) {}

  private accidentsApiWithAuth = (user: User) =>
    this.accidentsApi.withMiddleware(new AuthMiddleware(user as Auth))

  private companySettingsApiWithAuth = (user: User) =>
    this.companySettingsApi.withMiddleware(new AuthMiddleware(user as Auth))

  private dataApiWithAuth = (user: User) =>
    this.dataApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getOptionsData(auth: User): Promise<DataDto> {
    return await this.dataApiWithAuth(auth).getData()
  }
}
