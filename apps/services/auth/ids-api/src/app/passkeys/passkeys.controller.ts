import {
  Body,
  Controller,
  Post,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { ApiCreatedResponse, ApiTags } from '@nestjs/swagger'

import { PasskeysCoreService } from '@island.is/auth-api-lib'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { Documentation } from '@island.is/nest/swagger'

import {
  AuthenticationOptions,
  AuthenticationResult,
} from './dto/authenticationOptions.dto'

const namespace = '@island.is/auth/ids-api/passkeys'

@ApiTags('passkeys')
@Controller({
  path: 'passkeys',
  version: ['1', VERSION_NEUTRAL],
})
@UseGuards(IdsAuthGuard, ScopesGuard, FeatureFlagGuard)
@Audit({ namespace })
@Scopes('@identityserver.api/authentication')
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
  @Audit<AuthenticationResult>({
    resources: (authenticationResult) =>
      authenticationResult.verified.toString(),
  })
  @FeatureFlag(Features.isPasskeyAuthEnabled)
  async verifyAuthentication(
    @Body() body: AuthenticationOptions,
  ): Promise<AuthenticationResult> {
    return this.passkeysCoreService.verifyAuthenticationString(body.passkey)
  }
}
