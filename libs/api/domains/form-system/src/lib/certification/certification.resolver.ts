import { UseGuards } from '@nestjs/common'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Args, Mutation, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { CertificationsService } from './certification.service'
import {
  CreateCertificationInput,
  DeleteCertificationInput,
} from '../../dto/certification.input'
import { FormCertificationTypeDto } from '../../models/certification.model'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class CertificationsResolver {
  constructor(private readonly certificationsService: CertificationsService) {}

  @Mutation(() => FormCertificationTypeDto, {
    name: 'createFormSystemCertification',
  })
  async createCertification(
    @Args('input', { type: () => CreateCertificationInput })
    input: CreateCertificationInput,
    @CurrentUser() user: User,
  ): Promise<FormCertificationTypeDto> {
    return this.certificationsService.createCertification(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'deleteFormSystemCertification',
    nullable: true,
  })
  async deleteCertification(
    @Args('input', { type: () => DeleteCertificationInput })
    input: DeleteCertificationInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.certificationsService.deleteCertification(user, input)
  }
}
