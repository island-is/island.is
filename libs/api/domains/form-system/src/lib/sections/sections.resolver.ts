import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { SectionsService } from './sections.service'
import { CreateSectionInput, DeleteSectionInput, UpdateSectionInput, UpdateSectionsDisplayOrderInput } from '../../dto/section.input'

@Resolver()
@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/form-system' })
export class SectionsResolver {
  constructor(private readonly sectionsService: SectionsService) { }

  @Mutation(() => Boolean, {
    name: 'formSystemCreateSection',
  })
  async createSection(
    @Args('input', { type: () => CreateSectionInput }) input: CreateSectionInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.sectionsService.createSection(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteSection',
  })
  async deleteSection(
    @Args('input', { type: () => DeleteSectionInput }) input: DeleteSectionInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.sectionsService.deleteSection(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateSection',
  })
  async updateSection(
    @Args('input', { type: () => UpdateSectionInput }) input: UpdateSectionInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.sectionsService.updateSection(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateSectionsDisplayOrder',
  })
  async updateSectionsDisplayOrder(
    @Args('input', { type: () => UpdateSectionsDisplayOrderInput }) input: UpdateSectionsDisplayOrderInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.sectionsService.updateSectionsDisplayOrder(user, input)
  }
}
