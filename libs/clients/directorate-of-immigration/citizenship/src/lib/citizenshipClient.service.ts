import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
// import { CitizenshipApi } from '../../gen/fetch/apis'

@Injectable()
export class CitizenshipClient {
  constructor() {}
  // private readonly citizenshipApi: CitizenshipApi

  // private citizenshipApiWithAuth(auth: Auth) {
  //   return this.citizenshipApi.withMiddleware(new AuthMiddleware(auth))
  // }

  public async applyForCitizenship(auth: User): Promise<void> {
    // TODOx waiting for API to be ready
  }
}
