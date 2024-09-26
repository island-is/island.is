import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { qsValidationPipe } from '../../utils/qs-validation-pipe'
import { AuthService } from './auth.service'
import { CallbackLoginQuery } from './queries/callback-login.query'
import { CallbackLogoutQuery } from './queries/callback-logout.query'
import { LoginQuery } from './queries/login.query'
import { LogoutQuery } from './queries/logout.query'

@Controller({
  version: [VERSION_NEUTRAL, '1'],
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  async login(
    @Res() res: Response,
    @Query(qsValidationPipe)
    query: LoginQuery,
  ): Promise<void> {
    return this.authService.login({ res, query })
  }

  @Get('callbacks/login')
  async callbackLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Query(qsValidationPipe)
    query: CallbackLoginQuery,
  ): Promise<void> {
    return this.authService.callbackLogin({ req, res, query })
  }

  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res() res: Response,
    @Query(qsValidationPipe)
    query: LogoutQuery,
  ): Promise<void> {
    return this.authService.logout({ req, res, query })
  }
}
