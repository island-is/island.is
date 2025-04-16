import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { BadRequestException, UseGuards } from '@nestjs/common'
import { ApiScope } from '@island.is/auth/scopes'
import { Args, Query, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { WorkMachinesService } from '../workMachines.service'
import { TypeClassification } from '../models/typeList.model'
import { GetWorkMachineTypeClassificationInput } from '../dto/getTypeClassification.input'
import { Locale } from '@island.is/shared/types'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver(() => TypeClassification)
@Audit({ namespace: '@island.is/api/work-machines' })
export class TypeClassificationResolver {
  constructor(private readonly workMachinesService: WorkMachinesService) {}

  @Scopes(ApiScope.workMachines)
  @Query(() => TypeClassification, {
    name: 'workMachinesTypeClassification',
    nullable: true,
  })
  @Audit()
  async getTypeClassification(
    @CurrentUser() user: User,
    @Args('input', {
      type: () => GetWorkMachineTypeClassificationInput,
      nullable: true,
    })
    input: GetWorkMachineTypeClassificationInput,
  ): Promise<TypeClassification | null> {
    const { typeName } = input

    const isTypeValid = await this.workMachinesService.isTypeValid(
      user,
      typeName,
    )

    if (!isTypeValid) {
      throw new BadRequestException('Invalid type input')
    }

    const models = await this.workMachinesService.getMachineModels(
      user,
      typeName,
      input.locale as Locale,
      input.correlationId,
    )

    return {
      name: typeName,
      models,
    }
  }
}
