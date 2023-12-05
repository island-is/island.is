import { Query, Resolver, Args } from '@nestjs/graphql'
import { AoshMachineDetails } from './graphql/machineDetails'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { AoshApi } from './aosh.service'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class AoshResolver {
  constructor(private readonly aoshApi: AoshApi) {}

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => AoshMachineDetails)
  @Audit()
  async aoshMachineDetails(@CurrentUser() auth: User, @Args('id') id: string) {
    return this.aoshApi.getMachineDetails(auth, id)
  }

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => Boolean)
  @Audit()
  async aoshMachinePaymentRequired(
    @CurrentUser() auth: User,
    @Args('regNumber') regNumber: string,
  ) {
    return await this.aoshApi.isPaymentRequired(auth, regNumber)
  }
}
