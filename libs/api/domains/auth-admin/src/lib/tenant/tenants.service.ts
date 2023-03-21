import { Inject, Injectable } from '@nestjs/common'

import { Auth, AuthMiddleware, User } from '@island.is/auth-nest-tools'
import {
  AdminApi,
  AdminDevApi,
  AdminProdApi,
  AdminStagingApi,
} from '@island.is/clients/auth/admin-api'
import { FetchError } from '@island.is/clients/middlewares'
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

  private adminDevApiWithAuth(auth: Auth) {
    return this.adminDevApi?.withMiddleware(new AuthMiddleware(auth))
  }
  private adminStagingApiWithAuth(auth: Auth) {
    return this.adminStagingApi?.withMiddleware(new AuthMiddleware(auth))
  }
  private adminProdApiWithAuth(auth: Auth) {
    return this.adminProdApi?.withMiddleware(new AuthMiddleware(auth))
  }

  private handleError(error: Error) {
    if (error instanceof FetchError && error.status === 401) {
      // If 401 is returned we log it as info as it is intentional
      this.logger.info('Unauthorized request to admin api', error)
    } else {
      // Otherwise we log it as error
      this.logger.error('Error while fetching tenants', error)
    }

    // We swallow the errors
    return undefined
  }

  async getTenant(id: string): Promise<Tenant> {
    return {
      id: id,
      environments: [
        {
          name: id,
          environment: Environment.Production,
          displayName: [
            {
              locale: 'is',
              value: 'Ísland.is stjórnborð',
            },
          ],
        },
        {
          name: id,
          environment: Environment.Staging,
          displayName: [
            {
              locale: 'is',
              value: 'Ísland.is stjórnborð',
            },
          ],
        },
        {
          name: id,
          environment: Environment.Development,
          displayName: [
            {
              locale: 'is',
              value: 'Ísland.is stjórnborð',
            },
          ],
        },
      ],
    }
  }

  async getTenants(user: User): Promise<TenantsPayload> {
    const tenants = await Promise.all([
      this.adminDevApiWithAuth(user)
        ?.meTenantsControllerFindAll()
        .catch(this.handleError.bind(this)),
      this.adminStagingApiWithAuth(user)
        ?.meTenantsControllerFindAll()
        .catch(this.handleError.bind(this)),
      this.adminProdApiWithAuth(user)
        ?.meTenantsControllerFindAll()
        .catch(this.handleError.bind(this)),
    ])

    const tenantMap = new Map<string, TenantEnvironment[]>()

    for (const [index, env] of [
      Environment.Development,
      Environment.Staging,
      Environment.Production,
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

    // eslint-disable-next-line  @typescript-eslint/no-non-null-assertion
    tenantArray.sort((a, b) => a.id!.localeCompare(b.id!))

    return {
      data: tenantArray,
      totalCount: tenantArray.length,
      pageInfo: { hasNextPage: false },
    }
  }

  async getTenantById(id: string, user: User): Promise<Tenant> {
    const tenants = await Promise.all([
      this.adminDevApiWithAuth(user)
        ?.meTenantsControllerFindById({ id })
        .catch(this.handleError.bind(this)),
      this.adminStagingApiWithAuth(user)
        ?.meTenantsControllerFindById({ id })
        .catch(this.handleError.bind(this)),
      this.adminProdApiWithAuth(user)
        ?.meTenantsControllerFindById({ id })
        .catch(this.handleError.bind(this)),
    ])

    const tenantMap: TenantEnvironment[] = []

    for (const [index, env] of [
      Environment.Development,
      Environment.Staging,
      Environment.Production,
    ].entries()) {
      if (tenants[index]) {
        tenantMap.push({
          name: tenants[index]?.name ?? '',
          environment: env,
          displayName: tenants[index]?.displayName ?? [],
        })
      }
    }
    return {
      id: id,
      environments: tenantMap,
    } as Tenant
  }
}
