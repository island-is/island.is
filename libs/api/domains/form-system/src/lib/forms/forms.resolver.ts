import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { FormsService } from './forms.service'
import { CreateFormInput, DeleteFormInput, GetAllFormsInput, GetFormInput } from '../../dto/form.input'
import { FormResponse } from '../../models/form.model'

@Resolver()
@UseGuards(IdsUserGuard)
@Audit({ namespace: '@island.is/api/form-system' })
export class FormsResolver {
  constructor(private readonly formsService: FormsService) { }

  @Mutation(() => Boolean, {
    name: 'formSystemCreateForm',
  })
  async createForm(
    @Args('input', { type: () => CreateFormInput }) input: CreateFormInput,
    @CurrentUser() user: User,
  ): Promise<FormResponse> {
    return this.formsService.createForm(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteForm',
  })
  async deleteForm(
    @Args('input', { type: () => DeleteFormInput }) input: DeleteFormInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.formsService.deleteForm(user, input)
  }

  @Query(() => FormResponse, {
    name: 'formSystemGetForm',
  })
  async getForm(
    @Args('id', { type: () => GetFormInput }) id: GetFormInput,
    @CurrentUser() user: User,
  ): Promise<FormResponse> {
    return this.formsService.getForm(user, id)
  }

  @Query(() => FormResponse, {
    name: 'formSystemGetAllForms',
  })
  async getAllForms(
    @Args('input', { type: () => GetAllFormsInput }) input: GetAllFormsInput,
    @CurrentUser() user: User,
  ): Promise<FormResponse> {
    return this.formsService.getAllForms(user, input)
  }

}
