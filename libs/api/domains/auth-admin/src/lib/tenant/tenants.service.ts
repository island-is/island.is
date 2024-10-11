import { Injectable } from '@nestjs/common'
import groupBy from 'lodash/groupBy'

import { User } from '@island.is/auth-nest-tools'

import { environments } from '../shared/constants/environments'
import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { TenantEnvironment } from './models/tenant-environment.model'
import { TenantsPayload } from './dto/tenants.payload'
import { Tenant } from './models/tenant.model'

@Injectable()
export class TenantsService extends MultiEnvironmentService {
  async getTenants(user: User): Promise<TenantsPayload> {
    const tenantsSettledPromises = await Promise.allSettled(
      environments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meTenantsControllerFindAllRaw(),
        ),
      ),
    )

    const tenantsEnvironments: TenantEnvironment[] = this.handleSettledPromises(
      tenantsSettledPromises,
      {
        mapper: (tenants, index) =>
          tenants.map((tenant) => ({
            name: tenant.name,
            displayName: tenant.displayName,
            environment: environments[index],
          })),
        prefixErrorMessage: 'Failed to fetch tenants',
      },
    ).flat()

    const groupedTenants = groupBy(tenantsEnvironments, 'name')

    const tenants: Tenant[] = Object.entries(groupedTenants)
      .map(([tenantName, tenants]) => ({
        id: tenantName,
        environments: tenants,
      }))
      .sort((a, b) => a.id.localeCompare(b.id))

    return {
      data: tenants,
      totalCount: tenants.length,
      pageInfo: { hasNextPage: false },
    }
  }

  async getTenantById(id: string, user: User): Promise<Tenant> {
    const tenantSettledPromises = await Promise.allSettled(
      environments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meTenantsControllerFindByIdRaw({
            tenantId: id,
          }),
        ),
      ),
    )

    const tenantEnvironments: TenantEnvironment[] = this.handleSettledPromises(
      tenantSettledPromises,
      {
        mapper: (tenant, index): TenantEnvironment => ({
          ...tenant,
          environment: environments[index],
        }),
        prefixErrorMessage: `Failed to fetch tenant ${id}`,
      },
    )

    return {
      id,
      environments: tenantEnvironments,
    }
  }
}
