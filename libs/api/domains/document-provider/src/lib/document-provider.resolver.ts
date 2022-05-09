import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
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
  ProviderStatistics,
} from './models'
import {
  RunEndpointTestsInput,
  UpdateEndpointInput,
  CreateProviderInput,
  UpdateContactInput,
  UpdateHelpdeskInput,
  CreateContactInput,
  CreateHelpdeskInput,
  StatisticsInput,
} from './dto'
import { UpdateOrganisationInput } from './dto/updateOrganisation.input'
import { AdminGuard } from './utils/admin.guard'
import { AuditService } from '@island.is/nest/audit'

const namespace = '@island.is/api/document-provider'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class DocumentProviderResolver {
  constructor(
    private documentProviderService: DocumentProviderService,
    private readonly auditService: AuditService,
  ) {}

  @UseGuards(AdminGuard)
  @Query(() => [Organisation])
  async getProviderOrganisations(
    @CurrentUser() user: User,
  ): Promise<Organisation[]> {
    return this.documentProviderService.getOrganisations(user)
  }

  @UseGuards(AdminGuard)
  @Query(() => Organisation)
  async getProviderOrganisation(
    @Args('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ): Promise<Organisation> {
    return this.documentProviderService.getOrganisation(nationalId, user)
  }

  @Query(() => Boolean)
  async organisationExists(
    @Args('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ): Promise<boolean> {
    return await this.documentProviderService.organisationExists(
      nationalId,
      user,
    )
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Organisation)
  async updateOrganisation(
    @Args('id') id: string,
    @Args('input') input: UpdateOrganisationInput,
    @CurrentUser() user: User,
  ): Promise<Organisation> {
    logger.info(
      `updateTechnicalContact: user: ${user.nationalId}, organisationId: ${id}`,
    )

    return this.documentProviderService.updateOrganisation(id, input, user)
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Contact, { nullable: true })
  async createAdministrativeContact(
    @Args('organisationId') organisationId: string,
    @Args('input') input: CreateContactInput,
    @CurrentUser() user: User,
  ): Promise<Contact | null> {
    logger.info(`createAdministrativeContact: user: ${user.nationalId}`)

    return this.documentProviderService.createAdministrativeContact(
      organisationId,
      input,
      user,
    )
  }

  @UseGuards(AdminGuard)
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
      user,
    )
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Contact, { nullable: true })
  async createTechnicalContact(
    @Args('organisationId') organisationId: string,
    @Args('input') input: CreateContactInput,
    @CurrentUser() user: User,
  ): Promise<Contact | null> {
    logger.info(`createTechnicalContact: user: ${user.nationalId}`)

    return this.documentProviderService.createTechnicalContact(
      organisationId,
      input,
      user,
    )
  }

  @UseGuards(AdminGuard)
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
      user,
    )
  }

  @UseGuards(AdminGuard)
  @Mutation(() => Helpdesk, { nullable: true })
  async createHelpdesk(
    @Args('organisationId') organisationId: string,
    @Args('input') input: CreateHelpdeskInput,
    @CurrentUser() user: User,
  ): Promise<Helpdesk | null> {
    logger.info(`createHelpdesk: user: ${user.nationalId}`)

    return this.documentProviderService.createHelpdesk(
      organisationId,
      input,
      user,
    )
  }

  @UseGuards(AdminGuard)
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
      user,
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

  @UseGuards(AdminGuard)
  @Query(() => ProviderStatistics)
  async getStatisticsTotal(
    @Args('input', { nullable: true }) input: StatisticsInput,
    @CurrentUser() user: User,
  ): Promise<ProviderStatistics> {
    return this.documentProviderService.getStatisticsTotal(
      user,
      input?.organisationId,
      input?.fromDate,
      input?.toDate,
    )
  }
}
