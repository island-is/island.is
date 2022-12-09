import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { DomainsApi } from '@island.is/clients/auth/delegation-api'

import { DomainsInput } from '../dto/domains.input'
import { Domain } from '../models/domain.model'

@Injectable()
export class DomainService {
  constructor(private domainsApi: DomainsApi) {}

  domainsApiWithAuth(auth: Auth): DomainsApi {
    return this.domainsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getDomains(user: User, input: DomainsInput): Promise<Domain[]> {
    return this.domainsApiWithAuth(user).domainsControllerFindAll({
      lang: input.lang,
      direction: input.direction,
    })
  }
}
