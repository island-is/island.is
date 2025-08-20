import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { FormApplicantTypesService } from './formApplicantTypes.service'
import { FormApplicantType } from '../../models/formApplicantTypes.model'
import {
  FormApplicantTypeCreateInput,
  FormApplicantTypeDeleteInput,
  FormApplicantTypeUpdateInput,
} from '../../dto/formApplicantType.input'
import { Screen } from '../../models/screen.model'
import { CreateApplicantInput } from '../../dto/applicant.input'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class FormApplicantTypesResolver {
  constructor(
    private readonly formApplicantTypesService: FormApplicantTypesService,
  ) {}

  @Mutation(() => Screen, {
    name: 'createFormSystemApplicantType',
  })
  async createFormApplicantType(
    @Args('input', { type: () => CreateApplicantInput })
    input: CreateApplicantInput,
    @CurrentUser() user: User,
  ): Promise<Screen> {
    const result = await this.formApplicantTypesService.createFormApplicantType(
      user,
      input,
    )
    return result
  }

  @Mutation(() => Boolean, {
    name: 'deleteFormSystemApplicantType',
  })
  async deleteFormApplicantType(
    @Args('input', { type: () => FormApplicantTypeDeleteInput })
    input: FormApplicantTypeDeleteInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.formApplicantTypesService.deleteFormApplicantType(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'updateFormSystemApplicantType',
  })
  async updateFormApplicantType(
    @Args('input', { type: () => FormApplicantTypeUpdateInput })
    input: FormApplicantTypeUpdateInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.formApplicantTypesService.updateFormApplicantType(user, input)
  }
}
