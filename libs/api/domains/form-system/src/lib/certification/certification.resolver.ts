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
  // OrganizationCertificationTypeUpdateInput,
  OrganizationPermissionUpdateInput,
} from '../../dto/certification.input'
import {
  FormCertificationTypeDto,
  OrganizationPermissionDto,
} from '../../models/certification.model'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class CertificationsResolver {
  constructor(private readonly certificationsService: CertificationsService) {}

  @Mutation(() => FormCertificationTypeDto, {
    name: 'formSystemCreateCertification',
  })
  async createCertification(
    @Args('input', { type: () => CreateCertificationInput })
    input: CreateCertificationInput,
    @CurrentUser() user: User,
  ): Promise<FormCertificationTypeDto> {
    return this.certificationsService.createCertification(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteCertification',
    nullable: true,
  })
  async deleteCertification(
    @Args('input', { type: () => DeleteCertificationInput })
    input: DeleteCertificationInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.certificationsService.deleteCertification(user, input)
  }

  @Mutation(() => OrganizationPermissionDto, {
    name: 'formSystemCreateOrganizationPermission',
  })
  async createOrganizationPermission(
    @Args('input', { type: () => OrganizationPermissionUpdateInput })
    input: OrganizationPermissionUpdateInput,
    @CurrentUser() user: User,
  ): Promise<OrganizationPermissionDto> {
    return this.certificationsService.createOrganizationPermission(user, input)
  }

  @Mutation(() => Boolean, {
    name: 'formSystemDeleteOrganizationPermission',
    nullable: true,
  })
  async deleteOrganizationPermission(
    @Args('input', { type: () => OrganizationPermissionUpdateInput })
    input: OrganizationPermissionUpdateInput,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.certificationsService.deleteOrganizationPermission(user, input)
  }
}
