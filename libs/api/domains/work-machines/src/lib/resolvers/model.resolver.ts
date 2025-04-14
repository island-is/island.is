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
import { Category } from '../models/category.model'
import { ModelDto } from '../workMachines.types'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver(() => Model)
@Audit({ namespace: '@island.is/api/work-machines' })
export class ModelResolver {
  constructor(private readonly workMachinesService: WorkMachinesService) {}

  @ResolveField('categories', () => [Category])
  async resolveCategories(
    @CurrentUser() user: User,
    @Parent() model: ModelDto,
  ): Promise<Array<Category>> {
    const data =
      await this.workMachinesService.getMachineParentCategoriesTypeModelGet(
        user,
        {
          model: model.name,
          type: model.type,
        },
      )

    const categories: Array<Category> = []
    data.forEach((cat) => {
      if (!cat.name) {
        return
      }
      const existingCategoryIndex = categories.findIndex(
        (c) => c.name === cat.name,
      )
      if (existingCategoryIndex === -1) {
        const subCategories = cat.subCategoryName
          ? [
              {
                name: cat.subCategoryName,
                nameEn: cat.subCategoryNameEn ?? undefined,
                parentCategoryName: cat.name ?? undefined,
                parentCategoryNameEn: cat.nameEn ?? undefined,
                registrationNumberPrefix:
                  cat.registrationNumberPrefix ?? undefined,
              },
            ]
          : []

        categories.push({
          name: cat.name,
          nameEn: cat.nameEn ?? undefined,
          registrationNumberPrefix: cat.registrationNumberPrefix ?? undefined,
          subCategories,
        })
      } else {
        const existingCategorySubCategories =
          categories[existingCategoryIndex].subCategories ?? []

        if (!cat.subCategoryName) {
          return
        }

        existingCategorySubCategories.push({
          name: cat.subCategoryName ?? undefined,
          nameEn: cat.subCategoryNameEn ?? undefined,
          parentCategoryName: cat.name,
          parentCategoryNameEn: cat.nameEn ?? undefined,
          registrationNumberPrefix: cat.registrationNumberPrefix ?? undefined,
        })
      }
    })

    return categories
  }
}
