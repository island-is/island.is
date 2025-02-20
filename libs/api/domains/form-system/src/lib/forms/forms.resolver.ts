import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { FormsService } from './forms.service'
import {
  DeleteFormInput,
  FormResponseDto,
  GetFormInput,
  UpdateFormInput,
} from '@island.is/form-system-dto'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
@Audit({ namespace: '@island.is/api/form-system' })
export class FormsResolver {
  constructor(private readonly formsService: FormsService) {}

  @Mutation(() => FormResponseDto, {
    name: 'formSystemCreateForm',
  })
  async createForm(@CurrentUser() user: User): Promise<FormResponseDto> {
    return this.formsService.createForm(user)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteForm',
    nullable: true,
  })
  async deleteForm(
    @Args('input', { type: () => DeleteFormInput }) input: DeleteFormInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.formsService.deleteForm(user, input)
  }

  @Query(() => FormResponseDto, {
    name: 'formSystemGetForm',
  })
  async getForm(
    @Args('input', { type: () => GetFormInput }) id: GetFormInput,
    @CurrentUser() user: User,
  ): Promise<FormResponseDto> {
    return this.formsService.getForm(user, id)
  }

  @Query(() => FormResponseDto, {
    name: 'formSystemGetAllForms',
  })
  async getAllForms(@CurrentUser() user: User): Promise<FormResponseDto> {
    return this.formsService.getAllForms(user)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateForm',
    nullable: true,
  })
  async updateForm(
    @Args('input', { type: () => UpdateFormInput }) input: UpdateFormInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.formsService.updateForm(user, input)
  }
}
