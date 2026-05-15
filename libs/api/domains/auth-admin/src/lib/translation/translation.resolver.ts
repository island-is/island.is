import { UseGuards } from '@nestjs/common'
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'

import type { User } from '@island.is/auth-nest-tools'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { AdminPortalScope } from '@island.is/auth/scopes'
import { Environment } from '@island.is/shared/types'

import { DeleteEnvironmentResult } from '../shared/models/delete-environment-result.model'
import { Translation } from './models/translation.model'
import { TranslationLanguage } from './models/translation-language.model'
import { TranslationsPayload } from './dto/translations.payload'
import { TranslationsInput } from './dto/translations.input'
import { TranslationKeyInput } from './dto/translation-key.input'
import { CreateTranslationInput } from './dto/create-translation.input'
import { UpdateTranslationInput } from './dto/update-translation.input'
import { DeleteTranslationInput } from './dto/delete-translation.input'
import { TranslationService } from './translation.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.idsAdminSuperUser)
@Resolver(() => Translation)
export class TranslationResolver {
  constructor(private readonly translationService: TranslationService) {}

  @Query(() => TranslationsPayload, { name: 'authAdminTranslations' })
  getTranslations(
    @CurrentUser() user: User,
    @Args('input') input: TranslationsInput,
  ): Promise<TranslationsPayload> {
    return this.translationService.getTranslations(user, input)
  }

  @Query(() => Translation, {
    name: 'authAdminTranslation',
    nullable: true,
  })
  getTranslation(
    @CurrentUser() user: User,
    @Args('input', { type: () => TranslationKeyInput })
    input: TranslationKeyInput,
  ): Promise<Translation | null> {
    return this.translationService.getTranslation(user, input)
  }

  @Query(() => [TranslationLanguage], {
    name: 'authAdminTranslationLanguages',
  })
  getTranslationLanguages(
    @CurrentUser() user: User,
  ): Promise<TranslationLanguage[]> {
    return this.translationService.getLanguagesForDropdown(user)
  }

  @Query(() => [Environment], {
    name: 'authAdminTranslationConfiguredEnvironments',
  })
  getConfiguredEnvironments(): Environment[] {
    return this.translationService.getAvailableEnvironments()
  }

  @Mutation(() => Translation, { name: 'createAuthAdminTranslation' })
  createTranslation(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateTranslationInput })
    input: CreateTranslationInput,
  ): Promise<Translation> {
    return this.translationService.createTranslation(user, input)
  }

  @Mutation(() => Translation, { name: 'updateAuthAdminTranslation' })
  updateTranslation(
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateTranslationInput })
    input: UpdateTranslationInput,
  ): Promise<Translation> {
    return this.translationService.updateTranslation(user, input)
  }

  @Mutation(() => DeleteEnvironmentResult, {
    name: 'deleteAuthAdminTranslation',
  })
  deleteTranslation(
    @CurrentUser() user: User,
    @Args('input', { type: () => DeleteTranslationInput })
    input: DeleteTranslationInput,
  ): Promise<DeleteEnvironmentResult> {
    return this.translationService.deleteTranslation(
      user,
      {
        language: input.language,
        className: input.className,
        property: input.property,
        key: input.key,
      },
      input.environments,
    )
  }
}
