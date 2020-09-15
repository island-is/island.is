import {
  Controller,
  UseGuards,
  Get,
  Req,
  Inject,
  NotFoundException,
} from '@nestjs/common'
import { ApiTags, ApiOkResponse } from '@nestjs/swagger'

import { LOGGER_PROVIDER, Logger } from '@island.is/logging'

import { AuthUser } from '../auth/auth.types'
import { JwtAuthGuard } from '../auth/auth.guard'
import { User } from './user.types'
import { UserService } from './user.service'

@UseGuards(JwtAuthGuard)
@Controller('api')
@ApiTags('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    @Inject(LOGGER_PROVIDER)
    private logger: Logger,
  ) {}

  @Get('user')
  @ApiOkResponse({ type: User })
  async getCurrentUser(@Req() req) {
    this.logger.debug('Received request from user', {
      extra: { user: req.user },
    })

    const authUser: AuthUser = req.user

    let user: User

    if (authUser) {
      user = await this.userService.findByNationalId(authUser.nationalId)
    }

    if (user) {
      return user
    }

    throw new NotFoundException(
      `User ${authUser && authUser.nationalId} not found`,
    )
  }
}
