import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
import graphqlTypeJson from 'graphql-type-json'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  ScopesGuard,
  CurrentUser,
  Scopes,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'

import {
  ApplicationTranslationGql,
  ApplicationTranslationStatus,
  GoogleTranslateResultGql,
  TemplateIntrospectionGql,
  TemplateListItemGql,
  TranslationPublishGql,
} from './application-translation.model'
import { ApplicationTranslationApiService } from './application-translation.service'
import { GoogleTranslateService } from './google-translate.service'
import {
  UpdateApplicationTranslationInput,
  BulkUpdateApplicationTranslationsInput,
  GoogleTranslateStringsInput,
  PublishTranslationsInput,
  RollbackTranslationsInput,
} from './dto/application-translation.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => ApplicationTranslationGql)
export class ApplicationTranslationResolver {
  constructor(
    private readonly translationService: ApplicationTranslationApiService,
    private readonly googleTranslateService: GoogleTranslateService,
  ) {}

  @Query(() => [ApplicationTranslationGql], { nullable: true })
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async applicationTranslations(
    @CurrentUser() user: User,
    @Args('namespace') namespace: string,
  ): Promise<ApplicationTranslationGql[]> {
    return this.translationService.getTranslationsByNamespace(user, namespace)
  }

  @Query(() => ApplicationTranslationStatus, { nullable: true })
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async applicationTranslationStatus(
    @CurrentUser() user: User,
    @Args('namespace') namespace: string,
  ): Promise<ApplicationTranslationStatus> {
    return this.translationService.getTranslationStatus(user, namespace)
  }

  @Query(() => [ApplicationTranslationStatus], { nullable: true })
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async applicationTranslationAllStatus(
    @CurrentUser() user: User,
  ): Promise<ApplicationTranslationStatus[]> {
    return this.translationService.getAllNamespacesWithStatus(user)
  }

  @Mutation(() => ApplicationTranslationGql)
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async updateApplicationTranslation(
    @CurrentUser() user: User,
    @Args('input') input: UpdateApplicationTranslationInput,
  ): Promise<ApplicationTranslationGql> {
    return this.translationService.updateTranslation(user, {
      namespace: input.namespace,
      messageKey: input.messageKey,
      valueIs: input.valueIs ?? undefined,
      valueEn: input.valueEn ?? undefined,
    })
  }

  @Mutation(() => [ApplicationTranslationGql])
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async bulkUpdateApplicationTranslations(
    @CurrentUser() user: User,
    @Args('input') input: BulkUpdateApplicationTranslationsInput,
  ): Promise<ApplicationTranslationGql[]> {
    return this.translationService.bulkUpdateTranslations(
      user,
      input.translations.map((t) => ({
        namespace: t.namespace,
        messageKey: t.messageKey,
        valueIs: t.valueIs ?? undefined,
        valueEn: t.valueEn ?? undefined,
      })),
    )
  }

  @Mutation(() => ApplicationTranslationGql)
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async reviewApplicationTranslation(
    @CurrentUser() user: User,
    @Args('id') id: string,
  ): Promise<ApplicationTranslationGql> {
    return this.translationService.reviewTranslation(user, id)
  }

  @Mutation(() => GoogleTranslateResultGql)
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async googleTranslateStrings(
    @Args('input') input: GoogleTranslateStringsInput,
  ): Promise<GoogleTranslateResultGql> {
    const translations = await this.googleTranslateService.translateTexts(
      input.texts,
    )
    return { translations }
  }

  @Mutation(() => TranslationPublishGql)
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async publishApplicationTranslations(
    @CurrentUser() user: User,
    @Args('input') input: PublishTranslationsInput,
  ): Promise<TranslationPublishGql> {
    return this.translationService.publishTranslations(
      user,
      input.namespace,
      input.note ?? undefined,
    )
  }

  @Query(() => [TranslationPublishGql], { nullable: true })
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async applicationTranslationPublishHistory(
    @CurrentUser() user: User,
    @Args('namespace') namespace: string,
  ): Promise<TranslationPublishGql[]> {
    return this.translationService.getPublishHistory(user, namespace)
  }

  @Mutation(() => TranslationPublishGql)
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async rollbackApplicationTranslations(
    @CurrentUser() user: User,
    @Args('input') input: RollbackTranslationsInput,
  ): Promise<TranslationPublishGql> {
    return this.translationService.rollbackTranslations(
      user,
      input.namespace,
      input.publishId,
    )
  }

  @Query(() => [TemplateListItemGql], { nullable: true })
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async applicationTemplateList(
    @CurrentUser() user: User,
  ): Promise<TemplateListItemGql[]> {
    return this.translationService.listTemplates(user)
  }

  @Query(() => TemplateIntrospectionGql, { nullable: true })
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async applicationTemplateIntrospection(
    @CurrentUser() user: User,
    @Args('typeId') typeId: string,
  ): Promise<TemplateIntrospectionGql> {
    return this.translationService.introspectTemplate(user, typeId)
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async applicationTemplateRoleForm(
    @CurrentUser() user: User,
    @Args('typeId') typeId: string,
    @Args('stateKey') stateKey: string,
    @Args('roleId') roleId: string,
  ): Promise<unknown> {
    return this.translationService.loadRoleForm(user, typeId, stateKey, roleId)
  }
}
