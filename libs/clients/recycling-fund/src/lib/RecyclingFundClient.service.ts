import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { RecyclingFundGraphQLClientApi } from '../../gen/fetch'

@Injectable()
export class RecyclingFundClientService {
  constructor(
    private readonly recyclingFundGraphQLClientApi: RecyclingFundGraphQLClientApi,
  ) {}

  private getRecyclingFundGraphQLClient = (user: User) =>
    this.recyclingFundGraphQLClientApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  async getVehicles(user: User): Promise<any> {
    return await this.getRecyclingFundGraphQLClient(user).recyclingFundQuery({
      body: { query: '{skilavottordRestVehicles{ permno }}' },
      // body: { query: '{skilavottordVehicles{ permno }}' },
    })
  }
}
