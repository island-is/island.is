import {
  CurrentActor,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'

import { PasskeysCoreService } from '@island.is/auth-api-lib'

import { Documentation } from '@island.is/nest/swagger'
import {
  RegistrationOptions,
  RegistrationResult,
} from './dto/registrationOptions.dto'

import { RegistrationResponse } from './dto/registrationResponse.dto'
import { AuthenticationOptions } from './dto/authenticationOptions.dto'
import { AuthenticationResponse } from './dto/authenticationResponse.dto'

@ApiTags('passkeys')
@UseGuards(IdsUserGuard, ScopesGuard)
@Controller({
  path: 'passkeys',
  version: ['1', VERSION_NEUTRAL],
})
export class PasskeysController {
  constructor(private readonly passkeysCoreService: PasskeysCoreService) {
    console.log('Constructed PasskeysController')
  }

  @Get('register')
  @Documentation({
    summary: 'Gets passkey registration options for the authenicated user.',
    description: 'Passkey registration options for the authenticated user.',
    response: { status: 200, type: RegistrationOptions },
  })
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
  async verifyRegistration(
    @CurrentActor() actor: User,
    @Body() body: RegistrationResponse,
  ): Promise<RegistrationResult> {
    const response = await this.passkeysCoreService.verifyRegistration(
      actor,
      body as any,
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
  async getPasskeyAuthenticationOptions(
    @CurrentActor() actor: User,
  ): Promise<AuthenticationOptions> {
    const response =
      await this.passkeysCoreService.generateAuthenticationOptions(actor)

    return response as RegistrationOptions
  }

  @Post('authenticate')
  @Documentation({
    summary:
      'Validates passkey authentication based on input from authenticated user.',
    description: 'Verifies authenticated user passkey authentication response.',
    response: { status: 200, type: RegistrationResult },
  })
  @ApiCreatedResponse({ type: RegistrationResult })
  async verifyAuthentication(
    @Body() body: AuthenticationResponse,
  ): Promise<RegistrationResult> {
    const response = await this.passkeysCoreService.verifyAuthentication(
      body as any, // TODO: Fix this
    )

    return response
  }
}
