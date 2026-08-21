import { Mutation, Args, Resolver } from '@nestjs/graphql'

import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'

import { HealthDirectorateService } from '../health-directorate.service'
import { HealthDirectorateCreateCertificateRequestInput } from '../dto/createCertificateRequest.input'
import { HealthDirectorateCertificateRequest } from '../models/certificateRequest.model'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/health-directorate' })
@Resolver(() => HealthDirectorateCertificateRequest)
export class CertificateResolver {
  constructor(private api: HealthDirectorateService) {}

  @Mutation(() => HealthDirectorateCertificateRequest, {
    name: 'healthDirectorateCreateCertificateRequest',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  createCertificateRequest(
    @Args('input') input: HealthDirectorateCreateCertificateRequestInput,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateCertificateRequest | null> {
    return this.api.createCertificateRequest(user, input)
  }
}
