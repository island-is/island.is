import { IdsUserGuard, ScopesGuard } from '@island.is/auth-nest-tools'
import {
  Controller,
  Post,
  Get,
  UseGuards,
  VERSION_NEUTRAL,
} from '@nestjs/common'

@UseGuards(IdsUserGuard, ScopesGuard)
@Controller({
  version: [VERSION_NEUTRAL, '1'],
})
export class AuthController {
  constructor() {}

  @Post('login')
  async login(): Promise<boolean> {
    return true
  }

  @Get('logout')
  async logout(): Promise<boolean> {
    return true
  }
}
