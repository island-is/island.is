import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { logger } from '@island.is/logging'

import { DocumentProviderService } from './document-provider.service'
import { ClientCredentials, AudienceAndScope, TestResult } from '../models'
import {
  RunEndpointTestsInput,
  UpdateEndpointInput,
  CreateProviderInput,
} from '../dto'
import { AuditService } from '@island.is/nest/audit'

const namespace = '@island.is/api/document-provider'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DocumentProviderResolver {
  constructor(
    private documentProviderService: DocumentProviderService,
    private readonly auditService: AuditService,
  ) {}

  @Mutation(() => ClientCredentials)
  async createTestProvider(
    @Args('input') input: CreateProviderInput,
    @CurrentUser() user: User,
  ): Promise<ClientCredentials> {
    logger.info(
      `createTestProvider: user: ${user.nationalId}, organisation: ${input.nationalId}, clientName: ${input.clientName}`,
    )

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'createTestProvider',
        resources: input.nationalId,
      },
      this.documentProviderService.createProviderOnTest(
        input.nationalId,
        input.clientName,
        user,
      ),
    )
  }

  @Mutation(() => AudienceAndScope)
  async updateTestEndpoint(
    @Args('input') input: UpdateEndpointInput,
    @CurrentUser() user: User,
  ): Promise<AudienceAndScope> {
    logger.info(
      `updateTestEndpoint: user: ${user.nationalId}, organisation: ${input.nationalId}, endpoint: ${input.endpoint}`,
    )

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'updateTestEndpoint',
        resources: input.nationalId,
        meta: { fields: Object.keys(input) },
      },
      this.documentProviderService.updateEndpointOnTest(
        input.nationalId,
        input.endpoint,
        input.providerId,
        input.xroad || false,
        user,
      ),
    )
  }

  @Mutation(() => [TestResult])
  async runEndpointTests(
    @Args('input') input: RunEndpointTestsInput,
    @CurrentUser() user: User,
  ): Promise<TestResult[]> {
    logger.info(
      `runEndpointTests: user: ${user.nationalId}, organisation: ${input.nationalId}, recipient: ${input.recipient}, documentId: ${input.recipient}, providerId: ${input.providerId}`,
    )

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'runEndpointTests',
        resources: input.nationalId,
      },
      this.documentProviderService.runEndpointTests(
        input.nationalId,
        input.recipient,
        input.documentId,
        input.providerId,
        user,
      ),
    )
  }

  @Mutation(() => ClientCredentials)
  async createProvider(
    @Args('input') input: CreateProviderInput,
    @CurrentUser() user: User,
  ): Promise<ClientCredentials> {
    logger.info(
      `createTestProvider: user: ${user.nationalId}, organisation: ${input.nationalId}, clientName: ${input.clientName}`,
    )

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'createProvider',
        resources: input.nationalId,
      },
      this.documentProviderService.createProvider(
        input.nationalId,
        input.clientName,
        user,
      ),
    )
  }

  @Mutation(() => AudienceAndScope)
  async updateEndpoint(
    @Args('input') input: UpdateEndpointInput,
    @CurrentUser() user: User,
  ): Promise<AudienceAndScope> {
    logger.info(
      `updateTestEndpoint: user: ${user.nationalId}, organisation: ${input.nationalId}, endpoint: ${input.endpoint}`,
    )

    return this.auditService.auditPromise(
      {
        auth: user,
        namespace,
        action: 'updateEndpoint',
        resources: input.nationalId,
        meta: { fields: Object.keys(input) },
      },
      this.documentProviderService.updateEndpoint(
        input.nationalId,
        input.endpoint,
        input.providerId,
        input.xroad || false,
        user,
      ),
    )
  }
}
