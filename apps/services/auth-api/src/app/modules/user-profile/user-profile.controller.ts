import { UserProfileService, IndividuaInfoDTO } from '@island.is/auth-api-lib'
import type { User } from '@island.is/auth-nest-tools'
import {
  IdsUserGuard,
  Scopes,
  ScopesGuard,
  CurrentUser,
} from '@island.is/auth-nest-tools'
import { Controller, Get, UseGuards } from '@nestjs/common'
import { ApiOkResponse, ApiTags } from '@nestjs/swagger'
import { environment } from '../../../environments'

@UseGuards(IdsUserGuard, ScopesGuard)
@ApiTags('user-profile')
@Controller('user-profile')
export class UserProfileController {
  constructor(private readonly userProfileService: UserProfileService) {}

  @Scopes('@identityserver.api/authentication')
  @Get('individual')
  @ApiOkResponse()
  async findIndividual(@CurrentUser() user: User): Promise<IndividuaInfoDTO> {
    return this.userProfileService.findIndividual(
      user,
      environment.nationalRegistry.xroad.clientId ?? '',
      environment.nationalRegistry.authMiddlewareOptions,
    )
  }
}
