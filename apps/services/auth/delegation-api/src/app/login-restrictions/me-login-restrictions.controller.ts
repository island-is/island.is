import { Body, Controller, Delete, Get, Put, UseGuards } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'

import {
  CreateLoginRestrictionDto,
  LoginRestriction,
  LoginRestrictionDto,
  LoginRestrictionsPaginatedDto,
  LoginRestrictionsService,
} from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  User,
} from '@island.is/auth-nest-tools'
import { ApiScope } from '@island.is/auth/scopes'
import {
  FeatureFlag,
  FeatureFlagGuard,
  Features,
} from '@island.is/nest/feature-flags'
import { Documentation } from '@island.is/nest/swagger'

@UseGuards(IdsUserGuard, ScopesGuard, FeatureFlagGuard)
@Scopes(ApiScope.internal)
@ApiTags('me/login-restrictions')
@FeatureFlag(Features.disableNewDeviceLogins)
@Controller({
  path: 'me/login-restrictions',
  version: ['1'],
})
export class MeLoginRestrictionsController {
  constructor(
    private readonly loginRestrictionsService: LoginRestrictionsService,
  ) {}

  @Get()
  @Documentation({
    description: 'Gets the current user login restrictions.',
    response: {
      status: 200,
      type: LoginRestrictionsPaginatedDto,
    },
  })
  async findAll(
    @CurrentUser() user: User,
  ): Promise<LoginRestrictionsPaginatedDto> {
    const restrictions = await this.loginRestrictionsService.findAll(user)
    return {
      pageInfo: {
        hasNextPage: false,
      },
      totalCount: restrictions.length,
      data: restrictions,
    }
  }

  @Put()
  @Documentation({
    description: 'Creates or updates a login restriction for the current user.',
    response: {
      status: 200,
      type: LoginRestriction,
    },
  })
  create(
    @CurrentUser() user: User,
    @Body() input: CreateLoginRestrictionDto,
  ): Promise<LoginRestrictionDto> {
    return this.loginRestrictionsService.create(user, input)
  }

  @Delete()
  @Documentation({
    description: 'Deletes the current user login restriction.',
    response: {
      status: 204,
    },
  })
  delete(@CurrentUser() user: User): Promise<void> {
    return this.loginRestrictionsService.delete(user)
  }
}
