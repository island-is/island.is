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
  CreateFormCertificationTypeInput,
  DeleteFormCertificationTypeInput,
  FormCertificationTypeDto,
} from '@island.is/form-system-dto'
import { FormCertificationTypesService } from './formCertificationTypes.service'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
@Audit({ namespace: '@island.is/api/form-system' })
export class FormCertificationTypesResolver {
  constructor(
    private readonly formCertificationTypesService: FormCertificationTypesService,
  ) {}

  @Mutation(() => FormCertificationTypeDto, {
    name: 'formSystemCreateFormCertificationType',
  })
  async createFormCertificationType(
    @Args('input', { type: () => CreateFormCertificationTypeInput })
    input: CreateFormCertificationTypeInput,
    @CurrentUser() user: User,
  ): Promise<FormCertificationTypeDto> {
    return this.formCertificationTypesService.createFormCertificationType(
      user,
      input,
    )
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteFormCertificationType',
    nullable: true,
  })
  async deleteFormCertificationType(
    @Args('input', { type: () => DeleteFormCertificationTypeInput })
    input: DeleteFormCertificationTypeInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.formCertificationTypesService.deleteFormCertificationType(
      user,
      input,
    )
  }
}
