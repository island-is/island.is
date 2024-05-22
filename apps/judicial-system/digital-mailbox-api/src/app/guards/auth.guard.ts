import { Injectable, UnauthorizedException } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: unknown, user: any) {
    if (err || !user) {
      console.error('Auth error:', err)
      throw err || new UnauthorizedException() //TODO: better error handling
    }
    console.log('Auth user national id:', user)
    return user
  }
}
