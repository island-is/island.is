import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
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
import { ChangeMachineSupervisor } from './graphql/changeMachineSupervisor.input'

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

  @Mutation(() => Boolean)
  async changeMachineSupervisor(
    @CurrentUser() auth: User,
    @Args('input') input: ChangeMachineSupervisor,
  ): Promise<boolean> {
    try {
      await this.aoshApi.changeMachineSupervisor(auth, input)
      return true // Operation was successful
    } catch (error) {
      console.log('changeMachineSupervisor Error: ', error)
      // Handle errors here
      return false // Operation failed
    }
  }
}
