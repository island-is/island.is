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
import { FormApplicantTypesService } from './formApplicantTypes.service'
import { FormApplicantType } from '../../models/formApplicantTypes.model'
import { FormApplicantTypeCreateInput, FormApplicantTypeDeleteInput, FormApplicantTypeUpdateInput } from '../../dto/formApplicantType.input'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class FormApplicantTypesResolver {
  constructor(private readonly formApplicantTypesService: FormApplicantTypesService) { }

  @Mutation(() => FormApplicantType, {
    name: 'formSystemCreateFormApplicantType',
  })
  async createFormApplicantType(
    @Args('input', { type: () => FormApplicantTypeCreateInput })
    input: FormApplicantTypeCreateInput,
    @CurrentUser() user: User,
  ): Promise<FormApplicantType> {
    return this.formApplicantTypesService.createFormApplicantType(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteFormApplicantType',
  })
  async deleteFormApplicantType(
    @Args('input', { type: () => FormApplicantTypeDeleteInput })
    input: FormApplicantTypeDeleteInput,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.formApplicantTypesService.deleteFormApplicantType(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateFormApplicantType'
  })
  async updateFormApplicantType(
    @Args('input', { type: () => FormApplicantTypeUpdateInput })
    input: FormApplicantTypeUpdateInput,
    @CurrentUser() user: User
  ): Promise<void> {
    return this.formApplicantTypesService.updateFormApplicantType(user, input)
  }
}