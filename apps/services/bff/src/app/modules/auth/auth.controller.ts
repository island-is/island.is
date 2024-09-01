import {
  Controller,
  Get,
  Query,
  Req,
  Res,
  ValidationPipe,
  VERSION_NEUTRAL,
} from '@nestjs/common'
import { Response, Request } from 'express'
import { AuthService } from './auth.service'
import { CallbackLoginQuery } from './queries/callback-login.query'
import { LoginQuery } from './queries/login.query'

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
  async callback(
    @Res() res: Response,
    @Query(authValidationPipe)
    query: CallbackLoginQuery,
  ): Promise<void> {
    return this.authService.callback(res, query)
  }
}
