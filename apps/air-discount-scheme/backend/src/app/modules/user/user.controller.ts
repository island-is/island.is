import {
  Controller,
  Param,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import {
  ApiBearerAuth,
  ApiExcludeEndpoint,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger'

import { GetUserRelationsParams } from './dto'
import { UserService } from './user.service'
import { User } from './user.model'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser } from '@island.is/auth-nest-tools'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AirDiscountSchemeScope.default)
@Controller('api/private')
@ApiTags('Users')
@ApiBearerAuth()
export class PrivateUserController {
  constructor(private readonly userService: UserService) {}

  @Get('users/:nationalId/relations')
  @ApiExcludeEndpoint(!process.env.ADS_PRIVATE_CLIENT)
  @ApiOkResponse({ type: [User] })
  async getUserRelations(
    @Param() params: GetUserRelationsParams,
    @CurrentUser() authUser: AuthUser,
  ): Promise<User[]> {
    if (params.nationalId !== authUser.nationalId) {
      throw new BadRequestException(
        '[/relations] Request parameters do not correspond with user authentication.',
      )
    }
    const relations = [
      authUser.nationalId,
      ...(await this.userService.getRelations(authUser)),
    ]

    const userAndRelatives =
      await this.userService.getMultipleUsersByNationalIdArray(
        relations,
        authUser,
      )

    return userAndRelatives
  }
}
