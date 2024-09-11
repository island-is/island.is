import { Injectable } from '@nestjs/common'

import {
  DelegationAdminApi,
  DelegationAdminCustomDto,
} from '@island.is/clients/auth/admin-api'
import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import { CreateDelegationInput } from './dto/createDelegation.input'

@Injectable()
export class DelegationAdminService {
  constructor(private readonly delegationAdminApi: DelegationAdminApi) {}

  delegationsWithAuth(auth: Auth) {
    return this.delegationAdminApi.withMiddleware(new AuthMiddleware(auth))
  }

  async getDelegationAdmin(
    user: User,
    nationalId: string,
  ): Promise<DelegationAdminCustomDto> {
    return await this.delegationsWithAuth(
      user,
    ).delegationAdminControllerGetDelegationAdmin({
      xQueryNationalId: nationalId,
    })
  }

  async deleteDelegationAdmin(
    user: User,
    delegationId: string,
  ): Promise<boolean> {
    try {
      await this.delegationsWithAuth(user).delegationAdminControllerDelete({
        delegationId,
      })

      return true
    } catch {
      return false
    }
  }

  async createDelegationAdmin(user: User, input: CreateDelegationInput) {
    // Mock response
    return Promise.resolve({
      id: 'some-id',
      from: {
        name: 'foo',
        nationalId: '221290-22169',
        type: 'company',
      },
      to: {
        name: 'bar',
        nationalId: '221290-22169',
        type: 'company',
      },
      scopes: [],
      validTo: null,
      type: 'Custom',
      provider: 'delegationdb',
    })
  }
}
