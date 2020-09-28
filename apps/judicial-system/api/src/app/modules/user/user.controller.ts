import {
  Controller,
  UseGuards,
  Get,
  Req,
  NotFoundException,
} from '@nestjs/common'
import { ApiTags, ApiOkResponse } from '@nestjs/swagger'

import { AuthUser } from '../auth/auth.types'
import { JwtAuthGuard } from '../auth/auth.guard'
import { User } from './user.types'
import { UserService } from './user.service'

@UseGuards(JwtAuthGuard)
@Controller('api')
@ApiTags('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('user')
  @ApiOkResponse({ type: User })
  async getCurrentUser(@Req() req) {
    const authUser: AuthUser = req.user

    const user = await this.userService.findByNationalId(authUser)

    if (!user) {
      throw new NotFoundException(
        `User ${authUser && authUser.nationalId} not found`,
      )
    }

    return user
  }
}
