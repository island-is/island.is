import { Args, Mutation, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { logger } from '@island.is/logging'

import { DocumentProviderService } from './document-provider.service'
import { ClientCredentials, AudienceAndScope, TestResult } from './models'
import {
  RunEndpointTestsInput,
  UpdateEndpointInput,
  CreateProviderInput,
} from './dto'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class DocumentProviderResolver {
  constructor(private documentProviderService: DocumentProviderService) {}

  @Mutation(() => ClientCredentials)
  async createTestProvider(
    @Args('input') input: CreateProviderInput,
    @CurrentUser() user: User,
  ): Promise<ClientCredentials> {
    logger.info(
      `createTestProvider: user: ${user.nationalId}, organisation: ${input.nationalId}, clientName: ${input.clientName}`,
    )

    return this.documentProviderService.createProviderOnTest(
      input.nationalId,
      input.clientName,
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

    return this.documentProviderService.updateEndpointOnTest(
      input.endpoint,
      input.providerId,
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

    return this.documentProviderService.runEndpointTests(
      input.recipient,
      input.documentId,
      input.providerId,
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

    return this.documentProviderService.createProvider(
      input.nationalId,
      input.clientName,
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

    return this.documentProviderService.updateEndpoint(
      input.endpoint,
      input.providerId,
    )
  }
}
