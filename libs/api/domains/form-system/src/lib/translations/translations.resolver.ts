import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Mutation, Args, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { GoogleTranslation } from '@island.is/form-system/shared'
import { UseGuards } from '@nestjs/common'
import { GoogleTranslationInput } from '../../dto/translations.input'
import { TranslationsService } from './translations.service'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class TranslationsResolver {
  constructor(private readonly translationsService: TranslationsService) {}

  @Mutation(() => GoogleTranslation, {
    name: 'formSystemGoogleTranslation',
  })
  async getGoogleTranslation(
    @Args('input', { type: () => GoogleTranslationInput })
    input: GoogleTranslationInput,
    @CurrentUser() user: User,
  ): Promise<GoogleTranslation> {
    return this.translationsService.getGoogleTranslation(user, input)
  }
}
