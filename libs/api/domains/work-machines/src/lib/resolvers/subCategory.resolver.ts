import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { WorkMachinesService } from '../workMachines.service'
import { SubCategory } from '../models/subCategory.model'
import { TechInfoItem } from '../models/techInfoItem.model'
import { type ModelSubCategory } from '../dto/modelSubCategory.dto'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver(() => SubCategory)
@Audit({ namespace: '@island.is/api/work-machines' })
export class SubCategoryResolver {
  constructor(private readonly workMachinesService: WorkMachinesService) {}

  @ResolveField('techInfoItems', () => [TechInfoItem], { nullable: true })
  async resolveTechInfoItems(
    @CurrentUser() user: User,
    @Parent() category: ModelSubCategory,
  ): Promise<Array<TechInfoItem> | undefined> {
    if (!category.parentCategoryName || !category.name) {
      return []
    }

    return await this.workMachinesService.getTechnicalInfoInputs(
      user,
      category.parentCategoryName,
      category.name,
      category.locale,
      category.correlationId,
    )
  }
}
