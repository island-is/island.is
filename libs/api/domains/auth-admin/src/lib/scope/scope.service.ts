import { Injectable } from '@nestjs/common'
import groupBy from 'lodash/groupBy'

import { User } from '@island.is/auth-nest-tools'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { CreateScopeInput } from './dto/create-scope.input'
import { CreateScopeResponse } from './dto/create-scope.response'
import { ScopeInput } from './dto/scope.input'
import { Scope } from './models/scope.model'
import { ScopesPayload } from './dto/scopes.payload'
import { ScopeEnvironment } from './models/scope-environment.model'

const environments = [
  Environment.Development,
  Environment.Staging,
  Environment.Production,
]

@Injectable()
export class ScopeService extends MultiEnvironmentService {
  /**
   * Creates a scope for a specific tenant for the given environments
   */
  async createScope(
    user: User,
    input: CreateScopeInput,
  ): Promise<CreateScopeResponse[]> {
    const createdScopes = await Promise.allSettled(
      input.environments.map(async (environment) => {
        return this.adminApiByEnvironmentWithAuth(
          environment,
          user,
        )?.meScopesControllerCreate({
          tenantId: input.tenantId,
          clientCreateScopeDTO: {
            name: input.name,
            displayName: input.displayName,
            description: input.description,
          },
        })
      }),
    )

    return this.handleSettledPromises({
      promises: createdScopes,
      mapper: (scope, index) => ({
        scopeName: scope.name,
        environment: input.environments[index],
      }),
      prefixErrorMessage: `Failed to create scope ${input.name}`,
    })
  }

  async getScopes(user: User, tenantId: string): Promise<ScopesPayload> {
    const scopesSettled = await Promise.allSettled(
      environments.map((environment) =>
        this.adminApiByEnvironmentWithAuth(
          environment,
          user,
        )?.meScopesControllerFindAll({
          tenantId,
        }),
      ),
    )

    const scopeEnvironments = this.handleSettledPromises({
      promises: scopesSettled,
      mapper: (scopes, index) =>
        scopes.map(
          (scope) =>
            ({
              ...scope,
              environment: environments[index],
            } as ScopeEnvironment),
        ),
      prefixErrorMessage: `Failed to get scopes by tenantId ${tenantId}`,
    }).flat()

    const groupedScopes = groupBy(scopeEnvironments, 'name')

    const scopeModels: Scope[] = Object.entries(groupedScopes).map(
      ([scopeName, scopes]) => ({
        scopeName,
        environments: scopes,
      }),
    )

    return {
      data: scopeModels,
      totalCount: scopeModels.length,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

  async getScope(user: User, input: ScopeInput): Promise<Scope> {
    const scopesSettled = await Promise.allSettled(
      environments.map((environment) =>
        this.adminApiByEnvironmentWithAuth(
          environment,
          user,
        )?.meScopesControllerFindByName(input),
      ),
    )

    const environmentsScopes = this.handleSettledPromises({
      promises: scopesSettled,
      mapper: (scope, index) => ({
        ...scope,
        environment: environments[index],
      }),
      prefixErrorMessage: `Failed to get scope ${input.scopeName}`,
    })

    return {
      scopeName: input.scopeName,
      environments: environmentsScopes,
    }
  }
}
