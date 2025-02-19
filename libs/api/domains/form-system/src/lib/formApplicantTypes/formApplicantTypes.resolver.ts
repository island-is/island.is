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
import {
  CreateFormApplicantTypeInput,
  DeleteFormApplicantTypeInput,
  FormApplicantTypeDto,
  UpdateFormApplicantTypeInput,
} from '@island.is/form-system-dto'
import { FormApplicantTypesService } from './formApplicantTypes.service'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
@Audit({ namespace: '@island.is/api/form-system' })
export class FormApplicantTypesResolver {
  constructor(
    private readonly formApplicantTypesService: FormApplicantTypesService,
  ) {}

  @Mutation(() => FormApplicantTypeDto, {
    name: 'formSystemCreateFormApplicantType',
  })
  async createFormApplicantType(
    @Args('input') input: CreateFormApplicantTypeInput,
    @CurrentUser() user: User,
  ): Promise<FormApplicantTypeDto> {
    return this.formApplicantTypesService.createFormApplicantType(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteFormApplicantType',
    nullable: true,
  })
  async deleteFormApplicantType(
    @Args('input') input: DeleteFormApplicantTypeInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.formApplicantTypesService.deleteFormApplicantType(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemUpdateFormApplicantType',
    nullable: true,
  })
  async updateFormApplicantType(
    @Args('input') input: UpdateFormApplicantTypeInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.formApplicantTypesService.updateFormApplicantType(user, input)
  }
}
