import {
  Controller,
  Get,
  Query,
  Res,
  ValidationPipe,
  VERSION_NEUTRAL
} from '@nestjs/common'
import { Response } from 'express'
import { AuthService } from './auth.service'
import { CallbackLoginQueryDto } from './dto/callback-login-query.dto'
import { LoginQueryDto } from './dto/login-query.dto'

const authValidationPipe = new ValidationPipe({
  transform: true,
  transformOptions: { enableImplicitConversion: true },
  forbidNonWhitelisted: true,
})

@Controller({
  version: [VERSION_NEUTRAL, '1'],
})
export class AuthController {
  constructor(private authService: AuthService) { }

  @Get('login')
  async login(
    @Res() res: Response,
    @Query(authValidationPipe)
    query: LoginQueryDto,
  ): Promise<void> {
    return this.authService.login(res, query)
  }

  @Get('callbacks/login')
  async callback(
    @Res() res: Response,
    @Query(authValidationPipe)
    query: CallbackLoginQueryDto,
  ): Promise<void> {
    return this.authService.callback(res, query)
  }
}
