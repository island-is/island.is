import { Injectable } from '@nestjs/common'
import groupBy from 'lodash/groupBy'

import { User } from '@island.is/auth-nest-tools'
import { Environment } from '@island.is/shared/types'

import { environments } from '../shared/constants/environments'
import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { CreateTenantInput } from './dto/create-tenant.input'
import { CreateTenantResponse } from './dto/create-tenant.response'
import { DeleteTenantInput } from './dto/delete-tenant.input'
import { PublishTenantInput } from './dto/publish-tenant.input'
import { TenantsPayload } from './dto/tenants.payload'
import { UpdateTenantInput } from './dto/update-tenant.input'
import { TenantEnvironment } from './models/tenant-environment.model'
import { Tenant } from './models/tenant.model'

@Injectable()
export class TenantsService extends MultiEnvironmentService {
  getAvailableEnvironments(): Environment[] {
    return this.getConfiguredEnvironments()
  }

  async getTenants(user: User): Promise<TenantsPayload> {
    const tenantsSettledPromises = await Promise.allSettled(
      environments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meTenantsControllerFindAllRaw(),
        ),
      ),
    )

    type TenantListEnvironment = TenantEnvironment & { nationalId?: string }

    const tenantsEnvironments: TenantListEnvironment[] =
      this.handleSettledPromises(tenantsSettledPromises, {
        mapper: (tenants, index) =>
          tenants.map(
            (tenant): TenantListEnvironment => ({
              name: tenant.name,
              displayName: tenant.displayName,
              environment: environments[index],
              nationalId: tenant.nationalId,
            }),
          ),
        prefixErrorMessage: 'Failed to fetch tenants',
      }).flat()

    const groupedTenants = groupBy(tenantsEnvironments, 'name')

    const tenants: Tenant[] = Object.entries(groupedTenants)
      .map(([tenantName, group]) => {
        const nationalId = group.find((env) => env.nationalId)?.nationalId
        return {
          id: tenantName,
          nationalId,
          environments: group.map(
            ({ name, displayName, environment }): TenantEnvironment => ({
              name,
              displayName,
              environment,
            }),
          ),
        }
      })
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

  async getTenantByIdForAdmin(id: string, user: User): Promise<Tenant> {
    const settled = await Promise.allSettled(
      environments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meTenantsControllerFindByIdForAdminRaw({
            tenantId: id,
          }),
        ),
      ),
    )

    const tenantEnvironments: TenantEnvironment[] = this.handleSettledPromises(
      settled,
      {
        mapper: (domain, index): TenantEnvironment => ({
          environment: environments[index],
          name: domain.name,
          displayName: [{ locale: 'is', value: domain.displayName }],
          nationalId: domain.nationalId,
          description: domain.description,
          organisationLogoKey: domain.organisationLogoKey,
          contactEmail: domain.contactEmail,
        }),
        prefixErrorMessage: `Failed to fetch admin details for tenant ${id}`,
      },
    )

    if (tenantEnvironments.length === 0) {
      throw new Error(`Tenant ${id} not found`)
    }

    const primary = tenantEnvironments[0]

    return {
      id,
      environments: tenantEnvironments,
      nationalId: primary.nationalId,
      contactEmail: primary.contactEmail,
      description: primary.description,
      organisationLogoKey: primary.organisationLogoKey,
    }
  }

  async createTenant(
    user: User,
    input: CreateTenantInput,
  ): Promise<CreateTenantResponse[]> {
    const settled = await Promise.allSettled(
      input.environments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meTenantsControllerCreateRaw({
            adminCreateTenantDto: {
              name: input.name,
              nationalId: input.nationalId,
              displayName: input.displayName,
              description: input.description,
              organisationLogoKey: input.organisationLogoKey,
              ...(input.contactEmail
                ? { contactEmail: input.contactEmail }
                : {}),
            },
          }),
        ),
      ),
    )

    return this.handleSettledPromises(settled, {
      mapper: (domain, index): CreateTenantResponse => ({
        name: domain.name,
        environment: input.environments[index],
      }),
      prefixErrorMessage: `Failed to create tenant ${input.name}`,
    })
  }

  async updateTenant(
    user: User,
    input: UpdateTenantInput,
  ): Promise<TenantEnvironment[]> {
    const {
      tenantId,
      environments: targetEnvironments,
      ...adminPatchTenantDto
    } = input

    if (Object.keys(adminPatchTenantDto).length === 0) {
      throw new Error('Nothing provided to update')
    }

    const settled = await Promise.allSettled(
      targetEnvironments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meTenantsControllerUpdateRaw({
            tenantId,
            adminPatchTenantDto,
          }),
        ),
      ),
    )

    return this.handleSettledPromises(settled, {
      mapper: (domain, index): TenantEnvironment => ({
        environment: targetEnvironments[index],
        name: domain.name,
        displayName: [{ locale: 'is', value: domain.displayName }],
        nationalId: domain.nationalId,
        description: domain.description,
        organisationLogoKey: domain.organisationLogoKey,
        contactEmail: domain.contactEmail,
      }),
      prefixErrorMessage: `Failed to update tenant ${tenantId}`,
    })
  }

  async publishTenant(
    user: User,
    input: PublishTenantInput,
  ): Promise<TenantEnvironment> {
    if (input.sourceEnvironment === input.targetEnvironment) {
      throw new Error('Source and target environments must be different')
    }

    const source = await this.makeRequest(
      user,
      input.sourceEnvironment,
      (sourceApi) =>
        sourceApi.meTenantsControllerFindByIdForAdminRaw({
          tenantId: input.tenantId,
        }),
    )

    if (!source) {
      throw new Error(
        `Tenant ${input.tenantId} not found in ${input.sourceEnvironment}`,
      )
    }

    const created = await this.makeRequest(
      user,
      input.targetEnvironment,
      (targetApi) =>
        targetApi.meTenantsControllerCreateRaw({
          adminCreateTenantDto: {
            name: source.name,
            nationalId: source.nationalId,
            displayName: source.displayName,
            description: source.description,
            organisationLogoKey: source.organisationLogoKey,
            ...(source.contactEmail
              ? { contactEmail: source.contactEmail }
              : {}),
          },
        }),
    )

    if (!created) {
      throw new Error(
        `Failed to publish tenant ${input.tenantId} to ${input.targetEnvironment}`,
      )
    }

    return {
      environment: input.targetEnvironment,
      name: created.name,
      displayName: [{ locale: 'is', value: created.displayName }],
      nationalId: created.nationalId,
      description: created.description,
      organisationLogoKey: created.organisationLogoKey,
      contactEmail: created.contactEmail,
    }
  }

  async deleteTenant(user: User, input: DeleteTenantInput): Promise<boolean> {
    const tenant = await this.getTenantByIdForAdmin(input.tenantId, user)

    const existingEnvironments = tenant.environments
      .map((env) => env.environment)
      .filter((env) => this.isEnvironmentConfigured(env))

    if (existingEnvironments.length === 0) {
      throw new Error(
        `Tenant ${input.tenantId} not found in any configured environment`,
      )
    }

    const results = await Promise.allSettled(
      existingEnvironments.map((environment) =>
        this.makeRequest(user, environment, (api) =>
          api.meTenantsControllerDeleteRaw({
            tenantId: input.tenantId,
          }),
        ),
      ),
    )

    const failures = results
      .map((result, index) => ({
        result,
        environment: existingEnvironments[index],
      }))
      .filter(
        (
          entry,
        ): entry is {
          result: PromiseRejectedResult
          environment: Environment
        } => entry.result.status === 'rejected',
      )

    if (failures.length > 0) {
      failures.forEach(({ result, environment }) => {
        this.logger.error(
          `Failed to delete tenant ${input.tenantId} in ${environment}`,
          result.reason,
        )
      })
      throw failures[0].result.reason
    }

    return true
  }
}
