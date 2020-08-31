import { Controller, Get, Res } from '@nestjs/common'
import { ApiTags, ApiOkResponse } from '@nestjs/swagger'
import { User } from './types'

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  @Get('login')
  login(@Res() res) {
    const user: User = {
      nationalId: '010101000',
      name: 'Jón Jónsson',
      phone: '8888888',
    }

    return res.json({ user })
  }

  @Get('logout')
  logout(@Res() res) {
    return res.json({ logout: true })
  }
}
