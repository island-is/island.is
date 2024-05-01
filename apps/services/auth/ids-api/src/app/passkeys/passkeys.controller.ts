import {
  CurrentActor,
  IdsUserGuard,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import { Controller, Post, UseGuards, VERSION_NEUTRAL } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import type { User } from '@island.is/auth-nest-tools'
import { PasskeysCoreService } from '@island.is/auth-api-lib'

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

  // @Post('challenges')
  // async validateAuthentication(@CurrentActor() actor: User) {
  //   // TODO
  // }
}
