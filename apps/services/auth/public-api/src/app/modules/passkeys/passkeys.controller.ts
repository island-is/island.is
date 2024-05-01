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
    summary: 'Gets registration options for the authenicated user.',
    description: 'Registration Options for the authenticated user.',
    response: { status: 200, type: RegistrationOptions },
  })
  @ApiCreatedResponse({ type: RegistrationOptions })
  async registerPasskey(
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
    description: 'Verifies authenticated user registration response.',
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
}
