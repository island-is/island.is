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
import { Language } from './models/language.model'
import { LanguagesPayload } from './dto/languages.payload'
import { LanguagesInput } from './dto/languages.input'
import { CreateLanguageInput } from './dto/create-language.input'
import { UpdateLanguageInput } from './dto/update-language.input'
import { DeleteLanguageInput } from './dto/delete-language.input'
import { LanguageService } from './language.service'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AdminPortalScope.idsAdminSuperUser)
@Resolver(() => Language)
export class LanguageResolver {
  constructor(private readonly languageService: LanguageService) {}

  @Query(() => LanguagesPayload, { name: 'authAdminLanguages' })
  getLanguages(
    @CurrentUser() user: User,
    @Args('input') input: LanguagesInput,
  ): Promise<LanguagesPayload> {
    return this.languageService.getLanguages(user, input)
  }

  @Query(() => Language, {
    name: 'authAdminLanguage',
    nullable: true,
  })
  getLanguage(
    @CurrentUser() user: User,
    @Args('isoKey', { type: () => String }) isoKey: string,
  ): Promise<Language | null> {
    return this.languageService.getLanguage(user, isoKey)
  }

  @Query(() => [Environment], {
    name: 'authAdminLanguageConfiguredEnvironments',
  })
  getConfiguredEnvironments(): Environment[] {
    return this.languageService.getAvailableEnvironments()
  }

  @Mutation(() => Language, { name: 'createAuthAdminLanguage' })
  createLanguage(
    @CurrentUser() user: User,
    @Args('input', { type: () => CreateLanguageInput })
    input: CreateLanguageInput,
  ): Promise<Language> {
    return this.languageService.createLanguage(user, input)
  }

  @Mutation(() => Language, { name: 'updateAuthAdminLanguage' })
  updateLanguage(
    @CurrentUser() user: User,
    @Args('input', { type: () => UpdateLanguageInput })
    input: UpdateLanguageInput,
  ): Promise<Language> {
    return this.languageService.updateLanguage(user, input)
  }

  @Mutation(() => DeleteEnvironmentResult, {
    name: 'deleteAuthAdminLanguage',
  })
  deleteLanguage(
    @CurrentUser() user: User,
    @Args('input', { type: () => DeleteLanguageInput })
    input: DeleteLanguageInput,
  ): Promise<DeleteEnvironmentResult> {
    return this.languageService.deleteLanguage(
      user,
      input.isoKey,
      input.environments,
    )
  }
}
