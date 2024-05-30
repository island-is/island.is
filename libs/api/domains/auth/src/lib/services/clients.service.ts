import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { ClientDto, ClientsApi } from '@island.is/clients/auth/delegation-api'

interface ClientsInput {
  lang: string
  clientIds: string[]
}

@Injectable()
export class ClientsService {
  constructor(private clientsApi: ClientsApi) {}

  private clientsApiWithAuth(auth: Auth) {
    return this.clientsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getClients(user: User, input: ClientsInput): Promise<ClientDto[]> {
    return this.clientsApiWithAuth(user).clientsControllerFindAll({
      lang: input.lang,
      clientId: input.clientIds,
    })
  }
}
