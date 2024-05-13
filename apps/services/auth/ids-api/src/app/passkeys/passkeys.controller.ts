import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  Body,
  Controller,
  Post,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { PasskeysCoreService } from '@island.is/auth-api-lib'
import { Documentation } from '@island.is/nest/swagger'
import { AuthenticationResponse } from './dto/authenticationResponse.dto'
import { AuthenticationResult } from './dto/authenticationOptions.dto'

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
    const response = await this.passkeysCoreService.verifyAuthentication(body)

    return response
  }
}
