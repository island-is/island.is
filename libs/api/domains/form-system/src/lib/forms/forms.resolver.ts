import { Args, Mutation, Query, Resolver } from "@nestjs/graphql"
import { FormsService } from "./forms.service"
import { FormResponse } from "../../models/formResponse.model"
import { CreateFormInput, GetFormInput, GetFormsInput, UpdateFormInput, DeleteFormInput } from "../../dto/forms.input"
import { CurrentUser, type User } from '@island.is/auth-nest-tools'
import { FormListResponse } from "../../models/formListResponse.model"


@Resolver()
export class FormsResolver {
  constructor(private readonly formsService: FormsService) { }

  @Query(() => FormResponse, {
    name: 'formSystemGetForm'
  })
  async getForm(
    @Args('input', { type: () => GetFormInput }) input: GetFormInput,
    @CurrentUser() user: User
  ): Promise<FormResponse> {
    return this.formsService.getForm(user, input)
  }

  @Query(() => FormListResponse, {
    name: 'formSystemGetForms'
  })
  async getForms(
    @Args('input', { type: () => GetFormsInput }) input: GetFormsInput,
    @CurrentUser() user: User
  ): Promise<FormListResponse> {
    return this.formsService.getForms(user, input)
  }

  @Mutation(() => FormResponse, {
    name: 'formSystemCreateForm'
  })
  async createForm(
    @Args('input', { type: () => CreateFormInput }) input: CreateFormInput,
    @CurrentUser() user: User
  ): Promise<FormResponse> {
    return this.formsService.postForm(user, input)
  }

  @Mutation(() => FormResponse, {
    name: 'formSystemUpdateForm'
  })
  async updateForm(
    @Args('input', { type: () => UpdateFormInput }) input: UpdateFormInput,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.formsService.updateForm(user, input)
  }

  @Mutation(() => FormResponse, {
    name: 'formSystemDeleteForm'
  })
  async deleteForm(
    @Args('input', { type: () => DeleteFormInput }) input: DeleteFormInput,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.formsService.deleteForm(user, input)
  }


}


