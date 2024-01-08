import { Controller, Get, Headers, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  LoginRestrictionDto,
  LoginRestrictionsService,
} from '@island.is/auth-api-lib'
import { IdsAuthGuard, Scopes, ScopesGuard } from '@island.is/auth-nest-tools'
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

  @Get()
  @Documentation({
    description: 'Gets all login restrictions for a user.',
    request: {
      header: {
        'X-Query-Phone-Number': {
          required: true,
          description: 'Phone number of the user',
        },
      },
    },
    response: {
      status: 200,
      type: [LoginRestrictionDto],
    },
  })
  async findAll(
    @Headers('X-Query-Phone-Number') phoneNumber: string,
  ): Promise<LoginRestrictionDto[]> {
    const restriction = await this.loginRestrictionService.findByPhoneNumber(
      phoneNumber,
    )

    return restriction ? [restriction] : []
  }

  @Get('.phone-number')
  @Documentation({
    deprecated: true,
    description:
      'Deprecated. IDS should use the collection endpoint. This endpoint will be removed when IDS has switched over.',
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
    @Headers('X-Param-Phone-Number') phoneNumber: string,
  ): Promise<LoginRestrictionDto | null> {
    return this.loginRestrictionService.findByPhoneNumber(phoneNumber)
  }
}
