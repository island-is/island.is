import { Inject, Injectable } from '@nestjs/common'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import {
  AdminApi,
  AdminDevApi,
  AdminProdApi,
  AdminStagingApi,
} from '@island.is/clients/auth/admin-api'
import { Auth, AuthMiddleware } from '@island.is/auth-nest-tools'
import { Environment } from '@island.is/shared/types'

@Injectable()
export abstract class MultiEnvironmentService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    protected readonly logger: Logger,
    @Inject(AdminDevApi.key)
    private readonly adminDevApi?: AdminApi,
    @Inject(AdminStagingApi.key)
    private readonly adminStagingApi?: AdminApi,
    @Inject(AdminProdApi.key)
    private readonly adminProdApi?: AdminApi,
  ) {
    if (!this.adminDevApi && !this.adminStagingApi && !this.adminProdApi) {
      logger.error(
        'No admin api clients configured, at least one configured api is required.',
      )
    }
  }

  protected adminDevApiWithAuth(auth: Auth) {
    return this.adminDevApi?.withMiddleware(new AuthMiddleware(auth))
  }
  protected adminStagingApiWithAuth(auth: Auth) {
    return this.adminStagingApi?.withMiddleware(new AuthMiddleware(auth))
  }
  protected adminProdApiWithAuth(auth: Auth) {
    return this.adminProdApi?.withMiddleware(new AuthMiddleware(auth))
  }

  protected adminApiByEnvironmentWithAuth(
    environment: Environment,
    auth: Auth,
  ) {
    switch (environment) {
      case Environment.Development:
        return this.adminDevApiWithAuth(auth)
      case Environment.Staging:
        return this.adminStagingApiWithAuth(auth)
      case Environment.Production:
        return this.adminProdApiWithAuth(auth)
      default:
        return null
    }
  }
}
