import { Injectable, Inject } from '@nestjs/common'

import { UserService } from '../user'
import { AuthUser } from './auth.types'

@Injectable()
export class AuthService {
  constructor(
    @Inject(UserService)
    private readonly userService: UserService,
  ) {}

  async validateUser(authUser: AuthUser): Promise<boolean> {
    const user = await this.userService.findByNationalId(authUser)

    return !!user
  }
}
