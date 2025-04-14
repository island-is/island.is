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
import { GetWorkMachineModelsInput } from '../dto/getModels.input'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver(() => ModelCollection)
@Audit({ namespace: '@island.is/api/work-machines' })
export class ModelCollection {
  constructor(private readonly workMachinesService: WorkMachinesService) {}

  @Scopes(ApiScope.workMachines)
  @Query(() => ModelCollection, {
    name: 'workMachinesModelCollection',
    nullable: true,
  })
  @Audit()
  async getModelCollection(
    @CurrentUser() user: User,
    @Args('input', {
      type: () => GetWorkMachineModelsInput,
    })
    input: GetWorkMachineModelsInput,
  ) {
    const models = await this.workMachinesService.getMachineModels(
      user,
      input.type,
    )

    return {
      models,
    }
  }
}
