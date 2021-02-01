import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import {
  IdsAuthGuard,
  ScopesGuard,
  CurrentUser,
  User,
} from '@island.is/auth-nest-tools'
import { logger } from '@island.is/logging'

import { DocumentProviderService } from './document-provider.service'
import {
  ClientCredentials,
  AudienceAndScope,
  TestResult,
  Organisation,
  Contact,
  Helpdesk,
} from './models'
import {
  RunEndpointTestsInput,
  UpdateEndpointInput,
  CreateProviderInput,
  UpdateContactInput,
  UpdateHelpdeskInput,
} from './dto'
import { CreateOrganisationInput } from './dto/createOrganisation.input'
import { UpdateOrganisationInput } from './dto/updateOrganisation.input'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Resolver()
export class DocumentProviderResolver {
  constructor(private documentProviderService: DocumentProviderService) {}

  @Query(() => [Organisation])
  async getProviderOrganisations(): Promise<Organisation[]> {
    return this.documentProviderService.getOrganisations()
  }

  @Query(() => Organisation)
  async getProviderOrganisation(
    @Args('nationalId') nationalId: string,
  ): Promise<Organisation> {
    return this.documentProviderService.getOrganisation(nationalId)
  }

  @Mutation(() => Organisation, { nullable: true })
  async createOrganisation(
    @Args('input') input: CreateOrganisationInput,
    @CurrentUser() user: User,
  ): Promise<Organisation | null> {
    logger.info(`createOrganisation: user: ${user.nationalId}`)

    return this.documentProviderService.createOrganisation(input)
  }

  @Mutation(() => Organisation)
  async updateOrganisation(
    @Args('id') id: string,
    @Args('input') input: UpdateOrganisationInput,
    @CurrentUser() user: User,
  ): Promise<Organisation> {
    logger.info(
      `updateTechnicalContact: user: ${user.nationalId}, organisationId: ${id}`,
    )

    return this.documentProviderService.updateOrganisation(id, input)
  }

  @Mutation(() => Contact)
  async updateAdministrativeContact(
    @Args('organisationId') organisationId: string,
    @Args('administrativeContactId') administrativeContactId: string,
    @Args('contact') contact: UpdateContactInput,
    @CurrentUser() user: User,
  ): Promise<Contact> {
    logger.info(
      `updateTechnicalContact: user: ${user.nationalId}, organisationId: ${organisationId}, administrativeContactId: ${administrativeContactId}`,
    )

    return this.documentProviderService.updateAdministrativeContact(
      organisationId,
      administrativeContactId,
      contact,
    )
  }

  @Mutation(() => Contact)
  async updateTechnicalContact(
    @Args('organisationId') organisationId: string,
    @Args('technicalContactId') technicalContactId: string,
    @Args('contact') contact: UpdateContactInput,
    @CurrentUser() user: User,
  ): Promise<Contact> {
    logger.info(
      `updateTechnicalContact: user: ${user.nationalId}, organisationId: ${organisationId}, technicalContactId: ${technicalContactId}`,
    )

    return this.documentProviderService.updateTechnicalContact(
      organisationId,
      technicalContactId,
      contact,
    )
  }

  @Mutation(() => Helpdesk)
  async updateHelpdesk(
    @Args('organisationId') organisationId: string,
    @Args('helpdeskId') helpdeskId: string,
    @Args('helpdesk') helpdesk: UpdateHelpdeskInput,
    @CurrentUser() user: User,
  ): Promise<Helpdesk> {
    logger.info(
      `updateHelpdesk: user: ${user.nationalId}, organisationId: ${organisationId}, helpdeskId: ${helpdeskId}`,
    )

    return this.documentProviderService.updateHelpdesk(
      organisationId,
      helpdeskId,
      helpdesk,
    )
  }

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
