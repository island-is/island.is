import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'

import { SessionsInput } from '../dto/sessions.input'
import { SessionsApi, SessionsResultDto } from '@island.is/clients/sessions'

@Injectable()
export class SessionsService {
  constructor(private readonly sessionsApi: SessionsApi) {}

  sessionsApiWithAuth(auth: Auth) {
    return this.sessionsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getSessions(user: User, input: SessionsInput): Promise<SessionsResultDto> {
    return this.sessionsApiWithAuth(user).sessionsControllerFindAll({
      xQueryOtherUser: input.nationalId ?? '',
      after: input.after,
      before: input.before,
      limit: input.limit,
      order: input.order,
      from: input.fromDate,
      to: input.toDate,
    })
  }
}
