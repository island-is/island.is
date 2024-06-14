import { Injectable } from '@nestjs/common'
import { Auth, AuthMiddleware, type User } from '@island.is/auth-nest-tools'
import { KeyOption, KeyOptionsManagementApi, DefaultApi } from '../../gen/fetch'

@Injectable()
export class FriggClientService {
  constructor(
    private readonly keyOptionsManagementApi: KeyOptionsManagementApi,
    private readonly defaultApi: DefaultApi,
  ) {}

  private keyOptionsManagementApiWithAuth = (user: User) =>
    this.keyOptionsManagementApi.withMiddleware(
      new AuthMiddleware(user as Auth),
    )

  private defaultApiWithAuth = (user: User) =>
    this.defaultApi.withMiddleware(new AuthMiddleware(user as Auth))

  async getHealth(user: User): Promise<void> {
    return this.defaultApiWithAuth(user).health()
  }

  async getAllKeyOptions(user: User): Promise<KeyOption[]> {
    console.log('FriggClientService getAllKeyOptions')
    return this.keyOptionsManagementApiWithAuth(user).getAllKeyOptions({
      type: undefined,
    })
  }

  async getTypes(user: User): Promise<void> {
    return this.keyOptionsManagementApiWithAuth(user).getTypes()
  }
}
