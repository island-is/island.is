import { Injectable } from '@nestjs/common'

import { UserService } from '../user'
import { AuthUser } from './auth.types'

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(authUser: AuthUser): Promise<boolean> {
    const user = await this.userService.findByNationalId(authUser.nationalId)

    return !!user
  }
}
