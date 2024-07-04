import { AuditService } from '@island.is/nest/audit'
import { UseGuards } from '@nestjs/common'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Contact, Helpdesk, Organisation, ProviderStatistics } from '../models'
import { AdminDocumentProviderService } from './admin-document-provider.service'
import {
  CreateContactInput,
  CreateHelpdeskInput,
  StatisticsInput,
  UpdateContactInput,
  UpdateHelpdeskInput,
  UpdateOrganisationInput,
} from '../dto'
import { logger } from '@island.is/logging'
import { DocumentProviderPaperMailResponse } from '../models/PaperMail.model'
import {
  DocumentProviderCategory,
  DocumentProviderType,
} from '../models/DocumentTypes.model'
import {
  DocumentProviderCategoriesAndTypesPutInput,
  DocumentProviderCategoriesAndTypesPostInput,
} from '../dto/mutateCategoryOrType.input'
import { DocumentProviderPaperMailInput } from '../dto/paperMail.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver()
export class AdminDocumentProviderResolver {
  constructor(
    private documentProviderService: AdminDocumentProviderService,
    private readonly auditService: AuditService,
  ) {}

  @Scopes(AdminPortalScope.documentProvider)
  @Query(() => [Organisation])
  async getProviderOrganisations(
    @CurrentUser() user: User,
  ): Promise<Organisation[]> {
    return this.documentProviderService.getOrganisations(user)
  }

  @Scopes(AdminPortalScope.documentProvider)
  @Query(() => Organisation)
  async getProviderOrganisation(
    @Args('nationalId') nationalId: string,
    @CurrentUser() user: User,
  ): Promise<Organisation> {
    return this.documentProviderService.getOrganisation(nationalId, user)
  }

  @Scopes(AdminPortalScope.documentProvider)
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

  @Scopes(AdminPortalScope.documentProvider)
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

  @Scopes(AdminPortalScope.documentProvider)
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

  @Scopes(AdminPortalScope.documentProvider)
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

  @Scopes(AdminPortalScope.documentProvider)
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

  @Scopes(AdminPortalScope.documentProvider)
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

  @Scopes(AdminPortalScope.documentProvider)
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

  @Scopes(AdminPortalScope.documentProvider)
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

  @Scopes(AdminPortalScope.documentProvider)
  @Query(() => DocumentProviderPaperMailResponse)
  async documentProviderPaperMailList(
    @Args('input', { nullable: true }) input: DocumentProviderPaperMailInput,
  ): Promise<DocumentProviderPaperMailResponse> {
    return this.documentProviderService.getPaperMailList(input)
  }

  // Types
  @Scopes(AdminPortalScope.documentProvider)
  @Query(() => [DocumentProviderType])
  async documentProviderProvidedTypes(): Promise<DocumentProviderType[]> {
    return this.documentProviderService.getDocumentProvidedTypes()
  }

  @Scopes(AdminPortalScope.documentProvider)
  @Mutation(() => DocumentProviderType)
  async documentProviderPostProvidedType(
    @Args('input') input: DocumentProviderCategoriesAndTypesPostInput,
  ): Promise<DocumentProviderType> {
    return this.documentProviderService.postDocumentProvidedType(input)
  }

  @Scopes(AdminPortalScope.documentProvider)
  @Mutation(() => DocumentProviderType)
  async documentProviderPutProvidedType(
    @Args('input') input: DocumentProviderCategoriesAndTypesPutInput,
  ): Promise<DocumentProviderType> {
    return this.documentProviderService.putDocumentProvidedType(input)
  }

  // Categories
  @Scopes(AdminPortalScope.documentProvider)
  @Query(() => [DocumentProviderCategory])
  async documentProviderProvidedCategories(): Promise<
    DocumentProviderCategory[]
  > {
    return this.documentProviderService.getDocumentProvidedCategories()
  }

  @Scopes(AdminPortalScope.documentProvider)
  @Mutation(() => DocumentProviderCategory)
  async documentProviderPostProvidedCategory(
    @Args('input') input: DocumentProviderCategoriesAndTypesPostInput,
  ): Promise<DocumentProviderCategory> {
    return this.documentProviderService.postDocumentProvidedCategory(input)
  }

  @Scopes(AdminPortalScope.documentProvider)
  @Mutation(() => DocumentProviderCategory)
  async documentProviderPutProvidedCategory(
    @Args('input') input: DocumentProviderCategoriesAndTypesPutInput,
  ): Promise<DocumentProviderCategory> {
    return this.documentProviderService.putDocumentProvidedCategory(input)
  }
}
