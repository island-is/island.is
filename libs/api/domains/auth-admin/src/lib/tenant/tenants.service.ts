import { Inject, Injectable, Optional } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  AdminApi,
  AdminDevApi,
  AdminProdApi,
  AdminStagingApi,
} from '@island.is/clients/auth/admin-api'
import type { Logger } from '@island.is/logging'
import { LOGGER_PROVIDER } from '@island.is/logging'
import { Environment } from '@island.is/shared/types'

import { TenantEnvironment } from './models/tenant-environment.model'
import { TenantsPayload } from './dto/tenants.payload'
import { Tenant } from './models/tenant.model'

@Injectable()
export class TenantsService {
  constructor(
    @Inject(LOGGER_PROVIDER)
    private readonly logger: Logger,
    @Inject(AdminDevApi.key)
    @Optional()
    private readonly adminDevApi?: AdminApi,
    @Inject(AdminStagingApi.key)
    @Optional()
    private readonly adminStagingApi?: AdminApi,
    @Inject(AdminProdApi.key)
    @Optional()
    private readonly adminProdApi?: AdminApi,
  ) {
    if (!this.adminDevApi && !this.adminStagingApi && !this.adminProdApi) {
      logger.error(
        'No admin api clients configured, at least one configured api is required.',
      )
    }
  }

  private adminDevApiWithAuth(auth: Auth) {
    return this.adminDevApi?.withMiddleware(new AuthMiddleware(auth))
  }
  private adminStagingApiWithAuth(auth: Auth) {
    return this.adminStagingApi?.withMiddleware(new AuthMiddleware(auth))
  }
  private adminProdApiWithAuth(auth: Auth) {
    return this.adminProdApi?.withMiddleware(new AuthMiddleware(auth))
  }

  async getTenants(user: User): Promise<TenantsPayload> {
    const tenants = await Promise.all([
      this.adminDevApiWithAuth(user)?.meTenantsControllerFindAll(),
      this.adminStagingApiWithAuth(user)?.meTenantsControllerFindAll(),
      this.adminProdApiWithAuth(user)?.meTenantsControllerFindAll(),
    ])

    const tenantMap = new Map<string, TenantEnvironment[]>()

    for (const [index, env] of [
      Environment.Dev,
      Environment.Staging,
      Environment.Prod,
    ].entries()) {
      for (const tenant of tenants[index] ?? []) {
        if (!tenantMap.has(tenant.name)) {
          tenantMap.set(tenant.name, [])
        }

        // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
        tenantMap.get(tenant.name)!.push({
          name: tenant.name,
          environment: env,
          displayName: tenant.displayName,
        })
      }
    }

    const tenantArray: Tenant[] = []
    for (const [id, environments] of tenantMap.entries()) {
      tenantArray.push({
        id,
        environments,
      })
    }

    return {
      data: tenantArray,
      totalCount: tenantArray.length,
      pageInfo: { hasNextPage: false },
    }
  }
}
