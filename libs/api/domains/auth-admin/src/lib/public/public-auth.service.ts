import { Inject, Injectable } from '@nestjs/common'

import { PublicApi, CurrentPublicApi } from '@island.is/clients/auth/admin-api'
import { handle204 } from '@island.is/clients/middlewares'
import { Environment } from '@island.is/shared/types'

import { PublicAuthScope, PublicAuthTenant } from './public-auth.models'

const ADMIN_TENANT_ID = '@admin.island.is'

@Injectable()
export class PublicAuthService {
  constructor(
    @Inject(CurrentPublicApi) private readonly publicApi: PublicApi,
  ) {}

  private get currentEnvironment(): Environment {
    switch (process.env.ENVIRONMENT) {
      case 'prod':
        return Environment.Production
      case 'staging':
        return Environment.Staging
      default:
        return Environment.Development
    }
  }

  async getTenants(): Promise<PublicAuthTenant[]> {
    const tenants =
      (await handle204(this.publicApi.publicTenantsControllerFindAllRaw())) ??
      []

    return tenants
      .filter((tenant) => tenant.name !== ADMIN_TENANT_ID)
      .map((tenant) => ({
        id: tenant.name,
        displayName: tenant.displayName,
        nationalId: tenant.nationalId,
        availableEnvironments: [this.currentEnvironment],
      }))
      .filter((tenant) => Boolean(tenant.nationalId))
      .sort((a, b) => {
        const nameA =
          a.displayName.find(({ locale }) => locale === 'is')?.value ??
          a.displayName[0]?.value ??
          a.id
        const nameB =
          b.displayName.find(({ locale }) => locale === 'is')?.value ??
          b.displayName[0]?.value ??
          b.id

        return nameA.localeCompare(nameB, 'is')
      })
  }

  async getScopes(tenantId: string): Promise<PublicAuthScope[]> {
    if (tenantId === ADMIN_TENANT_ID) {
      return []
    }

    const scopes =
      (await handle204(
        this.publicApi.publicScopesControllerFindAllByTenantIdRaw({ tenantId }),
      )) ?? []

    return scopes
      .map((scope) => ({
        scopeName: scope.name,
        displayName: scope.displayName,
        description: scope.description,
        availableEnvironments: [this.currentEnvironment],
      }))
      .sort((a, b) => a.scopeName.localeCompare(b.scopeName, 'is'))
  }
}
