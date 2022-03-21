import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'

import { IndividuaInfoDTO, UserProfileService } from '@island.is/auth-api-lib'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('user-profile')
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Scopes('@identityserver.api/authentication')
  @Get('individual')
  @ApiOkResponse()
  async findIndividual(@CurrentUser() user: User): Promise<IndividuaInfoDTO> {
    return this.userProfileService.findIndividual(user)
  }
}
