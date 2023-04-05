import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { TenantEnvironment } from './models/tenant-environment.model'
import { TenantsPayload } from './dto/tenants.payload'
import { Tenant } from './models/tenant.model'

@Injectable()
export class TenantsService extends MultiEnvironmentService {
  async getTenants(user: User): Promise<TenantsPayload> {
    const tenants = await Promise.all([
      this.adminDevApiWithAuth(user)
        ?.meTenantsControllerFindAll()
        .catch((error) => this.handleError(error, Environment.Development)),
      this.adminStagingApiWithAuth(user)
        ?.meTenantsControllerFindAll()
        .catch((error) => this.handleError(error, Environment.Staging)),
      this.adminProdApiWithAuth(user)
        ?.meTenantsControllerFindAll()
        .catch((error) => this.handleError(error, Environment.Production)),
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
        ?.meTenantsControllerFindById({ tenantId: id })
        .catch((error) => this.handleError(error, Environment.Development)),
      this.adminStagingApiWithAuth(user)
        ?.meTenantsControllerFindById({ tenantId: id })
        .catch((error) => this.handleError(error, Environment.Staging)),
      this.adminProdApiWithAuth(user)
        ?.meTenantsControllerFindById({ tenantId: id })
        .catch((error) => this.handleError(error, Environment.Production)),
    ])

    const tenantMap: TenantEnvironment[] = []

    for (const [index, env] of [
      Environment.Development,
      Environment.Staging,
      Environment.Production,
    ].entries()) {
      const tenant = tenants[index]
      if (tenant) {
        tenantMap.push({
          name: tenant.name,
          environment: env,
          displayName: tenant.displayName,
        })
      }
    }
    return {
      id: id,
      environments: tenantMap,
    }
  }
}
