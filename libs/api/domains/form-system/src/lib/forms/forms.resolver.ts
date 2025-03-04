import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { FormsService } from './forms.service'
import {
  DeleteFormInput,
  GetFormInput,
  UpdateFormInput,
} from '../../dto/form.input'
import { FormResponse } from '../../models/form.model'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class FormsResolver {
  constructor(private readonly formsService: FormsService) { }

  @Mutation(() => FormResponse, {
    name: 'createFormSystemForm',
  })
  async createForm(
    @CurrentUser() user: User,
  ): Promise<FormResponse> {
    return this.formsService.createForm(user)
  }

  @Mutation(() => Boolean, {
    name: 'deleteFormSystemForm',
    nullable: true,
  })
  async deleteForm(
    @Args('input', { type: () => DeleteFormInput }) input: DeleteFormInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.formsService.deleteForm(user, input)
  }

  @Query(() => FormResponse, {
    name: 'formSystemForm',
  })
  async getForm(
    @Args('input', { type: () => GetFormInput }) id: GetFormInput,
    @CurrentUser() user: User,
  ): Promise<FormResponse> {
    return this.formsService.getForm(user, id)
  }

  @Query(() => FormResponse, {
    name: 'formSystemGetAllForms',
  })
  async getAllForms(
    @CurrentUser() user: User,
  ): Promise<FormResponse> {
    return this.formsService.getAllForms(user)
  }

  @Mutation(() => Boolean, {
    name: 'updateFormSystemForm',
    nullable: true,
  })
  async updateForm(
    @Args('input', { type: () => UpdateFormInput }) input: UpdateFormInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.formsService.updateForm(user, input)
  }
}
