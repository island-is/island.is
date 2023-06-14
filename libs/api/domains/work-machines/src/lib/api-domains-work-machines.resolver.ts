import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { WorkMachine, WorkMachineCollection } from './models/getWorkMachines'
import { WorkMachinesService } from './api-domains-work-machines.service'
import { GetWorkMachineInput } from './dto/getWorkMachine.input'
import { GetWorkMachineCollectionInput } from './dto/getWorkMachineCollection.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/workMachines' })
export class WorkMachinesResolver {
  constructor(private readonly workMachinesService: WorkMachinesService) {}

  @Scopes(ApiScope.internal)
  @Query(() => WorkMachineCollection, {
    name: 'workMachinesWorkMachineCollection',
    nullable: true,
  })
  @Audit()
  async getWorkMachines(
    @CurrentUser() user: User,
    @Args('input', {
      type: () => GetWorkMachineCollectionInput,
      nullable: true,
    })
    input: GetWorkMachineCollectionInput,
  ) {
    return this.workMachinesService.getWorkMachines(user, input)
  }

  @Scopes(ApiScope.internal)
  @Query(() => WorkMachine, { name: 'workMachinesWorkMachine', nullable: true })
  @Audit()
  async getWorkMachineById(
    @CurrentUser() user: User,
    @Args('input', { type: () => GetWorkMachineInput })
    input: GetWorkMachineInput,
  ) {
    return this.workMachinesService.getWorkMachineById(user, input)
  }
}
