import type { Request, Response } from 'express'

import type { BffUser } from '@island.is/shared/types'
import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  VERSION_NEUTRAL,
} from '@nestjs/common'

import { qsValidationPipe } from '../../utils/qs-validation-pipe'
import { GetUserDto } from './dto/get-user.dto'
import { UserService } from './user.service'

@Controller({
  path: 'user',
  version: [VERSION_NEUTRAL, '1'],
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  async getUser(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
    @Query(qsValidationPipe)
    query: GetUserDto,
  ): Promise<BffUser> {
    return this.userService.getUser({
      req,
      res,
      refresh: query.refresh === 'true',
    })
  }
}
