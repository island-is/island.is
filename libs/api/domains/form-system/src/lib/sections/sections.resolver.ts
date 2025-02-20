import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { SectionsService } from './sections.service'
import {
  CreateSectionInput,
  DeleteSectionInput,
  SectionDto,
  UpdateSectionInput,
  UpdateSectionsDisplayOrderInput,
} from '@island.is/form-system-dto'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
@Audit({ namespace: '@island.is/api/form-system' })
export class SectionsResolver {
  constructor(private readonly sectionsService: SectionsService) {}

  @Mutation(() => SectionDto, {
    name: 'formSystemCreateSection',
  })
  async createSection(
    @Args('input', { type: () => CreateSectionInput })
    input: CreateSectionInput,
    @CurrentUser() user: User,
  ): Promise<SectionDto> {
    return this.sectionsService.createSection(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteSection',
    nullable: true,
  })
  async deleteSection(
    @Args('input', { type: () => DeleteSectionInput })
    input: DeleteSectionInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.sectionsService.deleteSection(user, input)
  }

  @Mutation(() => SectionDto, {
    name: 'formSystemUpdateSection',
  })
  async updateSection(
    @Args('input', { type: () => UpdateSectionInput })
    input: UpdateSectionInput,
    @CurrentUser() user: User,
  ): Promise<SectionDto> {
    return this.sectionsService.updateSection(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateSectionsDisplayOrder',
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
