import { Query, Resolver, Args, Mutation } from '@nestjs/graphql'
import {
  MachineDetails,
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
import { ChangeMachineOwner } from './graphql/ownerChange.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class AosahResolver {
  constructor(private readonly aosahApi: AosahApi) {}

  @Scopes(ApiScope.internal, ApiScope.internalProcuring)
  @Query(() => MachineDetails)
  @Audit()
  async machineDetails(
    @CurrentUser() auth: User,
    @Args('input') input: MachineDetailsInput,
  ) {
    return await this.aosahApi.getMachineDetails(auth, input.id)
  }

  @Mutation(() => Boolean)
  async changeMachineOwner(
    @CurrentUser() auth: User,
    @Args('input') input: ChangeMachineOwner,
  ): Promise<boolean> {
    try {
      await this.aosahApi.changeMachineOwner(auth, input)
      return true // Operation was successful
    } catch (error) {
      console.log('changeOwnerChange Error: ', error)
      // Handle errors here
      return false // Operation failed
    }
  }

  @Mutation(() => Boolean)
  async confirmOwnerChange(
    @CurrentUser() auth: User,
    @Args('input') input: ChangeMachineOwner,
  ): Promise<boolean> {
    try {
      await this.aosahApi.confirmOwnerChange(auth, input)
      return true // Operation was successful
    } catch (error) {
      console.log('confirmOwnerChange Error: ', error)
      // Handle errors here
      return false // Operation failed
    }
  }
}
