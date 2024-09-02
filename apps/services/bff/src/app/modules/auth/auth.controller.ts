import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  ValidationPipe,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { AuthService } from './auth.service'
import { CallbackLoginQuery } from './queries/callback-login.query'
import { LoginQuery } from './queries/login.query'
import { LogoutQuery } from './queries/logout.query'
import { CallbackLogoutQuery } from './queries/callback-logout.query'

const authValidationPipe = new ValidationPipe({
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  forbidNonWhitelisted: true,
})

@Controller({
  version: [VERSION_NEUTRAL, '1'],
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  async login(
    @Req() req: Request,
    @Res() res: Response,
    @Query(authValidationPipe)
    query: LoginQuery,
  ): Promise<void> {
    return this.authService.login({ req, res, query })
  }

  @Get('callbacks/login')
  async callbackLogin(
    @Res() res: Response,
    @Query(authValidationPipe)
    query: CallbackLoginQuery,
  ): Promise<void> {
    return this.authService.callbackLogin(res, query)
  }

  @Get('logout')
  async logout(
    @Res() res: Response,
    @Query(authValidationPipe)
    query: LogoutQuery,
  ): Promise<void> {
    return this.authService.logout({ res, query })
  }

  @Get('callbacks/logout')
  async callbackLogout(
    @Res() res: Response,
    @Query(authValidationPipe)
    query: CallbackLogoutQuery,
  ): Promise<void> {
    return this.authService.callbackLogout(res, query)
  }
}
