import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { Request, Response } from 'express'
import { qsValidationPipe } from '../../utils/qs-validation-pipe'
import { AuthService } from './auth.service'
import { CallbackLoginDto } from './dto/callback-login.dto'
import { CallbackLogoutDto } from './dto/callback-logout.dto'
import { LoginDto } from './dto/login.dto'
import { LogoutDto } from './dto/logout.dto'

@Controller({
  version: [VERSION_NEUTRAL, '1'],
})
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('login')
  async login(
    @Res() res: Response,
    @Query(qsValidationPipe)
    query: LoginDto,
  ): Promise<void> {
    return this.authService.login({ res, query })
  }

  @Get('callbacks/login')
  async callbackLogin(
    @Req() req: Request,
    @Res() res: Response,
    @Query(qsValidationPipe)
    query: CallbackLoginDto,
  ): Promise<void> {
    return this.authService.callbackLogin({ req, res, query })
  }

  @Get('logout')
  async logout(
    @Req() req: Request,
    @Res() res: Response,
    @Query(qsValidationPipe)
    query: LogoutDto,
  ): Promise<void> {
    return this.authService.logout({ req, res, query })
  }

  @Post('callbacks/logout')
  async callbackBackchannelLogout(
    @Res() res: Response,
    @Body() body: CallbackLogoutDto,
  ): Promise<
    Response<{
      status: string
      message: string
    }>
  > {
    return this.authService.callbackLogout(res, body)
  }
}
