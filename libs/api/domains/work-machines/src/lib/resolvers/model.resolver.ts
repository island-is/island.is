import {
  CurrentUser,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { UseGuards } from '@nestjs/common'
import { Args, Parent, ResolveField, Resolver } from '@nestjs/graphql'
import { Audit } from '@island.is/nest/audit'
import { FeatureFlagGuard } from '@island.is/nest/feature-flags'
import { WorkMachinesService } from '../workMachines.service'
import { Model } from '../models/model.model'
import { Category } from '../models/category.model'
import { ModelDto } from '../workMachines.types'
import { GetWorkMachineModelCategoriesInput } from '../dto/getModelCategories.input'
import { ModelCategory, ModelSubCategory } from '../dto/modelCategory.dto'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Resolver(() => Model)
@Audit({ namespace: '@island.is/api/work-machines' })
export class ModelResolver {
  constructor(private readonly workMachinesService: WorkMachinesService) {}

  @ResolveField('categories', () => [Category], { nullable: true })
  async resolveCategories(
    @CurrentUser() user: User,
    @Parent() model: ModelDto,
    @Args('input', {
      type: () => GetWorkMachineModelCategoriesInput,
      nullable: true,
    })
    input: GetWorkMachineModelCategoriesInput,
  ): Promise<Array<Category> | undefined> {
    if (!input?.populateCategoriesForModels?.includes(model.name)) {
      return undefined
    }

    const data =
      await this.workMachinesService.getMachineParentCategoriesTypeModelGet(
        user,
        {
          model: model.name,
          type: model.type,
        },
        model.locale,
        model.correlationId,
      )

    const categories: Array<ModelCategory> = []
    data.map((cat) => {
      if (!cat.name) {
        return
      }
      const existingCategoryIndex = categories.findIndex(
        (c) => c.name === cat.name,
      )
      if (existingCategoryIndex === -1) {
        const subCategories: Array<ModelSubCategory> = cat.subCategoryName
          ? [
              {
                name: cat.subCategoryName,
                nameEn: cat.subCategoryNameEn ?? undefined,
                parentCategoryName: cat.name ?? undefined,
                parentCategoryNameEn: cat.nameEn ?? undefined,
                registrationNumberPrefix:
                  cat.registrationNumberPrefix ?? undefined,
                locale: cat.locale,
                correlationId: cat.correlationId,
              },
            ]
          : []

        categories.push({
          name: cat.name,
          nameEn: cat.nameEn ?? undefined,
          registrationNumberPrefix: cat.registrationNumberPrefix ?? undefined,
          subCategories,
          locale: cat.locale,
          correlationId: cat.correlationId,
        })
      } else {
        const existingCategorySubCategories: Array<ModelSubCategory> =
          (categories[existingCategoryIndex]
            .subCategories as Array<ModelSubCategory>) ?? []

        if (!cat.subCategoryName) {
          return
        }

        const subCat: ModelSubCategory = {
          name: cat.subCategoryName ?? undefined,
          nameEn: cat.subCategoryNameEn ?? undefined,
          parentCategoryName: cat.name,
          parentCategoryNameEn: cat.nameEn ?? undefined,
          registrationNumberPrefix: cat.registrationNumberPrefix ?? undefined,
          locale: cat.locale,
          correlationId: cat.correlationId,
        }

        existingCategorySubCategories.push(subCat)
      }
    })

    return categories
  }
}
