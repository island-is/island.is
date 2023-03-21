import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { FetchError } from '@island.is/clients/middlewares'
import { Environment } from '@island.is/shared/types'

import { TenantEnvironment } from './models/tenant-environment.model'
import { TenantsPayload } from './dto/tenants.payload'
import { Tenant } from './models/tenant.model'
import { MultiEnvironmentService } from '../shared/services/multi-environment.service'

@Injectable()
export class TenantsService extends MultiEnvironmentService {
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
}
