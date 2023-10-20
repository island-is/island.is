import { Query, Resolver, Args } from '@nestjs/graphql'
import {
  MachineDetailsDto,
  MachineDetailsInput,
} from './graphql/machineDetails.input'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { AosahApi } from './aosah.service'
import { ApiScope } from '@island.is/auth/scopes'
import { UseGuards } from '@nestjs/common'
import { Audit } from '@island.is/nest/audit'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class AosahResolver {
  constructor(private readonly aosahApi: AosahApi) {}

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => MachineDetailsDto)
  @Audit()
  async machineDetails(
    @CurrentUser() auth: User,
    @Args('input') input: MachineDetailsInput,
  ) {
    return await this.aosahApi.getMachineDetails(auth, input.id)
  }
}
