import { Injectable } from '@nestjs/common'

import { User } from '@island.is/auth-nest-tools'
import { isDefined } from '@island.is/shared/utils'

import { MultiEnvironmentService } from '../shared/services/multi-environment.service'
import { CreateScopeInput } from './dto/create-scope.input'
import { CreateScopeResponse } from './dto/create-scope.response'

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
