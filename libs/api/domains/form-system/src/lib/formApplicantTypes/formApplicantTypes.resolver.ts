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
import { Screen } from '../../models/screen.model'
import {
  CreateApplicantInput,
  DeleteApplicantInput,
} from '../../dto/applicant.input'

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

  @Mutation(() => Screen, {
    name: 'deleteFormSystemApplicantType',
  })
  async deleteFormApplicantType(
    @Args('input', { type: () => DeleteApplicantInput })
    input: DeleteApplicantInput,
    @CurrentUser() user: User,
  ): Promise<Screen> {
    const result = await this.formApplicantTypesService.deleteFormApplicantType(
      user,
      input,
    )
    return result
  }
}
