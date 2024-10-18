import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { CurrentUser, IdsUserGuard } from '@island.is/auth-nest-tools'

import { PasskeyRegistrationOptions } from '../models/registrationOptions.model'
import { PasskeyService } from '../services/passkey.service'
import { PasskeyRegistrationObject } from '../dto/registrationObject.input'
import { PasskeyRegistrationVerification } from '../models/verifyRegistration.model'
import { PasskeyAuthenticationOptions } from '../models/authenticationOptions.model'

@UseGuards(IdsUserGuard)
@Resolver(() => PasskeyRegistrationOptions)
export class PasskeyResolver {
  constructor(private passkey: PasskeyService) {}

  @Query(() => PasskeyRegistrationOptions, {
    name: 'authPasskeyRegistrationOptions',
  })
  getRegistrationOptions(
    @CurrentUser() user: User,
  ): Promise<PasskeyRegistrationOptions> {
    return this.passkey.getRegistrationOptions(user)
  }

  @Mutation(() => PasskeyRegistrationVerification, {
    name: 'authPasskeyVerifyRegistration',
  })
  async verifyRegistration(
    @CurrentUser() user: User,
    @Args('input', { type: () => PasskeyRegistrationObject })
    input: PasskeyRegistrationObject,
  ): Promise<PasskeyRegistrationVerification> {
    return this.passkey.verifyRegistration(user, input)
  }

  @Query(() => PasskeyAuthenticationOptions, {
    name: 'authPasskeyAuthenticationOptions',
  })
  getAuthenticationOptions(
    @CurrentUser() user: User,
  ): Promise<PasskeyAuthenticationOptions> {
    return this.passkey.getAuthenticationOptions(user)
  }

  @Mutation(() => Boolean, {
    name: 'authDeletePasskey',
  })
  async deletePasskey(@CurrentUser() user: User): Promise<boolean> {
    await this.passkey.deletePasskey(user)
    return true
  }
}
