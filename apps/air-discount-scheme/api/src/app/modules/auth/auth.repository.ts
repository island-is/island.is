import { Injectable } from '@nestjs/common'

@Injectable()
export class AuthRepository {
  getAuth() {
    return 'Auth'
  }
}
