import { UserProfileScope } from '@island.is/auth/scopes'
import {
  Scopes,
  ScopesGuard,
  IdsAuthGuard,
} from '@island.is/auth-nest-tools'
import {
  Controller,
  Get,

  Param,

  UseGuards,

} from '@nestjs/common'
import {

  ApiOkResponse,
  ApiOperation,
  ApiSecurity,
  ApiTags,
} from '@nestjs/swagger'

import { UserDeviceTokensDto } from './dto/userDeviceTokens.dto'
import { UserProfileService } from './userProfile.service'

@UseGuards(IdsAuthGuard, ScopesGuard)
@ApiTags('User Profile')
@Controller()
export class UserTokenController {
  constructor(private readonly userProfileService: UserProfileService) {}
  @ApiOperation({
    summary: 'admin access - returns a list of user device tokens',
  })
  @ApiOkResponse({ type: [UserDeviceTokensDto] })
  @Scopes(UserProfileScope.admin)
  @ApiSecurity('oauth2', [UserProfileScope.admin])
  @Get('userProfile/:nationalId/device-tokens')
  async getDeviceTokens(
    @Param('nationalId')
    nationalId: string,
  ): Promise<UserDeviceTokensDto[]> {
    return await this.userProfileService.getDeviceTokens(nationalId)
  }
}
