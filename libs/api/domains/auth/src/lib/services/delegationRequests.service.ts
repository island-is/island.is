import { Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  DelegationRequestDTO,
  MeDelegationRequestsApi,
  DelegationRequestsControllerFindAllDirectionEnum,
} from '@island.is/clients/auth/delegation-api'

import { CreateDelegationRequestInput } from '../dto/createDelegationRequest.input'

@Injectable()
export class DelegationRequestsService {
  constructor(private delegationRequestsApi: MeDelegationRequestsApi) {}

  private withAuth(auth: Auth) {
    return this.delegationRequestsApi.withMiddleware(new AuthMiddleware(auth))
  }

  getOutgoing(user: User): Promise<DelegationRequestDTO[]> {
    return this.withAuth(user).delegationRequestsControllerFindAll({
      direction: DelegationRequestsControllerFindAllDirectionEnum.outgoing,
    })
  }

  getIncoming(user: User): Promise<DelegationRequestDTO[]> {
    return this.withAuth(user).delegationRequestsControllerFindAll({
      direction: DelegationRequestsControllerFindAllDirectionEnum.incoming,
    })
  }

  getById(user: User, requestId: string): Promise<DelegationRequestDTO> {
    return this.withAuth(user).delegationRequestsControllerFindOne({ requestId })
  }

  create(
    user: User,
    input: CreateDelegationRequestInput,
  ): Promise<DelegationRequestDTO> {
    return this.withAuth(user).delegationRequestsControllerCreate({
      createDelegationRequestDTO: {
        toGranterNationalId: input.toGranterNationalId,
        domainName: input.domainName,
        relationship: input.relationship,
        reason: input.reason,
        scopes: input.scopes.map((scope) => ({
          scopeName: scope.scopeName,
          validTo: scope.validTo ?? null,
        })),
      },
    })
  }

  reject(user: User, requestId: string): Promise<DelegationRequestDTO> {
    return this.withAuth(user).delegationRequestsControllerReject({ requestId })
  }

  cancel(user: User, requestId: string): Promise<DelegationRequestDTO> {
    return this.withAuth(user).delegationRequestsControllerCancel({ requestId })
  }

  fulfill(
    user: User,
    requestId: string,
    delegationId: string,
  ): Promise<DelegationRequestDTO> {
    return this.withAuth(user).delegationRequestsControllerFulfill({
      requestId,
      fulfillDelegationRequestDTO: { delegationId },
    })
  }
}
