import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql'

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
import { CreateCertificatePaymentIntentInput } from '../dto/createCertificatePaymentIntent.input'
import { CreateCertificateRequestInput } from '../dto/createCertificateRequest.input'
import { HealthDirectorateCertificate } from '../models/certificate.model'
import { HealthDirectorateCertificateRequest } from '../models/certificateRequest.model'
import { HealthDirectoratePayment } from '../models/payment.model'
import { HealthDirectoratePaymentIntent } from '../models/paymentIntent.model'

@CodeOwner(CodeOwners.Hugsmidjan)
@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace: '@island.is/api/health-directorate' })
@Resolver(() => HealthDirectorateCertificate)
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
    @Args('input') input: CreateCertificateRequestInput,
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

  @Mutation(() => HealthDirectoratePaymentIntent, {
    name: 'healthDirectorateCreateCertificatePaymentIntent',
    nullable: true,
  })
  @Audit()
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  createCertificatePaymentIntent(
    @Args('input') input: CreateCertificatePaymentIntentInput,
    @CurrentUser() user: User,
  ): Promise<HealthDirectoratePaymentIntent | null> {
    return this.api.createCertificatePaymentIntent(user, input)
  }

  @Query(() => HealthDirectoratePayment, {
    name: 'healthDirectoratePayment',
    nullable: true,
    description:
      'FE polls this after browser-return from the payment page until status becomes SUCCEEDED.',
  })
  @Audit()
  @Scopes(ApiScope.health)
  @FeatureFlag(Features.isServicePortalHealthMessagesPageEnabled)
  getPayment(
    @Args('id', { type: () => ID }) id: string,
    @CurrentUser() user: User,
  ): Promise<HealthDirectoratePayment | null> {
    return this.api.getPayment(user, id)
  }
}
