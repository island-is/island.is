import { Controller, Get, Headers, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  LoginRestrictionDto,
  LoginRestrictionsService,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsAuthGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'

import type { User } from '@island.is/auth-nest-tools'
import { Documentation } from '@island.is/nest/swagger'

@UseGuards(IdsAuthGuard, ScopesGuard)
@Scopes('@identityserver.api/authentication')
@Controller({
  path: 'login-restrictions',
  version: ['1'],
})
@ApiTags('login-restrictions')
export class LoginRestrictionsController {
  constructor(
    private readonly loginRestrictionService: LoginRestrictionsService,
  ) {}

  @Get('.phone-number')
  @Documentation({
    description:
      'Gets all login restrictions for a user. Currently alawys returns a single item if user has restriction enabled.',
    request: {
      header: {
        'X-Param-Phone-Number': {
          required: true,
          description: 'Phone number of the user',
        },
      },
    },
    response: {
      status: 200,
      type: LoginRestrictionDto,
    },
  })
  async findByPhoneNumber(
    @CurrentUser() user: User,
    @Headers('X-Param-Phone-Number') phoneNumber: string,
  ): Promise<LoginRestrictionDto> {
    return this.loginRestrictionService.findByPhoneNumber(phoneNumber)
  }
}
