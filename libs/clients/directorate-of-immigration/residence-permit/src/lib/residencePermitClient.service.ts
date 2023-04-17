import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { Injectable } from '@nestjs/common'
// import { ResidencePermitApi } from '../../gen/fetch/apis'

@Injectable()
export class ResidencePermitClient {
  constructor() {}
  // private readonly residencePermitApi: ResidencePermitApi

  // private residencePermitApiWithAuth(auth: Auth) {
  //   return this.residencePermitApi.withMiddleware(new AuthMiddleware(auth))
  // }

  public async renewResidencePermit(auth: User): Promise<void> {
    // TODOx waiting for API to be ready
  }

  public async applyForPermanentResidencePermit(auth: User): Promise<void> {
    // TODOx waiting for API to be ready
  }
}
