import {
  CurrentActor,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'

import { PasskeysCoreService } from '@island.is/auth-api-lib'
import { Audit } from '@island.is/nest/audit'
import { Documentation } from '@island.is/nest/swagger'

import {
  RegistrationOptions,
  RegistrationResult,
} from './dto/registrationOptions.dto'

import { RegistrationResponse } from './dto/registrationResponse.dto'
import {
  AuthenticationOptions,
  AuthenticationResult,
} from './dto/authenticationOptions.dto'
import { AuthenticationResponse } from './dto/authenticationResponse.dto'

const namespace = '@island.is/auth-public-api/passkeys'

@ApiTags('passkeys')
@UseGuards(IdsUserGuard, ScopesGuard)
@Controller({
  path: 'passkeys',
  version: ['1', VERSION_NEUTRAL],
})
@Audit({ namespace })
export class PasskeysController {
  constructor(private readonly passkeysCoreService: PasskeysCoreService) {}

  @Delete('')
  @Documentation({
    summary: 'Deletes passkey for the authenticated user.',
    description: 'Deletes passkey for the authenticated user.',
    response: { status: 204 },
  })
  @Audit()
  async deletePasskey(@CurrentActor() actor: User): Promise<void> {
    await this.passkeysCoreService.deletePasskeyByUser(actor)
  }

  @Get('register')
  @Documentation({
    summary: 'Gets passkey registration options for the authenicated user.',
    description: 'Passkey registration options for the authenticated user.',
    response: { status: 200, type: RegistrationOptions },
  })
  @Audit()
  @ApiCreatedResponse({ type: RegistrationOptions })
  async getPasskeyRegistrationOptions(
    @CurrentActor() actor: User,
  ): Promise<RegistrationOptions> {
    const response = await this.passkeysCoreService.generateRegistrationOptions(
      actor,
    )

    return response as RegistrationOptions
  }

  @Post('register')
  @Documentation({
    summary: 'Validates registration based on input from authenicated user.',
    description: 'Verifies authenticated user passkey registration response.',
    response: { status: 200, type: RegistrationResult },
  })
  @ApiCreatedResponse({ type: RegistrationResult })
  @Audit<RegistrationResult>({
    resources: (result) => result.verified.toString(),
  })
  async verifyRegistration(
    @CurrentActor() actor: User,
    @Body() body: RegistrationResponse,
  ): Promise<RegistrationResult> {
    const response = await this.passkeysCoreService.verifyRegistration(
      actor,
      body,
    )

    return response
  }

  @Get('authenticate')
  @Documentation({
    summary: 'Gets passkey authentication options for the authenticated user.',
    description: 'Passkey authenticate options for the authenticated user.',
    response: { status: 200, type: AuthenticationOptions },
  })
  @ApiCreatedResponse({ type: AuthenticationOptions })
  @Audit()
  async getPasskeyAuthenticationOptions(
    @CurrentActor() actor: User,
  ): Promise<AuthenticationOptions> {
    const response =
      await this.passkeysCoreService.generateAuthenticationOptions(actor)

    return response as RegistrationOptions
  }

  // TODO remove before merging into main
  // should only be possible to verify authentication through auth-ids-api
  @Post('authenticate')
  @Documentation({
    summary:
      'Validates passkey authentication based on input from authenticated user.',
    description: 'Verifies authenticated user passkey authentication response.',
    response: { status: 200, type: AuthenticationResult },
  })
  @ApiCreatedResponse({ type: AuthenticationResult })
  async verifyAuthentication(
    @Body() body: AuthenticationResponse,
  ): Promise<AuthenticationResult> {
    return this.passkeysCoreService.verifyAuthenticationString(body.passkey)
  }
}
