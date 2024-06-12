import fetch, { Response } from 'node-fetch'

import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { KeyOption, KeyOptionsManagementApi, DefaultApi } from '../../gen/fetch'

export class FriggClientService {
  constructor(
    private readonly keyOptionsManagementApi: KeyOptionsManagementApi,
  ) {}

  private keyOptionsManagementApiWithAuth = (user: User) =>
    this.keyOptionsManagementApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  async getAllKeyOptions(user: User): Promise<KeyOption[]> {
    console.log(`CLIENT-----getTypesn ${this.keyOptionsManagementApi}`, {
      foo: this.keyOptionsManagementApi,
    })

    return this.keyOptionsManagementApiWithAuth(user).getAllKeyOptions({
      type: '',
    })
  }
}
