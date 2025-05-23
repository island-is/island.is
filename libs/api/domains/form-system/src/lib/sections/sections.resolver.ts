import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { SectionsService } from './sections.service'
import {
  CreateSectionInput,
  DeleteSectionInput,
  UpdateSectionInput,
  UpdateSectionsDisplayOrderInput,
} from '../../dto/section.input'
import { Section } from '../../models/section.model'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class SectionsResolver {
  constructor(private readonly sectionsService: SectionsService) {}

  @Mutation(() => Section, {
    name: 'createFormSystemSection',
  })
  async createSection(
    @Args('input', { type: () => CreateSectionInput })
    input: CreateSectionInput,
    @CurrentUser() user: User,
  ): Promise<Section> {
    return this.sectionsService.createSection(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'deleteFormSystemSection',
    nullable: true,
  })
  async deleteSection(
    @Args('input', { type: () => DeleteSectionInput })
    input: DeleteSectionInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.sectionsService.deleteSection(user, input)
  }

  @Mutation(() => Section, {
    name: 'updateFormSystemSection',
    nullable: true,
  })
  async updateSection(
    @Args('input', { type: () => UpdateSectionInput })
    input: UpdateSectionInput,
    @CurrentUser() user: User,
  ): Promise<Section> {
    return this.sectionsService.updateSection(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'updateFormSystemSectionsDisplayOrder',
    nullable: true,
  })
  async updateSectionsDisplayOrder(
    @Args('input', { type: () => UpdateSectionsDisplayOrderInput })
    input: UpdateSectionsDisplayOrderInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.sectionsService.updateSectionsDisplayOrder(user, input)
  }
}
