import {
  Controller,
  Get,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common'
import { ApiTags, ApiOkResponse } from '@nestjs/swagger'

import { User } from './user.model'
import { UserService } from './user.service'

/*
 * This controller is not guarded as it needs to respond to unauthenticated requests
 * from the authentication service.
 */
@Controller('api')
@ApiTags('users')
export class UserController {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  @Get('users')
  @ApiOkResponse({
    type: User,
    isArray: true,
    description: 'Gets all existing users',
  })
  getAll(): Promise<User[]> {
    return this.userService.getAll()
  }

  @Get('user/:nationalId')
  @ApiOkResponse({ type: User, description: 'Gets an existing user' })
  async getByNationalId(@Param('nationalId') nationalId: string) {
    const user = await this.userService.findByNationalId(nationalId)

    if (!user) {
      throw new NotFoundException(`User ${nationalId} not found`)
    }

    return user
  }
}
