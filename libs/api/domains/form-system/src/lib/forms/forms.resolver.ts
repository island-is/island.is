import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { Loader } from '@island.is/nest/dataloader'
import { CacheControl, CacheControlOptions } from '@island.is/nest/graphql'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { UseGuards } from '@nestjs/common'
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { FormsService } from './forms.service'
import {
  CreateFormInput,
  DeleteFormInput,
  GetFormInput,
  GetFormsInput,
  UpdateFormInput,
} from '../../dto/form.input'
import { UpdateFormResponse } from '@island.is/form-system/dto'
import { Form, FormResponse } from '../../models/form.model'
import {
  OrganizationLinkByReferenceIdLoader,
  OrganizationLinkEnByReferenceIdLoader,
  OrganizationLogoByReferenceIdLoader,
  // OrganizationTitleByNationalIdLoader,
  // OrganizationTitleEnByNationalIdLoader,
} from '@island.is/cms'
import type {
  LogoUrl,
  OrganizationLink,
  OrganizationLinkByReferenceIdDataLoader,
  OrganizationLogoByReferenceIdDataLoader,
  OrganizationTitleByReferenceIdDataLoader,
  ShortTitle,
} from '@island.is/cms'
import {
  OrganizationTitleByNationalIdDataLoader,
  OrganizationTitleByNationalIdLoader,
} from 'libs/cms/src/lib/loaders/organizationTitleByNationalId.loader'
import {
  OrganizationTitleEnByNationalIdDataLoader,
  OrganizationTitleEnByNationalIdLoader,
} from 'libs/cms/src/lib/loaders/organizationTitleEnByNationalId.loader'

@Resolver(() => Form)
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class FormsResolver {
  constructor(private readonly formsService: FormsService) {}

  @Mutation(() => FormResponse, {
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
    nullable: true,
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
    @Args('input', { type: () => GetFormInput }) id: GetFormInput,
    @CurrentUser() user: User,
  ): Promise<FormResponse> {
    return this.formsService.getForm(user, id)
  }

  @Query(() => FormResponse, {
    name: 'formSystemGetAllForms',
  })
  async getAllForms(
    @Args('input', { type: () => GetFormsInput }) input: GetFormsInput,
    @CurrentUser() user: User,
  ): Promise<FormResponse> {
    return this.formsService.getAllForms(user, input)
  }

  @Mutation(() => UpdateFormResponse, {
    name: 'formSystemUpdateForm',
  })
  async updateForm(
    @Args('input', { type: () => UpdateFormInput }) input: UpdateFormInput,
    @CurrentUser() user: User,
  ): Promise<UpdateFormResponse> {
    return this.formsService.updateForm(user, input)
  }

  @CacheControl({ maxAge: 600, scope: 'PUBLIC' })
  @ResolveField('organizationTitle', () => String, { nullable: true })
  async resolveContentfulTitle(
    @Loader(OrganizationTitleByNationalIdLoader)
    organizationTitleLoader: OrganizationTitleByNationalIdDataLoader,
    @Parent() form: Form,
  ): Promise<ShortTitle> {
    if (!form.organizationNationalId) {
      throw new Error('organizationNationalId is undefined')
    }
    return organizationTitleLoader.load(form.organizationNationalId)
  }

  @CacheControl({ maxAge: 600, scope: 'PUBLIC' })
  @ResolveField('organizationTitleEn', () => String, { nullable: true })
  async resolveContentfulTitleEn(
    @Loader(OrganizationTitleEnByNationalIdLoader)
    organizationTitleLoader: OrganizationTitleEnByNationalIdDataLoader,
    @Parent() form: Form,
  ): Promise<ShortTitle> {
    if (!form.organizationNationalId) {
      throw new Error('organizationNationalId is undefined')
    }
    return organizationTitleLoader.load(form.organizationNationalId)
  }
}
