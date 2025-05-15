import {
  ApiOkResponse,
  ApiNoContentResponse,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'
import { Controller, Get, UseGuards } from '@nestjs/common'

import type { User } from '@island.is/auth-nest-tools'
import { ActorScopes, CurrentActor } from '@island.is/auth-nest-tools'
import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import { Audit } from '@island.is/nest/audit'
import { UserProfileScope } from '@island.is/auth/scopes'

import { UserProfileService } from './user-profile.service'

import { ActorLocale } from './dto/actor-profile.dto'
import { Locale } from './types/localeTypes'

const namespace = '@island.is/user-profile/v2/actor'

@UseGuards(IdsUserGuard, ScopesGuard)
@ActorScopes(UserProfileScope.read)
@ApiTags('v2/actor')
@ApiSecurity('oauth2', [UserProfileScope.read])
@Controller({
  path: 'actor',
  version: ['2'],
})
@Audit({ namespace })
export class ActorUserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Get('/locale')
  @ApiOkResponse({ type: ActorLocale })
  @ApiNoContentResponse()
  @Audit<ActorLocale>({
    resources: (profile) => profile.nationalId,
  })
  async getActorLocale(@CurrentActor() actor: User): Promise<ActorLocale> {
    const userProfile = await this.userProfileService.findById(actor.nationalId)

    return {
      nationalId: userProfile.nationalId,
      locale: userProfile.locale ?? Locale.ICELANDIC,
    }
  }
}
