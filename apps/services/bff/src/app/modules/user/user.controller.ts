import type { Request } from 'express'

import type { BffUser } from '@island.is/shared/types'
import { Controller, Get, Req, VERSION_NEUTRAL } from '@nestjs/common'

import { UserService } from './user.service'

@Controller({
  path: 'user',
  version: [VERSION_NEUTRAL, '1'],
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() req: Request): Promise<BffUser> {
    return this.userService.getUser(req)
  }
}
