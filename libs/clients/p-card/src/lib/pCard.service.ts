import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
import { StaediskortaMalApi, Staediskortamal } from '../../gen/fetch'

@Injectable()
export class PCardService {
  constructor(private readonly api: StaediskortaMalApi) {}

  private apiWithAuth = (user: User) =>
    this.api.withMiddleware(new AuthMiddleware(user as Auth))

  public async getPCard(user: User): Promise<Staediskortamal> {
    return this.apiWithAuth(user).staediskortaMalGetStaediskortToken()
  }
}
