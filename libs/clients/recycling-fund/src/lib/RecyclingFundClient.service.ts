import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { GetVehiclesApi, Vehicles } from '../../gen/fetch'

@Injectable()
export class RecyclingFundClientService {
  constructor(private readonly getVehiclesApi: GetVehiclesApi) {}

  private getVehiclesAPIWithAuth = (user: User) =>
    this.getVehiclesApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getVehicles(user: User): Promise<Array<Vehicles>> {
    return await this.getVehiclesAPIWithAuth(user).applicationGetVehicles()
  }
}
