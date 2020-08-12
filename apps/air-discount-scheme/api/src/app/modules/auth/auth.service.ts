import { Injectable } from '@nestjs/common'

import { AuthRepository } from './auth.repository'

@Injectable()
export class AuthService {
  constructor(private repository: AuthRepository) {}

  getMessage(name: string) {
    const auth = this.repository.getAuth()
    return `${auth} ${name}!`
  }
}
