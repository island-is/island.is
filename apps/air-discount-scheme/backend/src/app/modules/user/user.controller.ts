import {
  Controller,
  Param,
  Get,
  UseGuards,
  BadRequestException,
} from '@nestjs/common'
import { ApiExcludeEndpoint } from '@nestjs/swagger'

import { GetUserRelationsParams } from './dto'
import { UserService } from './user.service'
import { User } from './user.model'
import {
  CurrentUser,
  IdsUserGuard,
  Scopes,
  ScopesGuard,
} from '@island.is/auth-nest-tools'
import type { User as AuthUser } from '@island.is/auth-nest-tools'
import { AirDiscountSchemeScope } from '@island.is/auth/scopes'

@UseGuards(IdsUserGuard, ScopesGuard)
@Scopes(AirDiscountSchemeScope.full, AirDiscountSchemeScope.public)
@Controller('api/private')
export class PrivateUserController {
  constructor(private readonly userService: UserService) {}

  @Get('users/:nationalId/relations')
  @ApiExcludeEndpoint()
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

    const userAndRelatives = await this.userService.getMultipleUsersByNationalIdArray(
      relations,
      authUser,
    )

    return userAndRelatives
  }
}
