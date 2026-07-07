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
  SharedNamespaceIntrospectionGql,
  SharedTranslationNamespaceListItemGql,
  TemplateIntrospectionGql,
  TemplateListItemGql,
  TranslationPublishGql,
} from './application-translation.model'
import { ApplicationTranslationClient } from './application-translation.client'
import { GoogleTranslateService } from './google-translate.service'
import {
  UpdateApplicationTranslationInput,
  BulkUpdateApplicationTranslationsInput,
  GoogleTranslateStringsInput,
  PublishTranslationsInput,
  RollbackTranslationsInput,
} from './dto/application-translation.input'

const TRANSLATION_SCOPES = [
  AdminPortalScope.applicationSystemAdmin,
  AdminPortalScope.applicationSystemInstitution,
] as const

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => ApplicationTranslationGql)
export class ApplicationTranslationResolver {
  constructor(
    private readonly translationClient: ApplicationTranslationClient,
    private readonly googleTranslateService: GoogleTranslateService,
  ) {}

  @Query(() => [ApplicationTranslationGql], { nullable: true })
  @Scopes(...TRANSLATION_SCOPES)
  async applicationTranslations(
    @CurrentUser() user: User,
    @Args('namespace') namespace: string,
  ): Promise<ApplicationTranslationGql[]> {
    return this.translationClient.getTranslationsByNamespace(user, namespace)
  }

  @Query(() => ApplicationTranslationStatus, { nullable: true })
  @Scopes(...TRANSLATION_SCOPES)
  async applicationTranslationStatus(
    @CurrentUser() user: User,
    @Args('namespace') namespace: string,
  ): Promise<ApplicationTranslationStatus> {
    return this.translationClient.getTranslationStatus(user, namespace)
  }

  @Query(() => [ApplicationTranslationStatus], { nullable: true })
  @Scopes(...TRANSLATION_SCOPES)
  async applicationTranslationAllStatus(
    @CurrentUser() user: User,
  ): Promise<ApplicationTranslationStatus[]> {
    return this.translationClient.getAllNamespacesWithStatus(user)
  }

  @Mutation(() => ApplicationTranslationGql)
  @Scopes(...TRANSLATION_SCOPES)
  async updateApplicationTranslation(
    @CurrentUser() user: User,
    @Args('input') input: UpdateApplicationTranslationInput,
  ): Promise<ApplicationTranslationGql> {
    return this.translationClient.updateTranslation(user, {
      namespace: input.namespace,
      messageKey: input.messageKey,
      valueIs: input.valueIs ?? undefined,
      valueEn: input.valueEn ?? undefined,
    })
  }

  @Mutation(() => [ApplicationTranslationGql])
  @Scopes(...TRANSLATION_SCOPES)
  async bulkUpdateApplicationTranslations(
    @CurrentUser() user: User,
    @Args('input') input: BulkUpdateApplicationTranslationsInput,
  ): Promise<ApplicationTranslationGql[]> {
    return this.translationClient.bulkUpdateTranslations(
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
  @Scopes(...TRANSLATION_SCOPES)
  async reviewApplicationTranslation(
    @CurrentUser() user: User,
    @Args('id') id: string,
  ): Promise<ApplicationTranslationGql> {
    return this.translationClient.reviewTranslation(user, id)
  }

  @Mutation(() => GoogleTranslateResultGql)
  @Scopes(...TRANSLATION_SCOPES)
  async googleTranslateStrings(
    @Args('input') input: GoogleTranslateStringsInput,
  ): Promise<GoogleTranslateResultGql> {
    const translations = await this.googleTranslateService.translateTexts(
      input.texts,
    )
    return { translations }
  }

  @Mutation(() => TranslationPublishGql)
  @Scopes(...TRANSLATION_SCOPES)
  async publishApplicationTranslations(
    @CurrentUser() user: User,
    @Args('input') input: PublishTranslationsInput,
  ): Promise<TranslationPublishGql> {
    return this.translationClient.publishTranslations(
      user,
      input.namespace,
      input.note ?? undefined,
    )
  }

  @Query(() => [TranslationPublishGql], { nullable: true })
  @Scopes(...TRANSLATION_SCOPES)
  async applicationTranslationPublishHistory(
    @CurrentUser() user: User,
    @Args('namespace') namespace: string,
  ): Promise<TranslationPublishGql[]> {
    return this.translationClient.getPublishHistory(user, namespace)
  }

  @Mutation(() => TranslationPublishGql)
  @Scopes(...TRANSLATION_SCOPES)
  async rollbackApplicationTranslations(
    @CurrentUser() user: User,
    @Args('input') input: RollbackTranslationsInput,
  ): Promise<TranslationPublishGql> {
    return this.translationClient.rollbackTranslations(
      user,
      input.namespace,
      input.publishId,
    )
  }

  @Query(() => [TemplateListItemGql], { nullable: true })
  @Scopes(...TRANSLATION_SCOPES)
  async applicationTemplateList(
    @CurrentUser() user: User,
  ): Promise<TemplateListItemGql[]> {
    return this.translationClient.listTemplates(user)
  }

  @Query(() => TemplateIntrospectionGql, { nullable: true })
  @Scopes(...TRANSLATION_SCOPES)
  async applicationTemplateIntrospection(
    @CurrentUser() user: User,
    @Args('typeId') typeId: string,
  ): Promise<TemplateIntrospectionGql> {
    return this.translationClient.introspectTemplate(user, typeId)
  }

  @Query(() => [SharedTranslationNamespaceListItemGql], { nullable: true })
  @Scopes(...TRANSLATION_SCOPES)
  async applicationSharedNamespaceList(
    @CurrentUser() user: User,
  ): Promise<SharedTranslationNamespaceListItemGql[]> {
    return this.translationClient.listSharedNamespaces(user)
  }

  @Query(() => SharedNamespaceIntrospectionGql, { nullable: true })
  @Scopes(...TRANSLATION_SCOPES)
  async applicationSharedNamespaceIntrospection(
    @CurrentUser() user: User,
    @Args('namespace') namespace: string,
  ): Promise<SharedNamespaceIntrospectionGql> {
    return this.translationClient.introspectSharedNamespace(user, namespace)
  }

  @Query(() => graphqlTypeJson, { nullable: true })
  @Scopes(...TRANSLATION_SCOPES)
  async applicationTemplateRoleForm(
    @CurrentUser() user: User,
    @Args('typeId') typeId: string,
    @Args('stateKey') stateKey: string,
    @Args('roleId') roleId: string,
  ): Promise<unknown> {
    return this.translationClient.loadRoleForm(user, typeId, stateKey, roleId)
  }
}
