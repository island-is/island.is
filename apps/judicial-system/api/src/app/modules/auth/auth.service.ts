import { Injectable } from '@nestjs/common'

import { User, UserService } from '../user'
import { AuthUser } from './auth.types'

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(authUser: AuthUser): Promise<User> {
    const user = await this.userService.findOne(authUser.nationalId)

    if (user) {
      return user
    }

    return null
  }
}
