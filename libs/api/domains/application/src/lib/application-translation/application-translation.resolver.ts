import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'
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
  AiTranslationResultGql,
  TemplateIntrospectionGql,
  TemplateListItemGql,
} from './application-translation.model'
import { ApplicationTranslationApiService } from './application-translation.service'
import {
  UpdateApplicationTranslationInput,
  BulkUpdateApplicationTranslationsInput,
} from './dto/application-translation.input'

@UseGuards(IdsUserGuard, ScopesGuard)
@Resolver(() => ApplicationTranslationGql)
export class ApplicationTranslationResolver {
  constructor(
    private readonly translationService: ApplicationTranslationApiService,
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

  @Query(() => AiTranslationResultGql, { nullable: true })
  @Scopes(
    AdminPortalScope.applicationTranslation,
    AdminPortalScope.applicationSystemAdmin,
  )
  async aiTranslateStrings(
    @CurrentUser() user: User,
    @Args('namespace') namespace: string,
    @Args('messageKeys', { type: () => [String] }) messageKeys: string[],
    @Args('sourceLocale') sourceLocale: string,
    @Args('targetLocale') targetLocale: string,
  ): Promise<{ translations: Record<string, string> }> {
    return this.translationService.aiTranslateStrings(user, {
      namespace,
      messageKeys,
      sourceLocale,
      targetLocale,
    })
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
}
