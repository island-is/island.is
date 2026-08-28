import { Mutation, Query, Args, ID, Resolver } from '@nestjs/graphql'

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
import { LocaleEnum } from '@island.is/nest/graphql'

import { HealthDirectorateService } from '../health-directorate.service'
import { HealthDirectorateCreateCertificatePaymentIntentInput } from '../dto/createCertificatePaymentIntent.input'
import { HealthDirectorateCreateCertificateRequestInput } from '../dto/createCertificateRequest.input'
import { HealthDirectorateCertificate } from '../models/certificate.model'
import { HealthDirectorateCertificateRequest } from '../models/certificateRequest.model'
import { HealthDirectorateCertificatePaymentIntent } from '../models/paymentIntent.model'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/health-directorate' })
@Resolver()
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

  @Query(() => HealthDirectorateCertificate, {
    name: 'healthDirectorateCertificate',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  getCertificate(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateCertificate | null> {
    return this.api.getCertificate(user, id)
  }

  @Mutation(() => HealthDirectorateCertificatePaymentIntent, {
    name: 'healthDirectorateCreateCertificatePaymentIntent',
  })
  @Audit()
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  createCertificatePaymentIntent(
    @Args('input') input: HealthDirectorateCreateCertificatePaymentIntentInput,
    @Args('locale', { type: () => LocaleEnum, nullable: true })
    locale: LocaleEnum = LocaleEnum.Is,
    @CurrentUser() user: User,
  ): Promise<HealthDirectorateCertificatePaymentIntent> {
    return this.api.createCertificatePaymentIntent(user, input, locale)
  }
}
