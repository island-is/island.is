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
import { Model } from '../models/model.model'
import { SubCategory } from '../models/subCategory.model'
import { isDefined } from '@island.is/shared/utils'
import { TechInfoItem } from '../models/techInfoItem'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver(() => SubCategory)
@Audit({ namespace: '@island.is/api/work-machines' })
export class SubCategoryResolver {
  constructor(private readonly workMachinesService: WorkMachinesService) {}

  @ResolveField('techInfoItems', () => [TechInfoItem])
  async resolveTechInfoItems(
    @CurrentUser() user: User,
    @Parent() category: SubCategory,
  ): Promise<Array<Model>> {
    if (!category.parentCategoryName || !category.name) {
      return []
    }
    const technicalInfoInputs =
      await this.workMachinesService.getTechnicalInfoInputs(
        user,
        category.parentCategoryName,
        category.name,
      )

    return technicalInfoInputs
      .map((input) => {
        if (!input.variableName) {
          return null
        }
        return {
          name: input.variableName,
          label: input.label ?? undefined,
          labelEn: input.labelEn ?? undefined,
          type: input.type ?? undefined,
          required: input.required,
          maxLength: input.maxLength ?? undefined,
          itemValues: input.values
            ?.map((v) => v.name ?? undefined)
            .filter(isDefined),
          values: input.values?.map((v) => ({
            name: v.name ?? undefined,
            nameEn: v.nameEn ?? undefined,
          })),
        }
      })
      .filter(isDefined)
  }
}
