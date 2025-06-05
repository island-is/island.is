import { CodeOwner } from '@island.is/nest/core'
import { CodeOwners } from '@island.is/shared/constants'
import { Mutation, Args, Resolver } from '@nestjs/graphql'
import {
  CurrentUser,
  IdsUserGuard,
  type User,
} from '@island.is/auth-nest-tools'
import { ServicesService } from './services.service'
import { Translation } from '../../models/services.model'
import { GoogleTranslation } from '@island.is/form-system/shared'
import { UseGuards, BadRequestException } from '@nestjs/common'
import {
  GetGoogleTranslationInput,
  GetTranslationInput,
} from '../../dto/service.input'

@Resolver()
@UseGuards(IdsUserGuard)
@CodeOwner(CodeOwners.Advania)
export class ServicesResolver {
  constructor(private readonly formSystemServices: ServicesService) {}

  @Mutation(() => Translation, {
    name: 'formSystemTranslation',
  })
  async getTranslation(
    @Args('input', { type: () => GetTranslationInput })
    input: GetTranslationInput,
    @CurrentUser() user: User,
  ): Promise<Translation> {
    return this.formSystemServices.getTranslation(user, input)
  }

  @Mutation(() => GoogleTranslation, {
    name: 'formSystemGoogleTranslation',
  })
  async getGoogleTranslation(
    @Args('input', { type: () => GetGoogleTranslationInput })
    input: GetGoogleTranslationInput,
    @CurrentUser() user: User,
  ): Promise<GoogleTranslation> {
    // Input validation
    if (
      !input.q ||
      typeof input.q !== 'string' ||
      input.q.trim().length === 0
    ) {
      throw new BadRequestException('Input "q" must be a non-empty string.')
    }
    if (input.q.length > 500) {
      throw new BadRequestException(
        'Input "q" is too long (max 500 characters).',
      )
    }
    return this.formSystemServices.getGoogleTranslation(user, input)
  }
}
