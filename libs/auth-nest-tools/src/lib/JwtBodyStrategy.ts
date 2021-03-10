import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Injectable } from '@nestjs/common';
import { Config } from './auth.module';
import { JwtStrategy } from './jwt.strategy';
import { JwtPayload } from './jwt.payload';
import { User } from './user';

@Injectable()
export class JwtFromBodyStrategy extends PassportStrategy(JwtStrategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromBodyField('token')
    });
  }

  async validate(payload: JwtPayload): Promise<User> {
    return super.validate(payload)
  }
}
