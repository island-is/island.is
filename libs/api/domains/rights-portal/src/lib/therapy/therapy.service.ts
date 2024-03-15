import { Injectable } from '@nestjs/common'
import { TherapyApi } from '@island.is/clients/icelandic-health-insurance/rights-portal'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { handle404 } from '@island.is/clients/middlewares'

@Injectable()
export class TherapyService {
  constructor(private api: TherapyApi) {}
  getTherapies = (user: User) => {
    return this.api
      .withMiddleware(new AuthMiddleware(user as Auth))
      .getTherapies()
      .catch(handle404)
  }
}
