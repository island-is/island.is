import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { WorkMachine, WorkMachineEntity } from './models/getWorkMachines'
import { WorkMachinesService } from './api-domains-work-machines.service'
import { WorkMachineInput } from './dto/getWorkMachineById.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
@Audit({ namespace: '@island.is/api/workMachines' })
export class WorkMachinesResolver {
  constructor(private readonly workMachinesService: WorkMachinesService) {}

  @Scopes(ApiScope.internal)
  @Query(() => WorkMachineEntity, {
    name: 'workMachinesWorkMachineEntity',
    nullable: true,
  })
  @Audit()
  async getWorkMachines(@CurrentUser() user: User) {
    return this.workMachinesService.getWorkMachines(user)
  }

  @Scopes(ApiScope.internal)
  @Query(() => WorkMachine, { name: 'workMachinesWorkMachine', nullable: true })
  @Audit()
  async getWorkMachineById(
    @CurrentUser() user: User,
    @Args('input', { type: () => WorkMachineInput })
    input: WorkMachineInput,
  ) {
    return this.workMachinesService.getWorkMachineById(
      user,
      input.id,
      input.locale,
    )
  }
}
