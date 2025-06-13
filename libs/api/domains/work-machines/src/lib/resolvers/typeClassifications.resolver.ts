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
import { Locale } from '@island.is/shared/types'
import { TypeClassifications } from '../models/typeClassificationCollection.model'
import { GetWorkMachineTypeClassificationsInput } from '../dto/getTypeClassifications.input'
import { isDefined } from '@island.is/shared/utils'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver(() => TypeClassifications)
@Audit({ namespace: '@island.is/api/work-machines' })
export class TypeClassificationsResolver {
  constructor(private readonly workMachinesService: WorkMachinesService) {}

  @Scopes(ApiScope.workMachines)
  @Query(() => TypeClassifications, {
    name: 'workMachinesTypeClassifications',
    nullable: true,
  })
  @Audit()
  async getTypeClassifications(
    @CurrentUser() user: User,
    @Args('input', {
      type: () => GetWorkMachineTypeClassificationsInput,
      nullable: true,
    })
    input?: GetWorkMachineTypeClassificationsInput,
  ): Promise<TypeClassifications | null> {
    const { locale, correlationId } = input ?? {
      locale: undefined,
      correlationId: undefined,
    }

    const types = await this.workMachinesService.getMachineTypes(
      user,
      locale ? (locale as Locale) : undefined,
      correlationId,
    )

    return {
      typeNames: types.map((m) => m.name).filter(isDefined),
    }
  }
}
