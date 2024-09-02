import { Controller, Get, Req, VERSION_NEUTRAL } from '@nestjs/common'
import type { Request } from 'express'
import { UserService } from './user.service'
import { IdTokenData } from '../auth/auth.types'

@Controller({
  path: 'user',
  version: [VERSION_NEUTRAL, '1'],
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(@Req() req: Request): Promise<IdTokenData> {
    return this.userService.getUser(req)
  }
}
