import { Body, Controller, Post, VERSION_NEUTRAL } from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'
import type { AuthenticationResponseJSON } from '@simplewebauthn/types'

import { PasskeysCoreService } from '@island.is/auth-api-lib'
import { Documentation } from '@island.is/nest/swagger'
import {
  AuthenticationOptions,
  AuthenticationResult,
} from './dto/authenticationOptions.dto'

@ApiTags('passkeys')
@Controller({
  path: 'passkeys',
  version: ['1', VERSION_NEUTRAL],
})
export class PasskeysController {
  constructor(private readonly passkeysCoreService: PasskeysCoreService) {}

  @Post('authenticate')
  @Documentation({
    summary:
      'Validates passkey authentication based on input from authenticated user.',
    description: 'Verifies authenticated user passkey authentication response.',
    response: { status: 200, type: AuthenticationResult },
  })
  @ApiCreatedResponse({ type: AuthenticationResult })
  async verifyAuthentication(
    @Body() body: AuthenticationOptions,
  ): Promise<AuthenticationResult> {
    const decodedJson = Buffer.from(body.passkey, 'base64').toString('utf-8')
    const parsedJson = JSON.parse(decodedJson) as AuthenticationResponseJSON

    const response = await this.passkeysCoreService.verifyAuthentication(
      parsedJson,
    )

    return response
  }
}
