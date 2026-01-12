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
import { type ModelDto } from '../workMachines.types'
import { GetWorkMachineModelCategoriesInput } from '../dto/getModelCategories.input'
import { ModelSubCategory } from '../dto/modelSubCategory.dto'

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

    const { name, type, locale, correlationId } = model

    const data =
      (await this.workMachinesService.getMachineParentCategoriesTypeModelGet(
        user,
        {
          model: name,
          type,
        },
        locale,
        correlationId,
      )) ?? []

    const categories: Array<Category> = []

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
                locale,
                correlationId,
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
          locale,
          correlationId,
        }

        existingCategorySubCategories.push(subCat)
      }
    })

    return categories
  }
}
