import fetch, { Response } from 'node-fetch'
import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { KeyOption, KeyOptionsManagementApi, DefaultApi } from '../../gen/fetch'

@Injectable()
export class FriggClientService {
  constructor(
    private readonly keyOptionsManagementApi: KeyOptionsManagementApi,
  ) {}

  private keyOptionsManagementApiWithAuth = (user: User) =>
    this.keyOptionsManagementApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  async getAllKeyOptions(user: User): Promise<KeyOption[]> {
    console.log(
      '======> (FriggClientService) keyOptionsManagementApi: ',
      this.keyOptionsManagementApi,
    )
    console.log(`CLIENT-----getTypesn ${this.keyOptionsManagementApi}`, {
      foo: this.keyOptionsManagementApi,
    })

    return this.keyOptionsManagementApiWithAuth(user).getAllKeyOptions({
      // type: '',
      type: undefined,
    })
  }
}
