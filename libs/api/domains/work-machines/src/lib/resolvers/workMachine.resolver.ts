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
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { WorkMachinesService } from '../workMachines.service'
import { WorkMachine } from '../models/workMachine.model'
import { GetWorkMachineInput } from '../dto/getWorkMachine.input'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver(() => WorkMachine)
@Audit({ namespace: '@island.is/api/work-machines' })
export class WorkMachineResolver {
  constructor(private readonly workMachinesService: WorkMachinesService) {}

  @Scopes(ApiScope.workMachines)
  @Query(() => WorkMachine, {
    name: 'workMachine',
    nullable: true,
  })
  @Audit()
  async getWorkMachine(
    @CurrentUser() user: User,
    @Args('input', {
      type: () => GetWorkMachineInput,
      nullable: true,
    })
    input: GetWorkMachineInput,
  ) {
    return this.workMachinesService.getWorkMachines(user, input)
  }
}
