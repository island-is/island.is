import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { isDefined } from '@island.is/shared/utils'
import { Environment } from '@island.is/shared/types'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { CreateScopeInput } from './dto/create-scope.input'
import { CreateScopeResponse } from './dto/create-scope.response'
import { ScopesPayload } from './dto/scopes.payload'

const environments = [
  Environment.Development,
  Environment.Staging,
  Environment.Production,
]

@Injectable()
export class ScopeService extends MultiEnvironmentService {
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

    const scopes = scopesSettled
      .map((resp, index) => {
        if (resp.status === 'fulfilled' && resp.value) {
          return resp.value.map((scope) => ({
            scope,
            environment: environments[index],
          }))
        } else if (resp.status === 'rejected') {
          this.logger.error(
            `Failed to get scopes for environment ${environments[index]}`,
            resp.reason,
          )
        }
      })
      .filter(isDefined)
      .flat()

    return {
      data: scopes,
      totalCount: scopes.length,
      pageInfo: {
        hasNextPage: false,
      },
    }
  }

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

    return createdScopes
      .map((resp, index) => {
        if (resp.status === 'fulfilled' && resp.value) {
          return {
            scopeName: resp.value.name,
            environment: input.environments[index],
          }
        } else if (resp.status === 'rejected') {
          this.logger.error(
            `Failed to create scope ${input.name} in environment ${input.environments[index]}`,
            resp.reason,
          )
        }
      })
      .filter(isDefined)
  }
}
